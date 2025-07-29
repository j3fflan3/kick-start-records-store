"use server";

import { createClient } from "@/src/app/_library/supabase/server";
import { Redis } from "@upstash/redis";
import { Mutex } from "async-mutex";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { USPSOAuth2Request } from "./usps";
import {
  calculateTax,
  cartItemsWeight,
  cartTax,
  cartTotal,
  formatDollars,
  isDateExpired,
  printRecordFormat,
} from "./utilities";
import {
  DEFAULT_CURRENCY_CODE,
  DIGITAL_GOODS,
  GET_FROM_FILE,
  PayPal,
  PayPalAmount,
  PayPalBreakdown,
  PayPalExperienceContext,
  PayPalItem,
  PayPalName,
  PayPalOrder,
  PayPalPayee,
  PayPalPaymentSource,
  PayPalPurchaseUnit,
  PayPalShipping,
  PayPalSimpleAmount,
  PayPalUPC,
  PHYSICAL_GOODS,
} from "./paypal";
import { ApiError } from "@paypal/paypal-server-sdk";
import { Resend } from "resend";
import OrderEmailTemplate from "../_components/email/OrderEmailTemplate";

// Used for key/value storage (e.g., for USPS auth)
const redis = Redis.fromEnv();
// Constants for redis keys
const USPS_ACCESS_TOKEN = "USPS_ACCESS_TOKEN";
const USPS_ACCESS_TOKEN_EXPIRES_IN = "USPS_ACCESS_TOKEN_EXPIRES_IN";
const USPS_ACCESS_TOKEN_TYPE = "USPS_ACCESS_TOKEN_TYPE"; // Bearer
const USPS_ACCESS_TOKEN_ISSUED_AT = "USPS_ACCESS_TOKEN_ISSUED_AT";
const COUNTRIES = "COUNTRIES";
const COUNTRIES_EXPIRES_IN = "COUNTRIES_EXPIRES_IN";
const COUNTRIES_ISSUED_AT = "COUNTRIES_ISSUED_AT";
const CALIFORNIA_ZIPCODES = "CALIFORNIA_ZIPCODES";
const CALIFORNIA_ZIPCODES_EXPIRES_IN = "CALIFORNIA_ZIPCODES_EXPIRES_IN";
const CALIFORNIA_ZIPCODES_ISSUED_AT = "CALIFORNIA_ZIPCODES_ISSUED_AT";
const PAYPAL_TOKEN = "PAYPAL_TOKEN";
const PAYPAL_TOKEN_EXPIRES_IN = "PAYPAL_TOKEN_EXPIRES_IN";
const PAYPAL_TOKEN_ISSUED_AT = "PAYPAL_TOKEN_ISSUED_AT";

// Used for acquiring locks on shared resources when updating
const mutex = new Mutex();

async function serverGetShoppingCart() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_shopping_cart");
  if (error) {
    console.log(`serverGetShoppingCart ${error.message}`);
  }
  // revalidatePath("/cart");
  return { data, error };
}
async function serverUpdateShoppingCart(catalogId, count, email = null) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_shopping_cart", {
    _catalog_id: catalogId,
    _count: count,
    _email: email,
  });
  if (error) {
    console.log(`serverUpdateShoppingCart error: ${error.message}`);
  }
  revalidatePath("/cart");
  return { data, error };
}

async function serverGetRecords(id = null, limit = 10) {
  console.log("Top of serverGetRecords");

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_records", {
    _catalog_id: id,
    _max_results: limit,
  });
  if (error) {
    console.error(error.message);
  }
  console.log(
    `serverGetRecords -> data = ${data ? JSON.stringify(data) : data}`
  );

  return data;
}

