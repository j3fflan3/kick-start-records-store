"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/app/_library/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Not currently used.
async function serverAddToCart(guestId, cartId, catalogId, count = 1) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data, error } = await supabase.rpc("add_to_cart", {
    _guest_id: guestId,
    _cart_id: cartId,
    _catalog_id: catalogId,
    _email: null,
    _count: count,
  });
  if (error) {
    console.log(error.message);
  }
  revalidatePath("/cart");
  return { data, error };
}
async function serverGetCart(guestId, cartId) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.rpc("get_cart", {
    _guest_id: guestId,
    _cart_id: cartId,
  });
  if (error) {
    console.log(`serverGetCart ${error}`);
  }
  return { data, error };
}
// Not currently used.
async function serverUpdateCart(
  guestId,
  cartId,
  catalogId,
  count,
  email = null
) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.rpc("update_cart", {
    _guest_id: guestId,
    _cart_id: cartId,
    _catalog_id: catalogId,
    _count: count,
    _email: email,
  });
  if (error) {
    console.log(`serverUpdateCart error: ${error.message}`);
  }
  revalidatePath("/cart");
  return { data, error };
}

async function serverGetRecords(id = null, limit = 10) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

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
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
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

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
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
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { error } = await supabase.auth.verifyOtp({ type, token_hash });
  return { error };
}

async function serverSignIn(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

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

async function serverSignOut() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // scope: "local" only kills the user's current session.
  // Other sessions on other devices remain logged in.
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) console.log(error);
  revalidatePath("/");
}

async function serverResetPassword(prevState, formData) {
  const email = formData.get("email");

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  let message = "success";
  if (error) {
    console.log(error);
    message = "error";
  }
  return { message };
}

async function serverUpdatePassword(prevState, formData) {
  const new_password = formData.get("password");
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

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
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
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
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  return await supabase.auth.getUser();
}

async function serverResend(prevState, formData) {
  const email = formData.get("email");
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  console.log(`serverResend email: ${email}`);
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
  });
  if (error) {
    console.log(error);
  }
  console.log(data);
  return { data, error };
}
export {
  serverAddToCart,
  serverGetCart,
  serverGetRecords,
  serverSignIn,
  serverSignOut,
  serverSignUp,
  serverUpdateCart,
  serverVerifyOtp,
  serverResetPassword,
  serverUpdatePassword,
  serverUpdateUser,
  serverGetUser,
  serverResend,
};
