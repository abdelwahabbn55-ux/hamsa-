"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/utils";

export function AnimatedTotal({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const start = prev.current;
    const diff = value - start;
    const duration = 450;
    const t0 = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + diff * eased));
      if (p < 1) requestAnimationFrame(tick);
      else prev.current = value;
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span className="font-display text-2xl font-semibold text-espresso tabular-nums">
      {formatPrice(display)}
    </span>
  );
}
