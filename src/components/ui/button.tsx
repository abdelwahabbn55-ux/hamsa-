"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-espresso text-cream hover:bg-espresso/90 shadow-soft",
        variant === "secondary" &&
          "bg-cream-soft text-espresso border border-line hover:border-gold/40",
        variant === "ghost" && "text-espresso hover:bg-espresso/5",
        variant === "dark" &&
          "bg-gold-light text-espresso hover:bg-gold-light/90 shadow-glow",
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-6 text-sm",
        size === "lg" && "h-13 px-8 text-base",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
