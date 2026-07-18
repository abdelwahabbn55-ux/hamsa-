"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, UtensilsCrossed, ShoppingBag, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

const links = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "#cart", label: "Panier", icon: ShoppingBag, cart: true },
  { href: "/suivi", label: "Suivi", icon: MapPin },
];

export function MobileNav() {
  const pathname = usePathname();
  const { count, setIsOpen } = useCart();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-line bg-cream/95 backdrop-blur-lg pb-safe"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {links.map(({ href, label, icon: Icon, cart }) => {
          const active = cart
            ? false
            : href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          const content = (
            <div className="flex flex-col items-center gap-1 px-3 py-1.5 relative">
              {active && (
                <motion.span
                  layoutId="mobile-nav-bg"
                  className="absolute inset-0 rounded-2xl bg-espresso/6"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    active ? "text-espresso" : "text-espresso/45"
                  )}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {cart && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rust text-[9px] font-bold text-cream leading-none"
                  >
                    {count > 9 ? "9+" : count}
                  </motion.span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors relative",
                  active ? "text-espresso" : "text-espresso/40"
                )}
              >
                {label}
              </span>
            </div>
          );

          if (cart) {
            return (
              <button
                key={href}
                onClick={() => setIsOpen(true)}
                className="outline-none"
                aria-label="Ouvrir le panier"
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={href} href={href} className="outline-none">
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
