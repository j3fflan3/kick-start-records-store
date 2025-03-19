import { createClient } from "@supabase/supabase-js";
import "server-only";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    db: { schema: "product" },
  }
);
