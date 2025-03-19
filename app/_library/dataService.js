import { supabase } from "./supabase";
import "server-only";
export const revalidate = 0;
export async function getRecords(id = null, limit = 10) {
  const { data, error } = await supabase.rpc("get_records", {
    _catalog_id: id,
    _max_results: limit,
  });
  if (error) {
    console.error(error.message);
  }
  return data;
}
