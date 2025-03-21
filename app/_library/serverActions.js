"use server";

import { notFound } from "next/navigation";
import { supabase } from "./supabase";
import "server-only";
import { revalidatePath } from "next/cache";

async function dbAddToCart(guestId, cartId, catalogId, count = 1) {
  const { data, error } = await supabase.rpc("add_to_cart", {
    _guest_id: guestId,
    _cart_id: cartId,
    _catalog_id: catalogId,
    _email: null,
    _count: count,
  });
  if (error) {
    console.log(error.message);
  }
  revalidatePath("/cart");
  return { data, error };
}
async function dbGetCart(guestId, cartId) {
  const { data, error } = await supabase.rpc("get_cart", {
    _guest_id: guestId,
    _cart_id: cartId,
  });
  if (error) {
    console.log(`dbGetCart ${error}`);
  }
  return { data, error };
}

async function dbUpdateCart(guestId, cartId, catalogId, count, email = null) {
  console.log(`dbUpdateCart -> count=${count}`);
  const { data, error } = await supabase.rpc("update_cart", {
    _guest_id: guestId,
    _cart_id: cartId,
    _catalog_id: catalogId,
    _count: count,
    _email: email,
  });
  if (error) {
    console.log(`dbUpdateCart error: ${error.message}`);
  }
  revalidatePath("/cart");
  return { data, error };
}
async function dbGetRecords(id = null, limit = 10) {
  const { data, error } = await supabase.rpc("get_records", {
    _catalog_id: id,
    _max_results: limit,
  });
  if (error) {
    console.error(error.message);
  }
  return data;
}
export { dbGetRecords, dbGetCart, dbAddToCart, dbUpdateCart };
