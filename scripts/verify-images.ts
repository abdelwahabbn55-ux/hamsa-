/**
 * scripts/verify-images.ts
 * 
 * Verifies integrity of image_url values in the Supabase items table:
 *  (a) Flags any item whose image_url file doesn't exist in /public/
 *  (b) Flags any two items sharing the exact same image_url (mapping bug)
 *  (c) Flags items still pointing to external URLs (tablebeep.com, etc.)
 *
 * Usage:  npx tsx scripts/verify-images.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);

  const { data: items, error } = await supabase
    .from("items")
    .select("id, name, image_url")
    .order("name");

  if (error || !items) {
    console.error("❌  Could not fetch items:", error?.message);
    process.exit(1);
  }

  console.log(`\n🔍  Verifying ${items.length} items...\n`);

  const seenUrls = new Map<string, string[]>(); // url → [item names]
  const missingFiles: string[] = [];
  const externalUrls: string[] = [];
  const duplicateUrls: string[] = [];
  const noImage: string[] = [];

  for (const item of items) {
    if (!item.image_url) {
      noImage.push(item.name);
      continue;
    }

    // Track duplicates
    const existing = seenUrls.get(item.image_url) ?? [];
    existing.push(item.name);
    seenUrls.set(item.image_url, existing);

    // Check if external
    if (item.image_url.startsWith("http")) {
      externalUrls.push(`  • ${item.name}  →  ${item.image_url}`);
      continue;
    }

    // Check if local file exists
    const filePath = resolve(process.cwd(), "public", item.image_url.replace(/^\//, ""));
    if (!existsSync(filePath)) {
      missingFiles.push(`  • ${item.name}  →  ${item.image_url}  (FILE NOT FOUND: ${filePath})`);
    }
  }

  // Find duplicates
  for (const [url, names] of seenUrls.entries()) {
    if (names.length > 1) {
      duplicateUrls.push(`  • "${url}" shared by:\n${names.map(n => `      - ${n}`).join("\n")}`);
    }
  }

  // ── Report ─────────────────────────────────────────────────────────────────
  if (missingFiles.length) {
    console.log(`❌  Missing local files (${missingFiles.length}):`);
    missingFiles.forEach(l => console.log(l));
    console.log();
  }

  if (externalUrls.length) {
    console.log(`⚠️   Items still using external URLs (${externalUrls.length}):`);
    externalUrls.forEach(l => console.log(l));
    console.log();
  }

  if (duplicateUrls.length) {
    console.log(`🔁  Duplicate image_url values (mapping bug!) (${duplicateUrls.length}):`);
    duplicateUrls.forEach(l => console.log(l));
    console.log();
  }

  if (noImage.length) {
    console.log(`📷  Items with no image (intentional — needs photo) (${noImage.length}):`);
    noImage.forEach(n => console.log(`  • ${n}`));
    console.log();
  }

  if (!missingFiles.length && !duplicateUrls.length && !externalUrls.length) {
    console.log(`✅  All images are correctly mapped with local files and no duplicates!`);
  }

  console.log(`\nSummary: ${items.length} items | ${noImage.length} no-photo | ${externalUrls.length} external | ${missingFiles.length} missing files | ${duplicateUrls.length} duplicate URLs\n`);
}

main().catch(console.error);
