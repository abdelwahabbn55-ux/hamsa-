"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";
import type { MenuItem } from "@/types/database";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";

interface ItemModalProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemModal({ item, open, onOpenChange }: ItemModalProps) {
  const { addItem, setIsOpen: openCart, items: cartItems } = useCart();
  const { toast } = useToast();
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = item ? cartItems.find((i) => i.id === item.id) : null;
  const qtyInCart = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    if (!item) return;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
    });
    toast("Ajouté au panier", item.name);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && item && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[80] bg-espresso/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 320 }}
                className="fixed bottom-0 left-0 right-0 z-[90] max-h-[92vh] overflow-y-auto rounded-t-[28px] bg-cream outline-none md:bottom-auto md:left-1/2 md:top-1/2 md:max-w-md md:w-full md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[28px]"
              >
                {/* Mobile drag handle */}
                <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-line md:hidden" />

                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden md:rounded-t-[28px]">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 448px"
                      priority
                    />
                  ) : (
                    <div className="h-full w-full bg-cream-soft flex items-center justify-center">
                      <span className="text-6xl opacity-20">🍽️</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-transparent to-transparent" />

                  {/* Close button */}
                  <Dialog.Close className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 backdrop-blur shadow-md hover:bg-cream transition-colors">
                    <X className="h-4.5 w-4.5 text-espresso" />
                  </Dialog.Close>

                  {/* Price badge on image */}
                  <div className="absolute bottom-4 left-4">
                    <span className="font-display text-2xl font-semibold text-cream">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  <div>
                    <Dialog.Title className="font-display text-2xl font-semibold text-espresso leading-tight">
                      {item.name}
                    </Dialog.Title>
                    {qtyInCart > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1.5 text-xs font-medium text-gold flex items-center gap-1.5"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {qtyInCart} dans le panier
                      </motion.p>
                    )}
                  </div>

                  {item.description && (
                    <Dialog.Description className="text-espresso/65 leading-relaxed text-sm">
                      {item.description}
                    </Dialog.Description>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <Button
                      className="flex-1"
                      variant="dark"
                      onClick={handleAdd}
                    >
                      {justAdded ? "✓ Ajouté !" : "Ajouter au panier"}
                    </Button>
                    {qtyInCart > 0 && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          onOpenChange(false);
                          openCart(true);
                        }}
                      >
                        Voir panier
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
