"use client";

import { createClient } from "@/src/app/library/supabase/client";
import { revalidatePathForClient } from "../server/utilities";

const supabase = createClient();

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  mailingList: boolean;
  notifyList: boolean;
}

async function clientSignIn(currentState: unknown, formData: FormData): Promise<{ message: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
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

async function clientSignOut(scope: "local" | "global" | "others" = "local"): Promise<void> {
  // scope: "local" only kills the user's current session.
  // Other sessions on other devices remain logged in.
  const { error } = await supabase.auth.signOut({ scope });
  if (error) console.log(error);
}

async function clientUpdateUser(userData: UserData): Promise<string> {
  const { firstName, lastName, email, mailingList, notifyList } = userData;
  const { error } = await supabase.auth.updateUser({
    email,
    data: {
      firstName,
      lastName,
      mailingList,
      notifyList,
    },
  });
  let message = "success";
  if (error) {
    message = "error";
    console.log(error.message);
  }
  revalidatePathForClient("/account/profile");
  return message;
}

async function clientSignInAnonymously(): Promise<{ data: unknown; error: unknown }> {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.log(error);
  }
  return { data, error };
}

async function clientSignUpWithEmail(currentState: unknown, formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  await supabase.auth.signInWithOtp({
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

async function clientUpdateAnonymousUserWithEmail(email: string): Promise<unknown> {
  return await supabase.auth.updateUser({
    email,
  });
}

async function clientGetJWT(): Promise<unknown> {
  return await supabase.rpc("get_jwt");
}

export { clientSignIn, clientSignOut, clientUpdateUser };
