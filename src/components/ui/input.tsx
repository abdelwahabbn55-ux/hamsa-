import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-line bg-cream-soft px-4 text-espresso placeholder:text-espresso/40 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[100px] w-full rounded-2xl border border-line bg-cream-soft px-4 py-3 text-espresso placeholder:text-espresso/40 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors resize-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
