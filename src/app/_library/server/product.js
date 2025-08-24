"use server";
import { createClient } from "@/src/app/_library/supabase/server";

async function serverGetProduct(catalogId) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_product", {
    _catalog_id: catalogId,
  });
  if (error) {
    console.error(error.message);
  }
  return data;
}

export { serverGetProduct };
