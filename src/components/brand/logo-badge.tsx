"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LogoBadge({ size = 72 }: { size?: number }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
      className="relative flex items-center justify-center rounded-full p-[3px]"
      style={{
        width: size,
        height: size,
        background: "conic-gradient(from 180deg, #B8874A, #E7B45C, #B8874A, #9C5233, #B8874A)",
      }}
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-espresso">
        <Image
          src="/img/photo_2_2026-07-17_20-58-21.jpg"
          alt="Hamsa Coffee Brunch"
          width={size - 8}
          height={size - 8}
          className="h-[calc(100%-8px)] w-[calc(100%-8px)] rounded-full object-cover"
        />
      </div>
    </motion.div>
  );
}
