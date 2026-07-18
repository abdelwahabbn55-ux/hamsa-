"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2, RefreshCw, MessageCircle, Check, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { AnimatedTotal } from "@/components/cart/animated-total";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppMessage, getWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { items, total, clearCart } = useCart();

  const [name, setName] = useState(params.get("name") ?? "");
  const [phone, setPhone] = useState(params.get("phone") ?? "");
  const [orderType, setOrderType] = useState<"retrait" | "livraison">(
    (params.get("type") as "retrait" | "livraison") ?? "retrait"
  );
  const [address, setAddress] = useState(params.get("address") ?? "");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    orderId: string;
    orderNumber: number;
    whatsappUrl: string;
  } | null>(null);

  useEffect(() => {
    if (items.length === 0 && !success) {
      router.replace("/menu");
    }
  }, [items.length, success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || items.length === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();


      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          order_type: orderType,
          address: orderType === "livraison" ? address.trim() || null : null,
          note: note.trim() || null,
          status: "nouvelle",
          total,
        })
        .select("id, order_number")
        .single();
      if (orderError || !order)
        throw new Error(orderError?.message ?? "Erreur lors de la commande");

      const orderItems = items.map((item) => ({
        order_id: order.id,
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      if (itemsError) throw new Error(itemsError.message);

      const { data: settings } = await supabase
        .from("shop_settings")
        .select("whatsapp_number")
        .single();

      const message = buildWhatsAppMessage({
        orderNumber: order.order_number,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        orderType,
        address: orderType === "livraison" ? address.trim() : undefined,
        note: note.trim() || undefined,
        items,
        total,
      });

      const whatsappUrl = getWhatsAppLink(
        settings?.whatsapp_number ?? "213555123456",
        message
      );

      clearCart();
      setSuccess({
        orderId: order.id,
        orderNumber: order.order_number,
        whatsappUrl,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer la commande. Vérifiez votre connexion."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-md px-4 py-16 text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 250, damping: 18 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gold/15 border border-gold/30"
        >
          <Check className="h-10 w-10 text-gold" strokeWidth={2.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-espresso">
            Commande confirmée !
          </h1>
          <p className="mt-3 text-espresso/60">
            Référence{" "}
            <strong className="text-espresso font-semibold">
              #{success.orderNumber}
            </strong>
          </p>
          <p className="mt-1 text-sm text-espresso/45">
            Statut initial : <em>Nouvelle</em> — nous traitons votre commande
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-10 flex flex-col gap-3"
        >
          <a
            href={success.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="dark" className="w-full gap-2.5" size="lg">
              <MessageCircle className="h-4.5 w-4.5" />
              Confirmer sur WhatsApp
            </Button>
          </a>
          <Link href={`/suivi/${success.orderId}`}>
            <Button variant="secondary" className="w-full" size="md">
              Suivre ma commande en direct
            </Button>
          </Link>
          <Link
            href="/"
            className="text-sm text-espresso/45 hover:text-espresso transition-colors mt-1"
          >
            Retour à l&apos;accueil
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 md:py-16">
      {/* Back link */}
      <Link
        href="/menu"
        className="inline-flex items-center gap-2 text-sm text-espresso/50 hover:text-espresso transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au menu
      </Link>

      <h1 className="font-display text-3xl md:text-4xl font-semibold text-espresso mb-1">
        Finaliser la commande
      </h1>
      <p className="text-espresso/45 text-sm mb-8">
        Vérifiez votre sélection et confirmez
      </p>

      {/* Order summary */}
      <div className="rounded-[20px] border border-line bg-cream-soft p-5 mb-6">
        <h2 className="font-display text-sm font-semibold text-espresso/70 uppercase tracking-wider mb-4">
          Récapitulatif
        </h2>
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="text-espresso/75">
                <span className="font-semibold text-espresso">{item.quantity}×</span>{" "}
                {item.name}
              </span>
              <span className="text-rust font-semibold">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-line">
          <span className="font-semibold text-espresso">Total</span>
          <AnimatedTotal value={total} />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Votre prénom *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Téléphone *"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {/* Order type toggle */}
        <div className="flex gap-1.5 p-1.5 rounded-2xl bg-cream border border-line">
          {(["retrait", "livraison"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={cn(
                "flex-1 rounded-xl py-3 text-sm font-medium transition-all duration-200",
                orderType === type
                  ? "bg-espresso text-cream shadow-sm"
                  : "text-espresso/55 hover:text-espresso"
              )}
            >
              {type === "retrait" ? "🏪 Retrait sur place" : "🛵 Livraison"}
            </button>
          ))}
        </div>

        {/* Address - animated */}
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
                placeholder="Adresse de livraison complète *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required={orderType === "livraison"}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Textarea
          placeholder="Note pour la cuisine (optionnel) — allergies, préférences..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-rust/25 bg-rust/5 p-4 text-sm text-rust"
            >
              <p className="font-medium">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="mt-2 flex items-center gap-1.5 text-xs font-medium underline opacity-70 hover:opacity-100"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Réessayer
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          variant="dark"
          size="lg"
          className="w-full mt-2"
          disabled={
            submitting ||
            !name.trim() ||
            !phone.trim() ||
            (orderType === "livraison" && !address.trim())
          }
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Confirmer la commande"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="text-sm text-espresso/40">Chargement...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
