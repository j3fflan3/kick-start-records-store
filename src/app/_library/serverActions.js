"use server";

import { createClient } from "@/src/app/_library/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OAuth2Request } from "./usps";
import { isDateExpired } from "./utilities";

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

async function serverGetUSPSRates(request, itemCount) {
  // class BaseRatesRequest
  request.accountType = "EPS";
  request.accountNumber = process.env.USPS_ACCOUNT_NUMBER;
  // call oAuth to refresh the access token, if needed
  await oAuthUSPSRequest();
  const endpoint = process.env.USPS_API_URL + "/prices/v3/base-rates/search";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.USPS_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const { code, message } = await response.json();
      throw new Error(`${code}-${message}`);
    }
    const data = await response.json();
    data.handling =
      itemCount < process.env.USPS_HANDLING_SM_TH
        ? process.env.USPS_HANDLING_SM
        : itemCount < process.env.USPS_HANDLING_MD_TH
        ? process.env.USPS_HANDLING_MD
        : process.env.USPS_HANDLING_LG;
    return data;
  } catch (error) {
    const { message } = error;
    console.log(message);
    return { message };
  }
}

async function oAuthUSPSRequest() {
  if (
    process.env.USPS_ACCESS_TOKEN !== "" &&
    process.env.USPS_ACCESS_TOKEN_ISSUED_AT !== "" &&
    process.env.USPS_ACCESS_TOKEN_EXPIRES_IN !== ""
  ) {
    if (
      !isDateExpired(
        process.env.USPS_ACCESS_TOKEN_ISSUED_AT,
        process.env.USPS_ACCESS_TOKEN_EXPIRES_IN
      )
    ) {
      // If the current token isn't expired, no need to re-auth
      return;
    }
  }
  let oAuthRequest = new OAuth2Request(
    "client_credentials",
    process.env.USPS_CLIENT_ID,
    process.env.USPS_CLIENT_SECRET,
    ""
  );
  const endpoint = process.env.USPS_API_URL + "/oauth2/v3/token";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(oAuthRequest),
    });

    if (!response.ok) {
      const { code, message } = await response.json();
      throw new Error(`${code}-${message}`);
    }
    const { access_token, expires_in, token_type, issued_at } =
      await response.json();
    process.env.USPS_ACCESS_TOKEN = access_token;
    process.env.USPS_ACCESS_TOKEN_EXPIRES_IN = expires_in;
    process.env.USPS_ACCESS_TOKEN_TYPE = token_type;
    process.env.USPS_ACCESS_TOKEN_ISSUED_AT = issued_at;
  } catch (error) {
    console.log(error.message);
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
