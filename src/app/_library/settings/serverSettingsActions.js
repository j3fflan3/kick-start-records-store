"use server";

import { createClient } from "@/src/app/_library/supabase/server";
import { Redis } from "@upstash/redis";
import { Mutex } from "async-mutex";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/*
Specifically for signed up users (not guests at checkout)
*/
async function serverSaveUserAddress(prevState, formData) {
  const firstName = formData.get("first_name");
  const lastName = formData.get("last_name");
  const destinationCountryCode = formData.get("country");
  const address = formData.get("address");
  const addressContinued = formData.get("address_continued");
  const city = formData.get("city");
  const stateProvince = formData.get("state_province");
  const postalCode = formData.get("postal_code");
  const billingSameAsShipping = Boolean(
    formData.get("billingSameAsShipping") === "true"
  );
  const userData = {
    firstName,
    lastName,
    shippingAddress: {
      address,
      addressContinued,
      city,
      stateProvince,
      postalCode,
      destinationCountryCode,
    },
    billingSameAsShipping,
  };
  if (!billingSameAsShipping) {
    const billingDestinationCountryCode = formData.get("billing_country");
    const billingAddress = formData.get("billing_address");
    const billingAddressContinued = formData.get("billing_address_continued");
    const billingCity = formData.get("billing_city");
    const billingStateProvince = formData.get("billing_state_province");
    const billingPostalCode = formData.get("billing_postal_code");
    userData.billingAddress = {
      billingAddress: address,
      billingAddressContinued: addressContinued,
      billingCity: city,
      billingStateProvince: stateProvince,
      billingPostalCode: postalCode,
      billingDestinationCountryCode: destinationCountryCode,
    };
  }

  const supabase = await createClient();
  // We need to update the auth.users table
  const { data, error } = supabase.auth.updateUser({ data: userData });
  if (error) {
    console.error(`serverSaveUserAddress error -> ${JSON.stringify(error)}`);
  }
  return { data, error };
}

export { serverSaveUserAddress };
