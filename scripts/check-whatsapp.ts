import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("shop_settings")
    .select("whatsapp_number")
    .single();

  if (error) {
    console.error("Error fetching from Supabase:", error);
    return;
  }

  console.log("=== LIVE SUPABASE DATA ===");
  console.log(`WhatsApp Number: "${data.whatsapp_number}"`);
}

main();
