"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2, RefreshCw, Clock, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/types/database";
import { OrderStepper } from "@/components/order/order-stepper";
import { formatPrice } from "@/lib/utils";

const STATUS_LABELS: Record<string, { label: string; icon: string; description: string }> = {
  nouvelle: {
    label: "Commande reçue",
    icon: "📋",
    description: "Votre commande a bien été reçue et sera traitée très bientôt",
  },
  confirmee: {
    label: "Confirmée par le restaurant",
    icon: "✅",
    description: "Le restaurant a confirmé votre commande",
  },
  en_preparation: {
    label: "En cours de préparation",
    icon: "👨‍🍳",
    description: "Notre équipe prépare votre commande avec soin",
  },
  prete: {
    label: "Prête à être récupérée",
    icon: "🎉",
    description: "Votre commande est prête ! Venez la récupérer",
  },
  en_livraison: {
    label: "En cours de livraison",
    icon: "🛵",
    description: "Votre commande est en route",
  },
  terminee: {
    label: "Commande terminée",
    icon: "✨",
    description: "Merci pour votre commande. À bientôt chez Hamsa !",
  },
  annulee: {
    label: "Commande annulée",
    icon: "❌",
    description: "Cette commande a été annulée. Contactez-nous pour plus d'informations",
  },
};

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (fetchError || !data) {
        setError(true);
        return;
      }
      setOrder(data);
      setLastUpdated(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Initial load + Realtime subscription
  useEffect(() => {
    fetchOrder();

    const supabase = createClient();
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload: any) => {
          setOrder(payload.new as Order);
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, fetchOrder]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <p className="text-sm text-espresso/45">Chargement du suivi...</p>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <p className="font-display text-xl font-semibold text-espresso">
          Commande introuvable
        </p>
        <p className="mt-2 text-sm text-espresso/45 max-w-[240px] mx-auto">
          Vérifiez le lien reçu ou contactez le restaurant directement
        </p>
        <button
          onClick={fetchOrder}
          className="mt-5 flex items-center gap-1.5 text-sm text-rust underline mx-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Réessayer
        </button>
        <Link
          href="/"
          className="block mt-5 text-sm text-espresso/45 hover:text-espresso transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[order.status] ?? {
    label: order.status,
    icon: "📦",
    description: "",
  };
  const isTerminated = order.status === "terminee" || order.status === "annulee";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-3">
          Suivi en direct
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-espresso">
              Commande #{order.order_number}
            </h1>
            <p className="mt-2 text-espresso/55 text-sm">
              {order.customer_name} · {order.order_type === "livraison" ? "🛵 Livraison" : "🏪 Retrait sur place"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-xl font-semibold text-rust">
              {formatPrice(order.total)}
            </p>
            <p className="text-xs text-espresso/35 mt-0.5">Total</p>
          </div>
        </div>
      </motion.div>

      {/* Current status card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={order.status}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className={`rounded-[20px] border p-6 mb-6 ${
            order.status === "terminee"
              ? "border-gold/30 bg-gold/8"
              : order.status === "annulee"
                ? "border-rust/30 bg-rust/5"
                : "border-line bg-cream-soft"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{statusInfo.icon}</span>
            <div>
              <p className="font-display text-lg font-semibold text-espresso">
                {statusInfo.label}
              </p>
              {statusInfo.description && (
                <p className="mt-1 text-sm text-espresso/55">
                  {statusInfo.description}
                </p>
              )}
            </div>
          </div>

          {/* Live pulse indicator */}
          {!isTerminated && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-line">
              <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
              <p className="text-xs text-espresso/40">
                Mise à jour en direct — aucun rechargement nécessaire
              </p>
            </div>
          )}

          {isTerminated && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-line">
              <CheckCircle className="h-4 w-4 text-gold/60" />
              <p className="text-xs text-espresso/40">
                Commande finalisée
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Stepper */}
      <div className="rounded-[24px] border border-line bg-cream-soft p-6 md:p-8 mb-6">
        <p className="text-xs font-semibold text-espresso/45 uppercase tracking-wider mb-6">
          Progression
        </p>
        <OrderStepper status={order.status} orderType={order.order_type} />
      </div>

      {/* Order details */}
      <div className="rounded-2xl border border-line p-5 space-y-3 text-sm mb-8">
        <p className="text-xs font-semibold text-espresso/45 uppercase tracking-wider">
          Détails de la commande
        </p>
        <div className="space-y-2.5 pt-1">
          <DetailRow label="Client" value={order.customer_name} />
          <DetailRow label="Téléphone" value={order.customer_phone} />
          <DetailRow
            label="Type"
            value={
              order.order_type === "retrait"
                ? "🏪 Retrait sur place"
                : "🛵 Livraison"
            }
          />
          {order.address && (
            <DetailRow label="Adresse" value={order.address} />
          )}
          {order.note && (
            <DetailRow label="Note" value={order.note} />
          )}
          <div className="pt-2 border-t border-line">
            <DetailRow
              label="Total"
              value={formatPrice(order.total)}
              highlight
            />
          </div>
        </div>
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <div className="flex items-center gap-2 text-xs text-espresso/30 mb-8">
          <Clock className="h-3 w-3" />
          Dernière mise à jour :{" "}
          {lastUpdated.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}

      <Link
        href="/menu"
        className="block text-center text-sm text-espresso/45 hover:text-espresso transition-colors"
      >
        Commander à nouveau →
      </Link>
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-espresso/50">{label}</span>
      <span
        className={
          highlight
            ? "font-display font-semibold text-rust"
            : "font-medium text-espresso truncate"
        }
      >
        {value}
      </span>
    </div>
  );
}
