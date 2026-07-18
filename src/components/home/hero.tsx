"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock } from "lucide-react";
import { LogoBadge } from "@/components/brand/logo-badge";
import { Button } from "@/components/ui/button";
import { getOpenStatusLabel, isOpenNow, getHoursLabel } from "@/lib/hours";
import { cn } from "@/lib/utils";

interface HeroProps {
  isOpenOverride?: boolean | null;
}

export function Hero({ isOpenOverride }: HeroProps) {
  const open = isOpenNow(isOpenOverride);

  const scrollToMenu = () => {
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[95vh] flex items-end overflow-hidden">
      {/* Background image */}
      <Image
        src="/img/photo_10_2026-07-17_20-58-21.jpg"
        alt="Hamsa Coffee Brunch — Chlef"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Multi-layer gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e08] via-[#2C1B12]/75 to-[#2C1B12]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a0e08]/40 via-transparent to-transparent" />

      {/* Grain texture - hero only */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-32 md:pb-24 pt-32 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          {/* Left: Main content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start gap-7 max-w-2xl"
          >
            <LogoBadge size={84} />

            <div className="space-y-4">
              {/* Open status badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-4"
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-md border",
                    open
                      ? "bg-gold-light/15 border-gold-light/30 text-gold-light"
                      : "bg-cream/8 border-cream/15 text-cream/60"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      open ? "bg-gold-light animate-pulse" : "bg-cream/40"
                    )}
                  />
                  {getOpenStatusLabel(isOpenOverride)}
                </span>

                <span className="inline-flex items-center gap-1.5 text-cream/40 text-xs">
                  <Clock className="h-3 w-3" />
                  {getHoursLabel()}
                </span>
              </motion.div>

              {/* Main headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
              >
                <h1 className="font-display text-5xl md:text-7xl font-semibold text-cream leading-[1.05] tracking-[-0.02em]">
                  Hamsa<br />
                  <span className="text-gold-light">Coffee</span> Brunch
                </h1>
                <p className="mt-4 font-display text-lg md:text-xl italic text-cream/65 leading-relaxed">
                  L&apos;art du brunch, l&apos;âme du café<br className="hidden md:block" />
                  <span className="md:hidden"> — </span>
                  <span className="not-italic text-cream/45 text-base font-normal"> Chlef, Algérie</span>
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap gap-3 pt-1"
              >
                <Button
                  variant="dark"
                  size="lg"
                  onClick={scrollToMenu}
                  className="shadow-glow"
                >
                  Commander maintenant
                </Button>
                <Link href="/menu">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-cream/10 border-cream/20 text-cream hover:bg-cream/20 hover:border-cream/30 backdrop-blur-sm"
                  >
                    Voir le menu
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Stats pills on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="hidden md:flex flex-col gap-3 items-end"
          >
            {[
              { label: "Abonnés", value: "4 250+" },
              { label: "Note Google", value: "4.5 ★" },
              { label: "Chlef, Algérie", value: "Depuis 2023" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-2xl bg-cream/8 backdrop-blur-md border border-cream/10 px-5 py-3"
              >
                <div className="text-right">
                  <p className="font-display text-lg font-semibold text-cream leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xs text-cream/45 mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.button
        onClick={scrollToMenu}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cream/30 hover:text-cream/60 transition-colors"
        aria-label="Défiler vers le bas"
      >
        <ChevronDown className="h-7 w-7" />
      </motion.button>
    </section>
  );
}
