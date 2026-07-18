import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/home/hero";
import { CategoryMarquee } from "@/components/home/category-marquee";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { SocialProof, StatsStrip, ClosingCTA } from "@/components/home/social-proof";

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: items }, { data: categories }, { data: settings }] = await Promise.all([
    supabase.from("items").select("*").eq("is_available", true).order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("shop_settings").select("*").single(),
  ]);

  const categoryMap = Object.fromEntries(
    (categories ?? []).map((c: any) => [c.id, c.name])
  );

  return (
    <>
      <Hero isOpenOverride={settings?.is_open_override} />
      <CategoryMarquee />
      <FeaturedGrid items={items ?? []} categories={categoryMap} />
      <SocialProof />
      <StatsStrip
        followers={settings?.followers_count ?? 4250}
        rating={Number(settings?.rating ?? 4.5)}
      />
      <ClosingCTA />
    </>
  );
}
