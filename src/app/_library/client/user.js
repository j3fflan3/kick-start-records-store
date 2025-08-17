"use client";

import { createClient } from "@/src/app/_library/supabase/client";

const supabase = createClient();

async function clientSignIn(currentState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
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

async function clientSignOut(scope = "local") {
  // scope: "local" only kills the user's current session.
  // Other sessions on other devices remain logged in.
  const { error } = await supabase.auth.signOut({ scope });
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

async function clientUpdateAnonymousUserWithEmail(email) {
  return await supabase.auth.updateUser({
    email,
  });
}

async function clientGetJWT() {
  return await supabase.rpc("get_jwt");
}
export { clientSignIn, clientSignOut };