const getURL = () => {
  // NOTE: environment URLs other than localhost should have no protocol, e.g., my-site.vercel.app
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.VERCEL_URL ?? // Automatically set by VERCEL.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

async function serverSignUp(prevState, formData) {
  let firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const password = formData.get("password");
  const email = formData.get("email");
  const mailingList = Boolean(formData.get("mailingList"));
  const notifyList = Boolean(formData.get("notifyList"));
  let conCheck = formData.get("continueCheckout");
  const continueCheckout = Boolean(formData.get("continueCheckout"));
  const billingSameAsShipping = Boolean(formData.get("billingSameAsShipping"));
  console.log(
    `serverSignUp -> conCheck:${conCheck}, continueCheckout:${continueCheckout}`
  );
  // These are blank during signup (and signup short form) and used as defaults
  // Therefore we use the same fields for both shipping and billing initially
  const address = formData.get("address");
  const addressContinued = formData.get("addressContinued");
  const city = formData.get("city");
  const stateProvince = formData.get("stateProvince");
  const postalCode = formData.get("postalCode");
  const destinationCountryCode = formData.get("destinationCountryCode");
  if (!firstName) {
    // If the user signed up at the checkout page, extract the name before the
    // @ sign in their email address.  This will be replaced by their actual name
    // in /checkout/shipping page later (if they fill it out)
    const at = email.indexOf("@");
    firstName = email.substring(0, at);
  }
  console.log(
    `mailingList:${mailingList}, notifyList:${notifyList}, continueCheckout:${continueCheckout}`
  );
  const encodedEmail = encodeURIComponent(email);
  const captchaToken = formData.get("captchaToken");
  console.log(captchaToken);
  const redirectURL =
    getURL() +
    `account/check-email/${encodedEmail}?action=signup&captchaToken=${captchaToken}`;

  const supabase = await createClient();
  console.log(`redirectURL: ${redirectURL}`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName,
        lastName,
        captchaToken,
        mailingList,
        notifyList,
        continueCheckout,
        billingSameAsShipping,
        shippingAddress: {
          address,
          addressContinued,
          city,
          stateProvince,
          postalCode,
          destinationCountryCode,
        },
        billingAddress: {
          address,
          addressContinued,
          city,
          stateProvince,
          postalCode,
          destinationCountryCode,
        },
      },
    },
  });
  if (error) {
    console.log(error);
    return { data, error };
  }
  redirect(redirectURL);
}
// Not currently used.
async function serverVerifyOtp({ type, token_hash }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({ type, token_hash });
  return { error };
}

async function serverSignIn(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  let message = "success";
  if (error) {
    console.log(error);
    message = "error";
  }
  return { message };
}

async function serverSignOut(scope = "local") {
  const supabase = await createClient();

  // scope: "local" only kills the user's current session.
  // Other sessions on other devices remain logged in.
  const { error } = await supabase.auth.signOut({ scope });
  if (error) {
    console.log(error);
  }
  revalidatePath("/");
  return { error };
}

async function serverResetPassword(prevState, formData) {
  let message = "success";
  const email = formData.get("email");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    console.log(error);
    message =
      "There was a problem sending you a reset password email. Please try again.";
  }
  revalidatePath("/account/reset-password");
  return { message };
}

async function serverUpdatePassword(prevState, formData) {
  const new_password = formData.get("password");

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: new_password });
  let message = "success";
  if (error) {
    console.log(error.code, error.name, error.message);
    switch (error.code) {
      case "same_password":
        message =
          "Password has been previously used.  Please create a new password.";
        break;
      case "weak_password":
        message =
          "Password must be at least 8 characters in length and contain at least one of the following: Uppercase letter, lowercase letter, number, and special character (#?!@$%^&*-)";
        break;
      default:
        message = "error";
    }
  }
  return { message };
}

async function serverUpdateUser(prevState, formData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const mailingList = !!formData.get("mailingList");
  const notifyList = !!formData.get("notifyList");
  console.log(`mailingList=${mailingList}`);
  console.log(`notifyList=${notifyList}`);

  const supabase = await createClient();
  const { error } = supabase.auth.updateUser({
    email,
    data: {
      firstName,
      lastName,
      mailingList,
      notifyList,
    },
  });
  revalidatePath("/account/profile");
  if (error) {
    console.log(error.message);
    const message = "error";
    return { message };
  }
  const redirectTo = getURL() + "account/profile";
  redirect(redirectTo);
}
async function serverUpdateAnonUser(prevState, formData) {
  const email = formData.get("email");
  const zipCode = formData.get("zipcode");
  const redirectURL = formData.get("redirect");
  const supabase = await createClient();
  const { error } = supabase.auth.updateUser({
    email,
    data: {
      zipCode,
    },
  });
  revalidatePath("/checkout/signin");
  if (error) {
    console.log(error.message);
    const message = "error";
    return { message };
  }
  const redirectTo =
    getURL() + redirectURL + `/${email}?action=signupAnonymous&captchaToken=`;
  redirect(redirectTo);
}
async function serverGetUser() {
  const supabase = await createClient();
  return await supabase.auth.getUser();
}

