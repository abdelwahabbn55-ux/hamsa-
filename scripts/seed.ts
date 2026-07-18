import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function main() {
  if (!url || !key) {
    console.error("Missing Supabase env vars in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  // Read the JSON file
  const jsonPath = resolve(process.cwd(), "hamsa_menu.json");
  const rawData = readFileSync(jsonPath, "utf-8");
  const menuData = JSON.parse(rawData);

  // Query existing categories and items
  const { data: existingCats } = await supabase.from("categories").select("*");
  const { data: existingItems } = await supabase.from("items").select("*");

  let sortOrderCat = 1;

  for (const cat of menuData.categories) {
    // Check if category already exists
    let catId = existingCats?.find(c => c.name === cat.name)?.id;

    if (!catId) {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: cat.name,
          sort_order: sortOrderCat
        })
        .select()
        .single();
        
      if (error || !data) {
        console.warn("Failed to insert category:", cat.name, error?.message);
        continue;
      }
      catId = data.id;
    }
    sortOrderCat++;

    let sortOrderItem = 1;
    for (const item of cat.items) {
      const exists = existingItems?.some(i => i.name === item.name && i.category_id === catId);
      
      if (!exists) {
        const { error } = await supabase.from("items").insert({
          category_id: catId,
          name: item.name,
          description: item.description || null,
          price: item.price,
          image_url: item.image || null,
          sort_order: sortOrderItem
        });
        if (error) {
          console.warn("Failed to insert item:", item.name, error.message);
        }
      }
      sortOrderItem++;
    }
  }

  await supabase.from("shop_settings").upsert({
    id: 1,
    whatsapp_number: menuData.contact?.phone || "0542734809",
    followers_count: 4250,
    rating: 4.5,
  });

  console.log("Seed complete with data from hamsa_menu.json!");
}

main();
