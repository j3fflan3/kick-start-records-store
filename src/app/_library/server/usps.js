import {
  newCacheObject,
  isCacheItemExpired,
  getRedis,
} from "@/src/app/_library/server/redis";
import { Mutex } from "async-mutex";
import { USPSOAuth2Request } from "@/src/app/_library/model/usps";

const USPS_ACCESS_TOKEN = "USPS_ACCESS_TOKEN";
const USPS_ACCESS_TOKEN_EXPIRES_IN = "USPS_ACCESS_TOKEN_EXPIRES_IN";
const USPS_ACCESS_TOKEN_TYPE = "USPS_ACCESS_TOKEN_TYPE"; // Bearer
const USPS_ACCESS_TOKEN_ISSUED_AT = "USPS_ACCESS_TOKEN_ISSUED_AT";
const mutex = new Mutex();
const redis = await getRedis();

function getDateForUSPS() {
  const today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  const year = today.getFullYear();
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  return year + "-" + month + "-" + day;
}

function getPackageDimensions(itemCount) {
  let length = 0;
  let width = 0;
  let height = 0;
  // TODO: These values should be stored somewhere where they can be updated
  // via config file or DB lookup.
  if (itemCount < Number(process.env.HANDLING_SM_TH)) {
    length = 8;
    width = 7.25;
  } else if (itemCount < Number(process.env.HANDLING_MD_TH)) {
    length = 6;
    width = 5;
    height = 5;
  } else {
    length = 11;
    width = 11;
    height = 5;
  }
  return { length, width, height };
}

function getBaseRatesRequestObject(sBaseRatesRequest, itemCount) {
  // This function assumes the sBaseRatesRequest string was stringified from
  // a client USBaseRatesRequest class or InternationalRatesRequest instance
  const { length, width, height } = getPackageDimensions(itemCount);
  const request = JSON.parse(sBaseRatesRequest);
  const intl = request?.foreignPostalCode ?? false;
  request.originZIPCode = process.env.USPS_ORIGIN_ZIPCODE;
  request.length = length;
  request.width = width;
  request.height = height;
  request.mailClass = intl
    ? process.env.USPS_MAIL_CLASS_INTL
    : process.env.USPS_MAIL_CLASS;
  request.processingCategory = process.env.USPS_PROCESSING_CATEGORY;
  request.rateIndicator = process.env.USPS_RATE_INDICATOR;
  request.destinationEntryFacilityType =
    process.env.USPS_DEST_ENTRY_FACILITY_TYPE;
  request.priceType = process.env.USPS_PRICE_TYPE;
  request.mailingDate = getDateForUSPS();
  request.accountType = process.env.USPS_ACCOUNT_TYPE;
  request.accountNumber = process.env.USPS_ACCOUNT_NUMBER;
  return request;
}

async function getUSPSRates(sBaseRatesRequest, itemCount) {
  const request = getBaseRatesRequestObject(sBaseRatesRequest, itemCount);
  const intl = request?.foreignPostalCode ?? false;
  const sRequest = JSON.stringify(request);
  console.log(`getUSPSRates -> sRequest:\n ${sRequest}`);
  // call oAuth to refresh the access token, if needed
  await oAuthUSPSRequest();
  const apiPath = intl
    ? "/international-prices/v3/base-rates/search"
    : "/prices/v3/base-rates/search";
  const endpoint = process.env.USPS_API_URL + apiPath;
  console.log(endpoint);
  try {
    const access_token = await redis.get(USPS_ACCESS_TOKEN);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: sRequest,
    });
    if (!response.ok) {
      const { error } = await response.json();
      console.log(error);
      throw new Error(`${error.code} - ${error.message}`);
    }
    const data = await response.json();
    // Add a handling field to the returned data object
    data.handling =
      itemCount < Number(process.env.HANDLING_SM_LT)
        ? process.env.HANDLING_SM
        : itemCount < Number(process.env.HANDLING_MD_LT)
          ? process.env.HANDLING_MD
          : process.env.HANDLING_LG;
    console.log(`getUSPSRates -> data: ${JSON.stringify(data)}`);

    return data;
  } catch (error) {
    const { message } = error;
    console.log(message);
    return { message };
  } finally {
    revalidatePath("/checkout");
  }
}

async function oAuthUSPSRequest() {
  const cacheObj = await newCacheObject(
    USPS_ACCESS_TOKEN,
    USPS_ACCESS_TOKEN_ISSUED_AT,
    USPS_ACCESS_TOKEN_EXPIRES_IN
  );
  let tokenExpired = await isCacheItemExpired(cacheObj);
  if (!tokenExpired) {
    return;
  }
  const release = await mutex.acquire();
  // double check expiration once again in case other ops were waiting
  // to acquire the lock.
  tokenExpired = await isCacheItemExpired(cacheObj);
  if (!tokenExpired) {
    console.log("After mutex.acquire(), but token isn't expired.");
    release();
    return;
  }
  try {
    let oAuthRequest = new USPSOAuth2Request(
      "client_credentials",
      process.env.USPS_CLIENT_ID,
      process.env.USPS_CLIENT_SECRET,
      ""
    );
    const endpoint = process.env.USPS_API_URL + "/oauth2/v3/token";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(oAuthRequest),
    });

    if (!response.ok) {
      throw new Error(`oAuthUSPSRequest: ${response.status}`);
    }
    const { access_token, expires_in, token_type, issued_at } =
      await response.json();
    // Update redis cache with USPS token info
    const [token, expires, type, issued] = await Promise.all([
      redis.set(USPS_ACCESS_TOKEN, access_token),
      redis.set(USPS_ACCESS_TOKEN_EXPIRES_IN, expires_in),
      redis.set(USPS_ACCESS_TOKEN_TYPE, token_type),
      redis.set(USPS_ACCESS_TOKEN_ISSUED_AT, issued_at),
    ]);
    console.log(
      `set access_token: ${token}
       set expires_in: ${expires}
       set token_type: ${type}
       set issued_at: ${issued}`
    );
  } catch (error) {
    console.log(error.message);
  } finally {
    // release the mutex lock
    release();
  }
}

export { getUSPSRates };
