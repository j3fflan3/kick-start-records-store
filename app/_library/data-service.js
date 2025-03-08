import { supabase } from "./supabase";

export async function getRecords(id = null, limit = 10) {
  const { data, error } = await supabase.rpc("get_records");
  if (error) {
    console.error(error.message);
  }
  return data;
}
