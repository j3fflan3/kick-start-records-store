import { createClient } from "@/src/app/_library/supabase/client";

async function clientGetShoppingCart() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_shopping_cart");
  if (error) {
    console.log(`clientGetShoppingCart ${error.message}`);
  }
  return { data, error };
}

async function clientUpdateShoppingCart(catalogId, count, email = null) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_shopping_cart", {
    _catalog_id: catalogId,
    _count: count,
    _email: email,
  });
  if (error) {
    console.log(`clientUpdateShoppingCart error: ${error.message}`);
  }
  return { data, error };
}

// Merge the carts of the anonUserId with logged in userId
// or just replace anonUserId with userId if logged in user
// doesn't already have a cart.
async function clientMergeShoppingCarts(anonUserId) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("merge_shopping_carts", {
    _anon_user_id: anonUserId,
  });
  if (error) {
    console.log(error.message);
  }
  return { data, error };
}

async function clientAddToShoppingCart(
  catalogId,
  is_anonymous = false,
  count = 1
) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("add_to_shopping_cart", {
    _catalog_id: catalogId,
    _is_anonymous: is_anonymous,
    _count: count,
  });

  if (error) {
    console.log(error.message);
  }
  return { data, error };
}

export {
  clientGetShoppingCart,
  clientUpdateShoppingCart,
  clientMergeShoppingCarts,
  clientAddToShoppingCart,
};
