"use client";

import { Drawer } from "vaul";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedTotal } from "@/components/cart/animated-total";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    total,
    count,
  } = useCart();

  const [orderType, setOrderType] = useState<"retrait" | "livraison">(
    "retrait"
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const canContinue =
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    count > 0 &&
    (orderType === "retrait" || address.trim().length > 0);

  const continueReason = !count
    ? "Votre panier est vide"
    : !name.trim()
      ? "Indiquez votre prénom"
      : !phone.trim()
        ? "Indiquez votre téléphone"
        : orderType === "livraison" && !address.trim()
          ? "Indiquez votre adresse"
          : "";

  const checkoutParams = new URLSearchParams({
    name,
    phone,
    type: orderType,
    ...(orderType === "livraison" && address ? { address } : {}),
  });

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[60] bg-espresso/40 backdrop-blur-sm" />
        <Drawer.Content
          className="fixed bottom-0 right-0 z-[70] flex h-full w-full md:w-[460px] flex-col bg-cream outline-none
            rounded-t-[28px] md:rounded-none
            top-auto md:top-0
            max-h-[92vh] md:max-h-full"
        >
          {/* Mobile drag handle */}
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-line md:hidden shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-5 py-4 shrink-0">
            <div>
              <h2 className="font-display text-xl font-semibold text-espresso">
                Votre panier
              </h2>
              <p className="text-xs text-espresso/45 mt-0.5">
                {count === 0
                  ? "Aucun article"
                  : `${count} article${count > 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line hover:bg-cream-soft transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cream-soft border border-line">
                  <ShoppingBag className="h-8 w-8 text-espresso/25" />
                </div>
                <p className="font-display text-lg font-semibold text-espresso">
                  Panier vide
                </p>
                <p className="mt-2 text-sm text-espresso/45 max-w-[200px] leading-relaxed">
                  Parcourez notre menu et ajoutez vos coups de cœur
                </p>
                <Link href="/menu" onClick={() => setIsOpen(false)}>
                  <Button className="mt-6" variant="secondary" size="sm">
                    Voir le menu
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onUpdate={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer — only when cart has items */}
          {items.length > 0 && (
            <div className="border-t border-line px-5 py-5 space-y-4 bg-cream-soft/60 shrink-0">
              {/* Order type toggle */}
              <div className="flex gap-1.5 p-1.5 rounded-2xl bg-cream border border-line">
                {(["retrait", "livraison"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={cn(
                      "flex-1 rounded-xl py-2.5 text-sm font-medium transition-all duration-200",
                      orderType === type
                        ? "bg-espresso text-cream shadow-sm"
                        : "text-espresso/55 hover:text-espresso hover:bg-cream-soft"
                    )}
                  >
                    {type === "retrait" ? "🏪 Retrait" : "🛵 Livraison"}
                  </button>
                ))}
              </div>

              {/* Address field — animated */}
              <AnimatePresence>
                {orderType === "livraison" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <Input
                      placeholder="Adresse de livraison *"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  placeholder="Prénom *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Téléphone *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                />
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-2 border-t border-line">
                <span className="text-sm font-medium text-espresso/60">
                  Total
                </span>
                <AnimatedTotal value={total} />
              </div>

              {/* CTA */}
              <div className="space-y-2">
                <Link
                  href={
                    canContinue
                      ? `/checkout?${checkoutParams.toString()}`
                      : "#"
                  }
                  onClick={(e) => {
                    if (!canContinue) {
                      e.preventDefault();
                    } else {
                      setIsOpen(false);
                    }
                  }}
                >
                  <Button
                    className="w-full gap-2"
                    variant="dark"
                    disabled={!canContinue}
                  >
                    Continuer
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {!canContinue && continueReason && (
                  <p className="text-center text-xs text-rust/80">
                    {continueReason}
                  </p>
                )}
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function CartItemRow({
  item,
  onUpdate,
  onRemove,
}: {
  item: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    quantity: number;
  };
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 rounded-2xl border border-line bg-cream-soft p-3"
    >
      {/* Image */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="h-full w-full bg-line rounded-xl" />
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm text-espresso leading-tight truncate">
            {item.name}
          </p>
          <p className="text-sm font-semibold text-rust shrink-0">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity stepper */}
          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-cream p-1">
            <button
              onClick={() => onUpdate(item.id, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-cream-soft transition-colors"
              aria-label="Diminuer la quantité"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-5 text-center text-sm font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdate(item.id, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-espresso text-cream transition-colors"
              aria-label="Augmenter la quantité"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => onRemove(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-espresso/30 hover:text-rust hover:bg-rust/5 transition-colors"
            aria-label="Supprimer l'article"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
