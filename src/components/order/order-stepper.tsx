"use client";

import { motion } from "framer-motion";
import type { OrderStatus } from "@/types/database";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "nouvelle", label: "Reçue" },
  { key: "confirmee", label: "Confirmée" },
  { key: "en_preparation", label: "En préparation" },
  { key: "prete", label: "Prête" },
  { key: "terminee", label: "Terminée" },
];

const STATUS_ORDER: OrderStatus[] = [
  "nouvelle",
  "confirmee",
  "en_preparation",
  "prete",
  "en_livraison",
  "terminee",
];

function getStepIndex(status: OrderStatus) {
  if (status === "en_livraison") return 3;
  if (status === "annulee") return -1;
  const idx = STATUS_ORDER.indexOf(status);
  return idx >= 0 ? Math.min(idx, 4) : 0;
}

interface OrderStepperProps {
  status: OrderStatus;
  orderType?: string;
}

export function OrderStepper({ status, orderType }: OrderStepperProps) {
  const current = getStepIndex(status);
  const steps =
    orderType === "livraison" && status !== "terminee"
      ? [
          ...STEPS.slice(0, 4),
          { key: "en_livraison" as OrderStatus, label: "En livraison" },
          STEPS[4],
        ]
      : STEPS;

  if (status === "annulee") {
    return (
      <div className="rounded-2xl border border-rust/30 bg-rust/5 p-6 text-center">
        <p className="font-display text-lg text-rust">Commande annulée</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-line hidden md:block" />
      <motion.div
        className="absolute top-5 left-0 h-0.5 bg-gold hidden md:block"
        initial={{ width: 0 }}
        animate={{ width: `${(current / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {steps.map((step, i) => {
          const done = i <= current;
          const active = i === current;
          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  done
                    ? "border-gold bg-gold text-cream"
                    : "border-line bg-cream-soft text-espresso/30",
                  active && "ring-4 ring-gold/20 scale-110"
                )}
              >
                {done && i < current ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-medium">{i + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  active ? "text-espresso" : "text-espresso/45"
                )}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
