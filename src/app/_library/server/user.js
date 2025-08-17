"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/app/_library/supabase/server";
import { getURL } from "@/src/app/_library/server/utilities";

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

export {
  serverDeleteUser,
  serverGetUser,
  serverResend,
  serverResetPassword,
  serverSignUp,
  serverUpdatePassword,
  serverUpdateUser,
};
