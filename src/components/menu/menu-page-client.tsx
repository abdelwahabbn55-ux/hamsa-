"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category, MenuItem } from "@/types/database";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { ItemModal } from "@/components/menu/item-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function MenuPageClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const loadMenu = async () => {
    setLoading(true);
    setError(false);
    try {
      const supabase = createClient();
      const [{ data: cats }, { data: menuItems }] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase
          .from("items")
          .select("*")
          .eq("is_available", true)
          .order("sort_order"),
      ]);
      setCategories(cats ?? []);
      setItems(menuItems ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const filtered = useMemo(() => {
    let result = items;
    if (activeCategory !== "all") {
      result = result.filter((i) => i.category_id === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, activeCategory, search]);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    // Small delay to allow re-render before scrolling
    setTimeout(() => {
      const el = document.getElementById(`cat-${id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="min-h-screen">
      {/* Sticky header with search + category tabs */}
      <div className="border-b border-line bg-cream/95 backdrop-blur-xl sticky top-[65px] z-30">
        <div className="mx-auto max-w-6xl px-4 pt-5 pb-0 md:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-espresso leading-tight">
                Notre menu
              </h1>
              {!loading && items.length > 0 && (
                <p className="text-xs text-espresso/40 mt-0.5">
                  {items.length} plats disponibles
                </p>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-espresso/35 pointer-events-none" />
            <input
              placeholder="Rechercher un plat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-11 w-full rounded-2xl border border-line bg-cream-soft pl-11 pr-10 text-sm text-espresso placeholder:text-espresso/35 focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/15 transition-colors"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-espresso/10 hover:bg-espresso/20 transition-colors"
                >
                  <X className="h-3 w-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Category tabs */}
          <div
            ref={tabsRef}
            className="flex gap-1.5 overflow-x-auto pb-0 scrollbar-hide -mx-4 px-4"
          >
            <CategoryTab
              id="all-tab"
              label="Tout"
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            />
            {categories.map((cat) => (
              <CategoryTab
                key={cat.id}
                id={`tab-${cat.id}`}
                label={cat.name}
                active={activeCategory === cat.id}
                onClick={() => scrollToCategory(cat.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {/* Error state */}
        {error && (
          <div className="rounded-[20px] border border-rust/20 bg-rust/5 p-10 text-center">
            <p className="text-2xl mb-3">😕</p>
            <p className="font-display text-lg font-semibold text-espresso">
              Connexion impossible
            </p>
            <p className="mt-2 text-sm text-espresso/50 max-w-[260px] mx-auto">
              Vérifiez votre connexion internet et réessayez
            </p>
            <button
              onClick={loadMenu}
              className="mt-5 text-sm font-medium text-rust hover:text-rust/80 underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && !error && (
          <div className="space-y-10">
            {[1, 2].map((group) => (
              <div key={group}>
                <Skeleton className="h-7 w-36 mb-5" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-[20px] border border-line overflow-hidden"
                    >
                      <Skeleton className="aspect-[4/3] rounded-none" />
                      <div className="p-4 space-y-2.5">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty search results */}
        {!loading && !error && filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-display text-xl font-semibold text-espresso">
              Aucun résultat pour &ldquo;{search}&rdquo;
            </p>
            <p className="mt-2 text-sm text-espresso/45 max-w-[240px] mx-auto">
              Essayez un autre mot-clé ou parcourez toutes les catégories
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-5 text-sm font-medium text-espresso/60 hover:text-espresso underline"
            >
              Effacer la recherche
            </button>
          </div>
        )}

        {/* Menu categories */}
        {!loading && !error && (
          <div>
            {categories.map((cat) => {
              const catItems = filtered.filter((i) => i.category_id === cat.id);
              if (catItems.length === 0) return null;
              return (
                <section
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  className="mb-14 scroll-mt-52"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="font-display text-2xl font-semibold text-espresso">
                      {cat.name}
                    </h2>
                    <div className="flex-1 h-px bg-line" />
                    <span className="text-xs text-espresso/35 font-medium">
                      {catItems.length} article{catItems.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catItems.map((item, i) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        index={i}
                        onOpenDetail={setSelectedItem}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Item detail modal */}
      <ItemModal
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      />
    </div>
  );
}

function CategoryTab({
  id,
  label,
  active,
  onClick,
}: {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={cn(
        "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors mb-3",
        active ? "text-cream" : "text-espresso/55 hover:text-espresso"
      )}
    >
      {active && (
        <motion.span
          layoutId="menu-category-pill"
          className="absolute inset-0 rounded-full bg-espresso shadow-sm"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative">{label}</span>
    </button>
  );
}
