"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { LogoBadge } from "@/components/brand/logo-badge";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/menu", label: "Menu" },
  { href: "/suivi", label: "Suivi" },
];

export function Header() {
  const pathname = usePathname();
  const { count, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line/40 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <LogoBadge size={42} />
          <div className="hidden sm:block">
            <p className="font-display text-base font-semibold leading-tight text-espresso group-hover:text-espresso/80 transition-colors">
              Hamsa
            </p>
            <p className="font-display text-[11px] italic text-espresso/50">
              Coffee Brunch
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors rounded-xl",
                  active
                    ? "text-espresso"
                    : "text-espresso/55 hover:text-espresso"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="header-nav-pill"
                    className="absolute inset-0 rounded-xl bg-cream-soft border border-line shadow-card"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Cart button */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-cream-soft hover:border-gold/50 hover:bg-cream transition-all duration-200 shadow-card"
          aria-label="Ouvrir le panier"
        >
          <ShoppingBag className="h-5 w-5 text-espresso" />
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rust text-[11px] font-semibold text-cream shadow-sm"
            >
              {count > 9 ? "9+" : count}
            </motion.span>
          )}
        </button>
      </div>
    </header>
  );
}
