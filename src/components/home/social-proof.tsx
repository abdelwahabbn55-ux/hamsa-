"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getHoursLabel } from "@/lib/hours";

interface StatsStripProps {
  followers: number;
  rating: number;
}

export function SocialProof() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-gold text-lg">✦</span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-gold/40" />
        </div>

        <blockquote>
          <p className="font-display text-2xl md:text-3xl lg:text-4xl italic text-espresso/80 leading-relaxed max-w-2xl mx-auto">
            &ldquo;One bite &amp; you&apos;ll get it&rdquo;
          </p>
          <footer className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gold/40" />
            <cite className="text-sm text-espresso/45 not-italic font-medium">
              @hamsa_coffee_brunch
            </cite>
            <div className="h-px w-8 bg-gold/40" />
          </footer>
        </blockquote>
      </motion.div>
    </section>
  );
}

export function StatsStrip({ followers, rating }: StatsStripProps) {
  const stats = [
    {
      label: "Abonnés Instagram",
      value: followers.toLocaleString("fr-FR") + "+",
      icon: "📸",
    },
    {
      label: "Horaires d'ouverture",
      value: getHoursLabel(),
      icon: "⏰",
    },
    {
      label: "Note client",
      value: `${rating} ★`,
      icon: "⭐",
    },
  ];

  return (
    <section className="border-y border-line bg-cream-soft">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="px-6 py-10 text-center group"
          >
            <span className="text-2xl mb-3 block">{stat.icon}</span>
            <p className="font-display text-2xl md:text-3xl font-semibold text-espresso tracking-tight">
              {stat.value}
            </p>
            <p className="mt-1.5 text-sm text-espresso/45">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function ClosingCTA() {
  return (
    <section className="relative mx-4 md:mx-6 my-16 overflow-hidden rounded-[28px] bg-espresso py-20 px-6 text-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(184,135,74,0.22)_0%,_transparent_65%)]" />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-rust/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-lg mx-auto"
      >
        <p className="text-gold-light text-xs font-semibold uppercase tracking-[0.25em] mb-4">
          Commandez en ligne
        </p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-cream leading-[1.1]">
          Prêt à vous régaler ?
        </h2>
        <p className="mt-4 text-cream/55 leading-relaxed">
          Brunch salé, douceurs sucrées et café d&apos;exception —{" "}
          <br className="hidden md:block" />
          directement depuis votre téléphone.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/menu">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-13 items-center justify-center rounded-2xl bg-gold-light px-8 font-semibold text-espresso hover:bg-gold-light/90 transition-all shadow-glow"
            >
              Explorer le menu
            </motion.button>
          </Link>
          <Link href="/suivi">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-13 items-center justify-center rounded-2xl bg-cream/8 border border-cream/15 px-8 font-medium text-cream hover:bg-cream/15 transition-all backdrop-blur-sm"
            >
              Suivre ma commande
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