async function serverDeleteUser(userId) {
  const errorMessage =
    "There was an error deleting your account.  Please try again. If this error continues, contact support@kickstartrecords.com";
  let message = "success";
  const supabase = await createClient(true);
  const { error } = await supabase.auth.admin.deleteUser(userId, true);
  if (error) {
    console.log(error);
    message = errorMessage;
  }
  return { message };
}
async function serverResend(prevState, formData) {
  const email = formData.get("email");

  const supabase = await createClient();
  console.log(`serverResend email: ${email}`);
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
  });
  let message = "Confirmation email successfully sent.";
  if (error) {
    message =
      "There was an error resending your confirmation email.  Please try again.";
    console.log(error);
  }
  revalidatePath("/account/check-email");
  return { message };
}

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

async function serverGetUSPSRates(sBaseRatesRequest, itemCount) {
  const request = getBaseRatesRequestObject(sBaseRatesRequest, itemCount);
  const intl = request?.foreignPostalCode ?? false;
  const sRequest = JSON.stringify(request);
  console.log(`serverGetUSPSRates -> sRequest:\n ${sRequest}`);
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
    console.log(`serverGetUSPSRates -> data: ${JSON.stringify(data)}`);

    return data;
  } catch (error) {
    const { message } = error;
    console.log(message);
    return { message };
  } finally {
    revalidatePath("/checkout");
  }
}

class CacheObject {
  constructor(item, issuedAt, expiresIn) {
    this.item = item;
    this.issuedAt = issuedAt;
    this.expiresIn = expiresIn;
  }
}

async function isCacheItemExpired({ item, issuedAt, expiresIn }) {
  const [_item, _issuedAt, _expiresIn] = await Promise.all([
    redis.get(item),
    redis.get(issuedAt),
    redis.get(expiresIn),
  ]);
  if (_item && _issuedAt && _expiresIn) {
    if (!isDateExpired(_issuedAt, _expiresIn)) {
      console.log(`${item} isn't expired`);
      return false;
    }
  }
  return true;
}

