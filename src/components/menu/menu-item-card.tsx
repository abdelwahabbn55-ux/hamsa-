"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import type { MenuItem } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onOpenDetail: (item: MenuItem) => void;
}

export function MenuItemCard({ item, index, onOpenDetail }: MenuItemCardProps) {
  const { items: cartItems, addItem, updateQuantity } = useCart();
  const { toast } = useToast();
  const [showStepper, setShowStepper] = useState(false);
  const cartItem = cartItems.find((i) => i.id === item.id);
  const qty = cartItem?.quantity ?? 0;

  // Show stepper if item is in cart
  const isInCart = qty > 0;

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
    });
    toast("Ajouté au panier", item.name);
    setShowStepper(true);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group rounded-[20px] border border-line bg-cream-soft overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Image */}
      <button
        onClick={() => onOpenDetail(item)}
        className="relative block w-full aspect-[4/3] overflow-hidden"
        aria-label={`Voir ${item.name}`}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-cream border-b border-line flex items-center justify-center">
            <span className="text-4xl opacity-20">☕</span>
          </div>
        )}

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/10 transition-colors duration-300" />

        {/* Tap to expand hint */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-1 rounded-full bg-cream/90 backdrop-blur px-2.5 py-1 text-[10px] font-medium text-espresso">
            Détails
          </span>
        </div>
      </button>

      {/* Card body */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-display text-base font-semibold text-espresso leading-snug">
            {item.name}
          </h3>
          {item.description && (
            <p className="mt-1 text-xs text-espresso/50 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Price + Add button */}
        <div className="flex items-center justify-between">
          <span className="font-display text-base font-semibold text-rust">
            {formatPrice(item.price)}
          </span>

          <AnimatePresence mode="wait">
            {!isInCart && !showStepper ? (
              <motion.button
                key="add"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onClick={handleAdd}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso text-cream hover:bg-espresso/90 transition-colors shadow-sm"
                aria-label={`Ajouter ${item.name} au panier`}
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.div
                key="stepper"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-1.5 rounded-xl border border-line bg-cream p-1"
              >
                <button
                  onClick={() => {
                    updateQuantity(item.id, qty - 1);
                    if (qty - 1 <= 0) setShowStepper(false);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-cream-soft transition-colors"
                  aria-label="Diminuer"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span
                  className={cn(
                    "w-5 text-center text-sm font-semibold",
                    qty > 0 ? "text-espresso" : "text-espresso/40"
                  )}
                >
                  {qty}
                </span>
                <button
                  onClick={() => {
                    if (qty === 0) handleAdd();
                    else updateQuantity(item.id, qty + 1);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-espresso text-cream transition-colors"
                  aria-label="Augmenter"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}
