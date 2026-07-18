"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "@/types/database";
import { formatPrice } from "@/lib/utils";

interface FeaturedGridProps {
  items: MenuItem[];
  categories: Record<string, string>;
}

const layouts = [
  "md:col-span-2 md:row-span-2",   // Large card (first item)
  "md:col-span-1 md:row-span-1",   // Normal card
  "md:col-span-1 md:row-span-1",   // Normal card
  "md:col-span-1 md:row-span-2",   // Tall card
  "md:col-span-1 md:row-span-1",   // Normal card
  "md:col-span-1 md:row-span-1",   // Normal card
];

export function FeaturedGrid({ items, categories }: FeaturedGridProps) {
  const featured = items.slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section id="featured" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <p className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-2">
            Sélection du moment
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-espresso leading-tight">
            Nos coups de cœur
          </h2>
          <p className="mt-2 text-espresso/50 text-sm">
            Sélectionnés avec amour par l&apos;équipe Hamsa
          </p>
        </div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-medium text-espresso/70 hover:text-espresso transition-colors group shrink-0"
        >
          Voir tout le menu
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:auto-rows-[200px]">
        {featured.map((item, i) => (
          <FeaturedCard
            key={item.id}
            item={item}
            category={categories[item.category_id] ?? "Menu"}
            index={i}
            layoutClass={layouts[i] ?? ""}
          />
        ))}
      </div>
    </section>
  );
}

function FeaturedCard({
  item,
  category,
  index,
  layoutClass,
}: {
  item: MenuItem;
  category: string;
  index: number;
  layoutClass: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.07,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative overflow-hidden rounded-[24px] border border-line group cursor-pointer ${layoutClass}`}
      style={{ minHeight: index === 0 ? "280px" : "200px" }}
    >
      <Link href="/menu" className="block h-full w-full absolute inset-0">
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-espresso/30" />

        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-gold/20 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          {/* Category tag */}
          <span className="inline-block rounded-full bg-cream/20 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold text-cream uppercase tracking-wider mb-2 border border-cream/10">
            {category}
          </span>

          <h3 className="font-display text-lg md:text-xl font-semibold text-cream leading-tight">
            {item.name}
          </h3>

          <div className="flex items-center justify-between mt-1.5">
            <p className="font-display text-gold-light font-medium">
              {formatPrice(item.price)}
            </p>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-cream/70 text-xs">
              Voir →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