async function oAuthUSPSRequest() {
  const cacheObj = new CacheObject(
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
async function populateCountries() {
  const cacheObj = new CacheObject(
    COUNTRIES,
    COUNTRIES_ISSUED_AT,
    COUNTRIES_EXPIRES_IN
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
    console.log(
      "populateCountries: After mutex.acquire(), but token isn't expired."
    );
    release();
    return;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("country")
      .select("name, alpha2")
      .eq("forbidden", false)
      .order("name", { ascending: true });
    if (error) throw error;
    const sData = JSON.stringify(data);
    console.log(sData);
    const [item, expires, issued] = await Promise.all([
      redis.set(COUNTRIES, sData),
      redis.set(COUNTRIES_EXPIRES_IN, 60 * 60 * 24 * 7), // a week in seconds
      redis.set(COUNTRIES_ISSUED_AT, Date.now()),
    ]);
    console.log(
      `set item: ${item}\n
       set expires_in: ${expires}\n
       set issued_at: ${issued}`
    );
  } catch (error) {
    console.log(error);
  } finally {
    release();
  }
}

async function serverGetCountries() {
  await populateCountries();
  const countries = await redis.get(COUNTRIES);
  const data = Array.isArray(countries) ? countries : JSON.parse(countries);
  return { data };
}

async function populateCaliforniaZips() {
  const cacheObj = new CacheObject(
    CALIFORNIA_ZIPCODES,
    CALIFORNIA_ZIPCODES_ISSUED_AT,
    CALIFORNIA_ZIPCODES_EXPIRES_IN
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
    console.log(
      "populateCaliforniaZips: After mutex.acquire(), but token isn't expired."
    );
    release();
    return;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("california_zip_codes")
      .select("code")
      .order("code", { ascending: true });
    if (error) throw error;
    const sData = JSON.stringify(data);
    const [item, expires, issued] = await Promise.all([
      redis.set(CALIFORNIA_ZIPCODES, sData),
      redis.set(CALIFORNIA_ZIPCODES_EXPIRES_IN, 60 * 60 * 24 * 7), // a week in seconds
      redis.set(CALIFORNIA_ZIPCODES_ISSUED_AT, Date.now()),
    ]);
    console.log(
      `set item: ${item}\n
       set expires_in: ${expires}\n
       set issued_at: ${issued}`
    );
  } catch (error) {
    console.log(error);
  } finally {
    release();
  }
}

async function serverIsCaliforniaZip(postalCode) {
  await populateCaliforniaZips();
  const caliZips = await redis.get(CALIFORNIA_ZIPCODES);
  const aCaliZips = Array.isArray(caliZips) ? caliZips : JSON.parse(caliZips);
  // Note: postalCode should be first 5 zip characters
  return aCaliZips.find((zip) => postalCode === zip);
}

async function oAuthPayPalRequest() {
  const cacheObj = new CacheObject(
    PAYPAL_TOKEN,
    PAYPAL_TOKEN_ISSUED_AT,
    PAYPAL_TOKEN_EXPIRES_IN
  );
  let tokenExpired = await isCacheItemExpired(cacheObj);
  if (!tokenExpired) return;

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
    const auth_credentials = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");
    // PayPal's oauth2 token endpoint
    const oath_api_url = `${process.env.PAYPAL_API_URL}/v1/oauth2/token`;

    const response = await fetch(oath_api_url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth_credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!response.ok) {
      throw new Error(`oAuthUSPSRequest: ${response.status}`);
    }
    const { access_token, expires_in } = await response.json();
    const issued_at = Date.now();
    const [token, expires, issued] = await Promise.all([
      redis.set(PAYPAL_TOKEN, access_token),
      redis.set(PAYPAL_TOKEN_EXPIRES_IN, expires_in),
      redis.set(PAYPAL_TOKEN_ISSUED_AT, issued_at),
    ]);
    console.log(`token: ${token}\expires: ${expires}\nissued: ${issued}`);
  } catch (error) {
    console.error(`Error retrieving PayPal access token: ${error.message}`);
  } finally {
    release();
  }
}

async function serverCreateOrderPlaceholder(shoppingCartId, email) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_order_placeholder", {
    _shopping_cart_id: shoppingCartId,
    _email: email,
  });
  if (error) {
    console.error(error.message);
  }
  console.log(
    `serverCreateOrderPlaceholder -> {data, error} ${JSON.stringify(
      data
    )}, ${JSON.stringify(error)}}`
  );
  return { data, error };
}

function getPayPalAmount(cart, shippingCents, taxCents) {
  console.log(
    `getPayPalAmount\n\t${JSON.stringify(
      cart
    )}\n\tshippingCents: ${shippingCents}\n\ttaxCents: ${taxCents}`
  );

  // Shipping and tax must be numbers
  const total = cartTotal(cart);
  const combinedTotal = cartTotal(
    cart,
    Number(shippingCents),
    Number(taxCents)
  );
  let tax = "0.00";
  if (taxCents > 0) {
    tax = (taxCents / 100).toFixed(2);
  }
  let shipping = "0.00";
  if (shippingCents > 0) {
    shipping = (shippingCents / 100).toFixed(2);
  }
  const item_total = new PayPalSimpleAmount(DEFAULT_CURRENCY_CODE, total);
  const shipping_total = new PayPalSimpleAmount(
    DEFAULT_CURRENCY_CODE,
    shipping
  );
  // Handling is hard coded as "0.00" for now.
  const handling_total = new PayPalSimpleAmount(DEFAULT_CURRENCY_CODE, "0.00");
  const tax_total = new PayPalSimpleAmount(DEFAULT_CURRENCY_CODE, tax);
  const breakdown = new PayPalBreakdown(
    item_total,
    shipping_total,
    handling_total,
    tax_total
  );

  return new PayPalAmount(DEFAULT_CURRENCY_CODE, combinedTotal, breakdown);
}

