import type { Metadata } from "next";
import { Fraunces, Jost } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ToastProvider } from "@/components/ui/toast";
import { PageTransition } from "@/components/layout/page-transition";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Hamsa Coffee Brunch — Chlef",
    template: "%s | Hamsa Coffee Brunch",
  },
  description:
    "Commandez votre brunch, café et pâtisseries artisanaux à Chlef. Hamsa Coffee Brunch — l'art du brunch, l'âme du café.",
  openGraph: {
    title: "Hamsa Coffee Brunch",
    description: "Brunch, café et pâtisseries à Chlef — commandez en ligne",
    type: "website",
    locale: "fr_DZ",
    images: [{ url: "/img/photo_10_2026-07-17_20-58-21.jpg", width: 1200, height: 630 }],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${jost.variable} font-sans antialiased`}>
        <CartProvider>
          <ToastProvider>
            <Header />
            <main className="pb-20 md:pb-0">
              <PageTransition>{children}</PageTransition>
            </main>
            <MobileNav />
            <CartDrawer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
