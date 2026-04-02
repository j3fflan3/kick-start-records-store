"use server";

import { createClient } from "@/src/app/library/supabase/server";

/*
Specifically for signed up users (not guests at checkout)
*/
async function serverSaveUserAddress(sUserShippingData: string): Promise<{ data: unknown; error: unknown }> {
  const userMetada = JSON.parse(sUserShippingData);
  console.log(userMetada);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({ data: userMetada });
  if (error) {
    console.log(
      `error updating user address(es): ${JSON.stringify(error, null, 2)}`
    );
  }
  return { data, error };
}

export { serverSaveUserAddress };