// taxPercentFloat should be either 0, or a float representing a percentage
// e.g, 10.25% would be .1025
function getPayPalItems(cart, taxPercentageFloat) {
  return cart.map((item) => {
    const category =
      printRecordFormat(cart.recordFormat) === "Download"
        ? DIGITAL_GOODS
        : PHYSICAL_GOODS;

    const unit_amount = new PayPalSimpleAmount(
      DEFAULT_CURRENCY_CODE,
      formatDollars(item.price)
    );

    let tax_amount = new PayPalSimpleAmount(DEFAULT_CURRENCY_CODE, "0.00");
    if (taxPercentageFloat > 0) {
      tax = calculateTax(taxPercentageFloat, item.price);
      tax_amount = new PayPalSimpleAmount(
        DEFAULT_CURRENCY_CODE,
        (tax / 100).toFixed(2)
      );
    }
    // hard coding the api path "records" for now.
    // TODO: Need to come up with a reusable
    // design to dynamically set the api path info.
    const itemURL = `${getURL()}records/${item.catalogId}`;
    return new PayPalItem(
      item.title,
      item.count,
      item.description,
      category,
      itemURL,
      item.image.url,
      unit_amount,
      tax_amount,
      item.sku ?? "",
      item.upc ? new PayPalUPC("UPC-A", item.upc) : null
    );
  });
}

