import { createClient } from "@/src/app/library/supabase/server";
import { revalidatePath } from "next/cache";

const CART_SELECT = `
  shopping_cart_catalog_mm(
    count,
    catalog(
      name,
      description,
      catalog_id,
      record_format,
      price,
      weight,
      sku,
      upc,
      artist(name),
      catalog_image_mm(image(uri, file_name, height, width, image_uom))
    )
  )
`;

interface CartImage {
  url: string;
  height: number;
  width: number;
  uom: string;
}

interface CartItem {
  shopping_cart_id?: string;
  title: string;
  artist: string | undefined;
  description: string;
  image: CartImage | null;
  catalogId: string;
  recordFormat: string;
  count: number;
  price: number;
  weight: number;
  sku: string;
  upc: string;
}

function transformCartItems(cartRows: any[] | null, includeCartId: boolean = false): CartItem[] | null {
  const items = cartRows?.flatMap((cart) =>
    cart.shopping_cart_catalog_mm.map((item: any) => {
      const c = item.catalog;
      const img = c.catalog_image_mm?.[0]?.image;
      return {
        ...(includeCartId && { shopping_cart_id: cart.shopping_cart_id }),
        title: c.name,
        artist: c.artist?.name,
        description: c.description,
        image: img
          ? { url: img.uri + img.file_name, height: img.height, width: img.width, uom: img.image_uom }
          : null,
        catalogId: c.catalog_id,
        recordFormat: c.record_format,
        count: item.count,
        price: c.price,
        weight: c.weight,
        sku: c.sku,
        upc: c.upc,
      };
    })
  );
  if (!items?.length) return null;
  return items.sort((a: CartItem, b: CartItem) => a.title.localeCompare(b.title));
}

async function serverGetShoppingCart(): Promise<{ data: CartItem[] | null; error: unknown }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: null };

  const { data, error } = await supabase
    .from("shopping_cart")
    .select(`shopping_cart_id, ${CART_SELECT}`)
    .eq("user_id", user.id)
    .is("fulfilled", null)
    .eq("state", "Cart");

  if (error) {
    console.log(`serverGetShoppingCart ${error.message}`);
  }
  const cartItems = transformCartItems(data, true);
  console.log(
    `/src/app/_library/server/shoppingCart.ts -> serverGetShoppingCart -> data = ${(JSON.stringify(cartItems), null, 2)}`
  );
  return { data: cartItems, error };
}

async function serverUpdateShoppingCart(catalogId: string, count: number, email: string | null = null): Promise<{ data: CartItem[] | null; error: unknown }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: null };

  // Find user's active cart
  const { data: cart } = await supabase
    .from("shopping_cart")
    .select("shopping_cart_id")
    .eq("user_id", user.id)
    .is("fulfilled", null)
    .eq("state", "Cart")
    .maybeSingle();

  if (cart) {
    const scid = cart.shopping_cart_id;

    // Check if the item exists in the cart
    const { count: itemCount } = await supabase
      .from("shopping_cart_catalog_mm")
      .select("*", { count: "exact", head: true })
      .eq("shopping_cart_id", scid)
      .eq("catalog_id", catalogId);

    if (itemCount && itemCount > 0) {
      await supabase
        .from("shopping_cart")
        .update({ updated: new Date().toISOString() })
        .eq("shopping_cart_id", scid);

      if (count === 0) {
        await supabase
          .from("shopping_cart_catalog_mm")
          .delete()
          .eq("shopping_cart_id", scid)
          .eq("catalog_id", catalogId);
      } else {
        await supabase
          .from("shopping_cart_catalog_mm")
          .update({ count })
          .eq("shopping_cart_id", scid)
          .eq("catalog_id", catalogId);
      }
    }
  }

  // Return the updated cart
  const { data, error } = await supabase
    .from("shopping_cart")
    .select(CART_SELECT)
    .eq("user_id", user.id)
    .is("fulfilled", null)
    .eq("state", "Cart");

  if (error) {
    console.log(`serverUpdateShoppingCart error: ${error.message}`);
  }
  revalidatePath("/cart");
  return { data: transformCartItems(data), error };
}

export { serverGetShoppingCart, serverUpdateShoppingCart };
