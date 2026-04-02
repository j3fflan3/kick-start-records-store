"use server";
import { createClient } from "@/src/app/library/supabase/server";

interface RecordImage {
  url: string;
  height: number;
  width: number;
  uom: string;
}

interface CatalogRecord {
  artist: string | undefined;
  catalogId: string;
  title: string;
  image: RecordImage | null;
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

async function serverGetRecords(id: string | null = null, limit: number = 10): Promise<CatalogRecord[] | null> {
  const supabase = await createClient();
  let query = supabase
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
    .order("release_date", { ascending: false })
    .limit(limit);

  if (id) {
    query = query.eq("catalog_id", id);
  } else {
    query = query.not("release_date", "is", null);
  }

  const { data, error } = await query;
  if (error) {
    console.error(error.message);
  }
  return data?.map((record) => {
    const img = (record.catalog_image_mm as any)?.[0]?.image;
    return {
      artist: (record.artist as any)?.name,
      catalogId: record.catalog_id,
      title: record.name,
      image: img
        ? { url: img.uri + img.file_name, height: img.height, width: img.width, uom: img.image_uom }
        : null,
      description: record.description,
      upc: record.upc,
      productType: record.product_type,
      recordFormat: record.record_format,
      recordGenre: record.record_genre,
      releaseDate: record.release_date,
      price: record.price,
      weight: record.weight,
      attributes: record.item_attributes,
    };
  }) ?? null;
}

export { serverGetRecords };
