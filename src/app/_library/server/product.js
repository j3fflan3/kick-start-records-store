"use server";
import { createClient } from "@/src/app/_library/supabase/server";

async function serverGetBuyNowProduct(catalogId) {
  const supabase = await createClient();
  console.log(`serverGetProduct -> catalogId:\n\t${catalogId}`);
  const { data, error } = await supabase.rpc("get_buy_now_product", {
    _catalog_id: catalogId,
  });
  if (error) {
    console.error(error.message);
  }

  return { data, error };
}

export { serverGetBuyNowProduct };
