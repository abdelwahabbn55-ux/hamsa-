import type { CartItem } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";

export function buildWhatsAppMessage(params: {
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  orderType: "retrait" | "livraison";
  address?: string;
  note?: string;
  items: CartItem[];
  total: number;
}) {
  const lines = [
    `🛒 *Nouvelle commande Hamsa #${params.orderNumber}*`,
    "",
    `👤 ${params.customerName}`,
    `📱 ${params.customerPhone}`,
    `📦 ${params.orderType === "retrait" ? "Retrait sur place" : "Livraison"}`,
  ];

  if (params.address) lines.push(`📍 ${params.address}`);
  if (params.note) lines.push(`📝 ${params.note}`);

  lines.push("", "*Articles:*");
  params.items.forEach((item) => {
    lines.push(`• ${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`);
  });
  lines.push("", `*Total: ${formatPrice(params.total)}*`);

  return lines.join("\n");
}

export function getWhatsAppLink(number: string, message: string) {
  const clean = number.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
