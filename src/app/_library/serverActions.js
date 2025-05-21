"use server";

import { createClient } from "@/src/app/_library/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OAuth2Request } from "./usps";
import { isDateExpired } from "./utilities";
import { Mutex } from "async-mutex";
import { Redis } from "@upstash/redis";

// Used for key/value storage (e.g., for USPS auth)
const redis = Redis.fromEnv();
// Constants for redis keys
const USPS_ACCESS_TOKEN = "USPS_ACCESS_TOKEN";
const USPS_ACCESS_TOKEN_EXPIRES_IN = "USPS_ACCESS_TOKEN_EXPIRES_IN";
const USPS_ACCESS_TOKEN_TYPE = "USPS_ACCESS_TOKEN_TYPE"; // Bearer
const USPS_ACCESS_TOKEN_ISSUED_AT = "USPS_ACCESS_TOKEN_ISSUED_AT";
// Used for acquiring locks on shared resources when updating
const mutex = new Mutex();

async function serverGetShoppingCart() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_shopping_cart");
  if (error) {
    console.log(`serverGetShoppingCart ${error.message}`);
  }
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
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_records", {
    _catalog_id: id,
    _max_results: limit,
  });
  if (error) {
    console.error(error.message);
  }
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
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const password = formData.get("password");
  const email = formData.get("email");
  const mailingList = Boolean(formData.get("mailingList"));
  const notifyList = Boolean(formData.get("notifyList"));
  console.log(`mailingList:${mailingList}, notifyList:${notifyList}`);
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
  // These values should probably be stored somewhere where they can be updated
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

function getBaseRatesRequestObject(sJson, itemCount) {
  // This function assumes the sJson string was stringified from
  // a client BaseRatesRequest class instance
  const { length, width, height } = getPackageDimensions(itemCount);
  const request = JSON.parse(sJson);
  request.length = length;
  request.width = width;
  request.height = height;
  request.mailClass = process.env.USPS_MAIL_CLASS;
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

async function serverGetUSPSRates(sJson, itemCount) {
  const request = getBaseRatesRequestObject(sJson, itemCount);
  // call oAuth to refresh the access token, if needed
  await oAuthUSPSRequest();
  const endpoint = process.env.USPS_API_URL + "/prices/v3/base-rates/search";
  try {
    const access_token = await redis.get(USPS_ACCESS_TOKEN);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const { error } = await response.json();
      console.log(error);
      throw new Error(`${error.code} - ${error.message}`);
    }
    const data = await response.json();
    data.handling =
      itemCount < process.env.HANDLING_SM_TH
        ? process.env.HANDLING_SM
        : itemCount < process.env.HANDLING_MD_TH
        ? process.env.HANDLING_MD
        : process.env.HANDLING_LG;
    return data;
  } catch (error) {
    const { message } = error;
    console.log(message);
    return { message };
  } finally {
    revalidatePath("/checkout");
  }
}

async function isUSPSTokenExpired() {
  const [token, token_issued_at, token_expires_in] = await Promise.all([
    redis.get(USPS_ACCESS_TOKEN),
    redis.get(USPS_ACCESS_TOKEN_ISSUED_AT),
    redis.get(USPS_ACCESS_TOKEN_EXPIRES_IN),
  ]);
  if (token && token_issued_at && token) {
    if (!isDateExpired(token_issued_at, token_expires_in)) {
      console.log(`The token isn't expired.`);
      // If the current token isn't expired, no need to re-auth
      return false;
    }
  }
  return true;
}
async function oAuthUSPSRequest() {
  let tokenExpired = await isUSPSTokenExpired();
  if (!tokenExpired) {
    return;
  }
  const release = await mutex.acquire();
  // double check expiration once again in case other ops were waiting
  // to acquire the lock. There's probably a better way to do this.
  tokenExpired = await isUSPSTokenExpired();
  if (!tokenExpired) {
    console.log("After mutex.acquire(), but token isn't expired.");
    release();
    return;
  }
  try {
    let oAuthRequest = new OAuth2Request(
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
    console.log(`access_token: ${access_token}`);
    // Update redis cache with USPS token info
    const p = Promise.all([
      redis.set(USPS_ACCESS_TOKEN, access_token),
      redis.set(USPS_ACCESS_TOKEN_EXPIRES_IN, expires_in),
      redis.set(USPS_ACCESS_TOKEN_TYPE, token_type),
      redis.set(USPS_ACCESS_TOKEN_ISSUED_AT, issued_at),
    ]);
    console.log(p);
  } catch (error) {
    console.log(error.message);
  } finally {
    // release the mutex lock
    release();
  }
}

export {
  serverDeleteUser,
  serverGetShoppingCart,
  serverGetRecords,
  serverGetUser,
  serverResend,
  serverResetPassword,
  serverSignIn,
  serverSignOut,
  serverSignUp,
  serverUpdateShoppingCart,
  serverUpdatePassword,
  serverUpdateUser,
  serverVerifyOtp,
  serverGetUSPSRates,
};
