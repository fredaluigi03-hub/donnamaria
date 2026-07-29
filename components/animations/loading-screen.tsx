"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import Image from "next/image";

import { useMounted } from "@/hooks/use-mounted";

export interface LoadingScreenProps {
  /** Callback richiamata quando l'animazione di uscita è completata. */
  onComplete?: () => void;
  /** Durata minima del caricamento da 0% a 100% in ms (default 1800ms). */
  duration?: number;
  /** Nome del Brand (default: Donna Maria Suite & Relax) */
  brandName?: string;
  /** Tagline / Sottotitolo (default: Sperimenta il Lusso in Irpinia) */
  tagline?: string;
}

/**
 * Preloader / Splash Screen animato a schermo intero.
 * Mostra il logo, la tagline, una barra di avanzamento dorata con la percentuale (0% -> 100%)
 * ed una dissolvenza fluida (fade-out di 0.7s) al termine del caricamento.
 */
export function LoadingScreen({
  onComplete,
  duration = 1800,
  brandName = "Donna Maria Suite & Relax",
  tagline = "Sperimenta il Lusso & il Benessere in Irpinia",
}: LoadingScreenProps) {
  const mounted = useMounted();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("donnamaria_preloaded") !== "true";
    }
    return true;
  });

  useEffect(() => {
    if (!mounted || !visible) return;

    const startTime = performance.now();

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem("donnamaria_preloaded", "true");
        }, 150);
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animFrame);
  }, [duration, mounted, visible]);

  if (!mounted || !visible) return null;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f0e0d] px-6 text-white select-none"
        >
          {/* Sfondo Elegante con Aurea Luminosa Dorata */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[130px]" />
          </div>

          <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
            {/* Logo Official Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="border-gold/40 bg-gold/15 shadow-gold/30 mb-6 flex size-24 items-center justify-center rounded-3xl border p-3 shadow-2xl backdrop-blur-xl"
            >
              <Image
                src="/images/logo.png"
                alt="Donna Maria Suite & Relax"
                width={80}
                height={80}
                priority
                className="size-20 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
              />
            </motion.div>

            {/* Brand Title */}
            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-2xl font-semibold tracking-wider text-amber-50 uppercase sm:text-3xl"
            >
              {brandName}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-display mt-2 text-xs font-light tracking-widest text-amber-200/80 italic sm:text-sm"
            >
              {tagline}
            </motion.p>

            {/* Progress Bar & Percentage Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 flex w-full flex-col items-center gap-3"
            >
              {/* Counter % */}
              <div className="flex w-full items-center justify-between text-xs font-semibold tracking-widest text-amber-200/90 uppercase">
                <span>Caricamento</span>
                <span className="font-mono text-sm font-bold text-[#d4af37]">
                  {progress}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="border-gold/30 relative h-2 w-full overflow-hidden rounded-full border bg-black/60 p-0.5 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
