"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";

// Not currently used.
async function serverAddToCart(guestId, cartId, catalogId, count = 1) {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
  console.log(`serverUpdateCart -> count=${count}`);
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
async function serverSignUp(prevState, formData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const password = formData.get("password");
  const email = formData.get("email");
  const captchaToken = formData.get("captchaToken");
  console.log(captchaToken);
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName,
        lastName,
        captchaToken,
      },
    },
  });
  if (error) {
    console.log(error);
  }
  return { data, error };
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

async function serverSignOut() {
  const supabase = await createClient();
  // scope: "local" only kills the user's current session.
  // Other sessions on other devices remain logged in.
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) console.log(error);
  revalidatePath("/");
}

async function serverResetPassword(prevState, formData) {
  const email = formData.get("email");
  const supabase = await createClient();
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
};
