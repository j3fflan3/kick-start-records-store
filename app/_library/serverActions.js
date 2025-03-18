"use server";

import { notFound } from "next/navigation";
import { supabase } from "./supabase";
import "server-only";

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
  return { data, error };
}
async function dbGetCart(guestId, cartId) {
  const { data, error } = await supabase.rpc("get_cart", {
    _guest_id: guestId,
    _cart_id: cartId,
  });
  if (error) {
    console.log(`dbGetCart ${error}`);
    return undefined;
  }
  return { data };
}

export { dbGetCart, dbAddToCart };
