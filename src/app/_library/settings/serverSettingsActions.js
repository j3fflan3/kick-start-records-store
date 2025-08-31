"use server";

import { createClient } from "@/src/app/_library/supabase/server";

/*
Specifically for signed up users (not guests at checkout)
*/
async function serverSaveUserAddress(sUserShippingData) {
  const userMetada = JSON.parse(sUserShippingData);
  console.log(userMetada);
  const supabase = await createClient();
  const { data, error } = supabase.auth.updateUser({ data: userMetada });
  if (error) {
    console.log(
      `error updating user address(es): ${JSON.stringify(error, null, 2)}`
    );
  }
  return { data, error };
}
export { serverSaveUserAddress };
