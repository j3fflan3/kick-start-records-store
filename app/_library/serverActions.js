"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";

async function dbAddToCart(guestId, cartId, catalogId, count = 1) {
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
async function dbGetCart(guestId, cartId) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_cart", {
    _guest_id: guestId,
    _cart_id: cartId,
  });
  if (error) {
    console.log(`dbGetCart ${error}`);
  }
  return { data, error };
}

async function dbUpdateCart(guestId, cartId, catalogId, count, email = null) {
  const supabase = await createClient();
  console.log(`dbUpdateCart -> count=${count}`);
  const { data, error } = await supabase.rpc("update_cart", {
    _guest_id: guestId,
    _cart_id: cartId,
    _catalog_id: catalogId,
    _count: count,
    _email: email,
  });
  if (error) {
    console.log(`dbUpdateCart error: ${error.message}`);
  }
  revalidatePath("/cart");
  return { data, error };
}
async function dbGetRecords(id = null, limit = 10) {
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
async function dbSignUp(prevState, formData) {
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

async function dbVerifyOtp({ type, token_hash }) {
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });
  return { error };
}

async function dbSignIn({ email, password }) {
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

async function dbSignOut() {
  const supabase = await createClient();
  // scope: "local" only kills the user's current session.
  // Other sessions on other devices remain logged in.
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) console.log(error);
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
    console.log(error);
    message = "error";
  }
  return { message };
}
export {
  dbAddToCart,
  dbGetCart,
  dbGetRecords,
  dbSignIn,
  dbSignOut,
  dbSignUp,
  dbUpdateCart,
  dbVerifyOtp,
  serverResetPassword,
  serverUpdatePassword,
};
