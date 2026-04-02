"use server";
import { createClient } from "@/src/app/library/supabase/server";

interface ProductImage {
  url: string;
  height: number;
  width: number;
  uom: string;
}

interface Product {
  artist: string | undefined;
  catalogId: string;
  title: string;
  image: ProductImage | null;
  description: string;
  upc: string;
  productType: string;
  recordFormat: string;
  recordGenre: string;
  releaseDate: string;
  price: number;
  weight: number;
  attributes: unknown;
}

async function serverGetBuyNowProduct(catalogId: string): Promise<{ data: Product | null; error: unknown }> {
  const supabase = await createClient();
  console.log(`serverGetProduct -> catalogId:\n\t${catalogId}`);

  const { data, error } = await supabase
    .from("catalog")
    .select(`
      catalog_id,
      name,
      description,
      upc,
      product_type,
      record_format,
      record_genre,
      release_date,
      price,
      weight,
      item_attributes,
      artist(name),
      catalog_image_mm(image(uri, file_name, height, width, image_uom))
    `)
    .eq("catalog_id", catalogId)
    .not("release_date", "is", null)
    .eq("record_format", "Download")
    .maybeSingle();

  if (error) {
    console.error(error.message);
    return { data: null, error };
  }

  if (!data) return { data: null, error: null };

  const img = (data.catalog_image_mm as any)?.[0]?.image;
  const product: Product = {
    artist: (data.artist as any)?.name,
    catalogId: data.catalog_id,
    title: data.name,
    image: img
      ? { url: img.uri + img.file_name, height: img.height, width: img.width, uom: img.image_uom }
      : null,
    description: data.description,
    upc: data.upc,
    productType: data.product_type,
    recordFormat: data.record_format,
    recordGenre: data.record_genre,
    releaseDate: data.release_date,
    price: data.price,
    weight: data.weight,
    attributes: data.item_attributes,
  };

  return { data: product, error: null };
}

export { serverGetBuyNowProduct };
