"use client";

import { createClient } from "@/src/app/_library/supabase/client";

const supabase = createClient();

async function clientGetUserId() {
  return await supabase.rpc("get_user_id");
}

async function clientAddToCart(guestId, cartId, catalogId, count = 1) {
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
  return { data, error };
}

async function clientSignIn(currentState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  let message = "success";
  if (error) {
    console.error(error);
    message = "error";
  }
  return { message };
}

async function clientSignOut() {
  // scope: "local" only kills the user's current session.
  // Other sessions on other devices remain logged in.
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) console.log(error);
}

async function clientSignInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.log(error);
  }
  return { data, error };
}

async function clientSignUpWithEmail(currentState, formData) {
  const email = formData.get("email");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: {
        firstName,
        lastName,
      },
      shouldCreateUser: true,
      emailRedirectTo: "/records",
    },
  });
}

export {
  clientGetUserId,
  clientAddToCart,
  clientSignIn,
  clientSignOut,
  clientSignInAnonymously,
  clientSignUpWithEmail,
};
