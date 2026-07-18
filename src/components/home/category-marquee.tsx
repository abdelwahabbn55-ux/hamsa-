"use client";

const categories = [
  "Brunch Salé",
  "Brunch Sucré",
  "Boissons",
  "Cookies & Pâtisserie",
  "Granola Bowl",
  "Waffles",
  "Latte Macchiato",
  "Ice Matcha",
  "Bruschetta",
  "Burrata",
];

export function CategoryMarquee() {
  // Duplicate for seamless loop
  const items = [...categories, ...categories];

  return (
    <div className="overflow-hidden border-y border-line bg-cream-soft py-4 relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-cream-soft to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-cream-soft to-transparent pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((cat, i) => (
          <span
            key={`${cat}-${i}`}
            className="mx-5 font-display text-sm md:text-base font-medium text-espresso/60 uppercase tracking-[0.18em] inline-flex items-center gap-5"
          >
            {cat}
            <span className="text-gold text-[8px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
