"use server";
import { createClient } from "@/src/app/_library/supabase/server";

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

export { serverGetRecords };
