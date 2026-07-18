"use client";

import * as Toast from "@radix-ui/react-toast";
import { motion, AnimatePresence } from "framer-motion";
import { createContext, useCallback, useContext, useState } from "react";
import { Check } from "lucide-react";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((title: string, description?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <Toast.Provider swipeDirection="up">
        {children}
        <AnimatePresence>
          {toasts.map((t) => (
            <Toast.Root key={t.id} asChild duration={3000}>
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-24 md:bottom-8 left-1/2 z-[100] -translate-x-1/2 flex items-center gap-3 rounded-2xl border border-gold/30 bg-espresso px-5 py-3 shadow-glow text-cream min-w-[280px]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-light/20">
                  <Check className="h-4 w-4 text-gold-light" />
                </span>
                <div>
                  <Toast.Title className="font-medium text-sm">{t.title}</Toast.Title>
                  {t.description && (
                    <Toast.Description className="text-xs text-cream/70 mt-0.5">
                      {t.description}
                    </Toast.Description>
                  )}
                </div>
              </motion.div>
            </Toast.Root>
          ))}
        </AnimatePresence>
        <Toast.Viewport className="fixed bottom-0 left-0 flex flex-col p-4 outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
