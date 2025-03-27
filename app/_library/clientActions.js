"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/client";

const supabase = createClient();
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

async function dbUpdateCart(guestId, cartId, catalogId, count, email = null) {
  // console.log(`dbUpdateCart -> count=${count}`);
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

export { dbAddToCart, dbUpdateCart };
