"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SuiviLookupPage() {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (trimmed) router.push(`/suivi/${trimmed}`);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-semibold text-espresso">Suivi de commande</h1>
      <p className="mt-3 text-espresso/55 text-sm">
        Entrez l&apos;identifiant reçu après votre commande pour suivre son statut en direct
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-espresso/40" />
          <Input
            placeholder="ID de commande"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="pl-11"
          />
        </div>
        <Button type="submit" variant="dark" className="w-full" disabled={!orderId.trim()}>
          Suivre
        </Button>
      </form>
    </div>
  );
}
