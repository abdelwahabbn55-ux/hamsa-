import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-2xl bg-gradient-to-r from-cream-soft via-white/60 to-cream-soft bg-[length:200%_100%]",
        className
      )}
    />
  );
}
