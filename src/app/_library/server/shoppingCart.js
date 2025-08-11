import { createClient } from "../supabase/server";

async function serverGetShoppingCart() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_shopping_cart");
  if (error) {
    console.log(`serverGetShoppingCart ${error.message}`);
  }
  // revalidatePath("/cart");
  return { data, error };
}
async function serverUpdateShoppingCart(catalogId, count, email = null) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_shopping_cart", {
    _catalog_id: catalogId,
    _count: count,
    _email: email,
  });
  if (error) {
    console.log(`serverUpdateShoppingCart error: ${error.message}`);
  }
  revalidatePath("/cart");
  return { data, error };
}

export { serverGetShoppingCart, serverUpdateShoppingCart };