async function serverCreateOrder(sCreateOrderArgs) {
  const coa = JSON.parse(sCreateOrderArgs);
  console.log(`createOrderArgs: ${JSON.stringify(coa)}`);
  const {
    cart,
    email,
    shippingCostCents,
    taxPercentageFloat,
    billingSame,
    firstName,
    lastName,
    shippingAddress,
    billingFirstName,
    billingLastName,
    billAddress,
  } = coa;
  const orderShipAdd = {
    ...shippingAddress,
    firstName,
    lastName,
  };
  const orderBillAdd = {
    ...billAddress,
    firstName: billingFirstName,
    lastName: billingLastName,
  };
  console.log(
    `orderShipAdd = ${JSON.stringify(
      orderShipAdd
    )}\norderBillAdd = ${JSON.stringify(orderBillAdd)}`
  );

  if (
    orderShipAdd.postal_code === "" ||
    (!billingSame && orderBillAdd.postal_code === "")
  )
    return {
      data: null,
      error: { message: "Shipping and/or Billing address is required." },
      httpStatusCode: 500,
    };
  const { shopping_cart_id: shoppingCartId } = cart[0];
  const { data, error } = await serverCreateOrderPlaceholder(
    shoppingCartId,
    email
  );
  if (error) throw new Error(error.message);
  const { order_number: invoice_id, order_id: reference_id } = data;

  // Make sure the access_token isn't expired
  await oAuthPayPalRequest();
  const create_order_endpoint = `${process.env.PAYPAL_API_URL}/v2/checkout/orders`;
  // first, items array
  const payPalItems = getPayPalItems(cart, taxPercentageFloat);
  console.log(
    `serverCreateOrder\n\t payPalItems = ${JSON.stringify(payPalItems)}`
  );

  // getPayPalAmount
  let tax = 0;
  if (taxPercentageFloat > 0) {
    tax = cartTax(cart, taxPercentageFloat);
    console.log(`tax: ${tax}\n`);
  }
  const payPalAmount = getPayPalAmount(cart, shippingCostCents, tax);
  // Payee
  const payee = new PayPalPayee(
    process.env.PAYPAL_MERCHANT_EMAIL,
    process.env.PAYPAL_MERCHANT_ID
  );
  const description = `Kickstart Records order #${invoice_id}`;
  const fullName = new PayPalName(`${firstName} ${lastName}`);
  const shipping = new PayPalShipping(
    "SHIPPING",
    fullName,
    email,
    null,
    shippingAddress
  );
  const purchaseUnit = new PayPalPurchaseUnit(
    reference_id,
    invoice_id,
    description,
    payPalAmount,
    payee,
    payPalItems,
    shipping
  );
  console.log(`PayPalPurchaseUnit = ${JSON.stringify(purchaseUnit)}`);

  const baseURL = getURL();
  const return_url = `${baseURL}checkout/order-placed`;
  const cancel_url = `${baseURL}checkout/payment`;
  // payment source
  const experienceContext = new PayPalExperienceContext(
    "SET_PROVIDED_ADDRESS",
    return_url,
    cancel_url,
    billAddress
  );
  console.log(`experienceContext = ${JSON.stringify(experienceContext)}`);

  const payPal = new PayPal(experienceContext);
  const paymentSource = new PayPalPaymentSource(payPal, null);
  // purchaseUnit must be an array.
  const payload = new PayPalOrder([purchaseUnit], paymentSource);
  console.log(
    `serverCreateOrder \n\t PayPal payload = ${JSON.stringify(payload)}`
  );
  const accessToken = await redis.get(PAYPAL_TOKEN);
  const response = await fetch(create_order_endpoint, {
    headers: {
      "Content-Type": "application/json",
      "PayPal-Request-Id": `${reference_id}`,
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  try {
    const result = await handlePayPalResponse(response);
    console.log(`serverCreateOrder -> result = \n\t${JSON.stringify(result)}`);

    return result;
  } catch (err) {
    console.log(`PayPal error: ${err.message}`);
    throw err;
  }
}

async function handlePayPalResponse(response) {
  try {
    const json = await response.json();
    return {
      data: json,
      error: null,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}
async function sendOrderEmail(email, orderId, orderNumber, firstName) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const orderLink = `${getURL()}checkout/order-placed/${orderId}`;
    console.log(
      `\n\ntop of sendOrderEmail\n\nemail:${email}\norderNumber:${orderNumber}\nfirstName:${firstName}`
    );

    const { data, error } = await resend.emails.send({
      from: "Kick Start Records <info@kickstartrecords.com>",
      to: [`${email}`],
      bcc: ["info@kickstartrecords.com"],
      subject: `Kick Start Records Order #${orderNumber}`,
      react: OrderEmailTemplate({ orderNumber, firstName, orderLink }),
    });
    console.log(
      `sendOrderEmail:\n\tdata:\t${JSON.stringify(data)}\n\terror:\t${JSON.stringify(error)}`
    );
  } catch (error) {
    console.log(`error sending order email: ${JSON.stringify(error)}`);
  }
}
async function serverCaptureOrder(orderId) {
  // Make sure the access_token isn't expired
  await oAuthPayPalRequest();
  const capture_order_endpoint = `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`;
  console.log(`capture_order_endpoint: ${capture_order_endpoint}`);

  const accessToken = await redis.get(PAYPAL_TOKEN);

  try {
    const response = await fetch(capture_order_endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: "{}",
    });
    const { data } = await handlePayPalResponse(response);
    const { email_address: email } = data.purchase_units[0].shipping;
    const { given_name: firstName } = data.payer.name;
    const { invoice_id: orderNumber } =
      data.purchase_units[0].payments.captures[0];
    await sendOrderEmail(email, orderId, orderNumber, firstName);
    return data;
  } catch (err) {
    console.log(`serverCaptureOrder: ${JSON.stringify(err)}`);
    if (err instanceof ApiError) {
      throw new Error(error.message);
    }
  }
}

async function serverUpdateOrder(sCapturedOrderArgs) {
  console.log(`sCapturedOrderArgs = ${sCapturedOrderArgs}`);
  const coa = JSON.parse(sCapturedOrderArgs);
  const { _paypal_capture_response, _subtotal, _shipping } = coa;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_order", {
    _paypal_capture_response,
    _subtotal,
    _shipping,
  });
  if (error) {
    console.error(error.message);
  }
  console.log(
    `serverUpdateOrder -> {data, error} ${JSON.stringify(
      data
    )}, ${JSON.stringify(error)}}`
  );
  return { data, error };
}

async function serverGetOrderDetail(_order_id, _email = null) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_order_detail", {
    _order_id,
    _email,
  });
  if (error) {
    console.log(`error: ${JSON.stringify(error)}`);
  }
  return { data, error };
}

export {
  serverDeleteUser,
  serverGetCountries,
  serverGetRecords,
  serverGetShoppingCart,
  serverGetUser,
  serverGetUSPSRates,
  serverResend,
  serverResetPassword,
  serverSignIn,
  serverSignOut,
  serverSignUp,
  serverUpdateAnonUser,
  serverUpdatePassword,
  serverUpdateShoppingCart,
  serverUpdateUser,
  serverVerifyOtp,
  serverIsCaliforniaZip,
  serverCreateOrder,
  serverCaptureOrder,
  serverUpdateOrder,
  serverGetOrderDetail,
};
