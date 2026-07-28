"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { HoverScale } from "@/components/animations/hover-scale";
import { cn } from "@/lib/utils";

export interface LightboxImage {
  src: string;
  alt: string;
}

export interface LightboxGridProps {
  images: LightboxImage[];
  className?: string;
}

/**
 * Photo grid that opens a keyboard-navigable lightbox (Radix Dialog) on
 * click, with prev/next controls. Shared between room detail pages and the
 * /galleria page rather than duplicating the grid+lightbox markup twice.
 */
import { Tilt3D } from "@/components/animations/tilt-3d";
import { Sparkles, Maximize2 } from "lucide-react";

export function LightboxGrid({ images, className }: LightboxGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;
  const active = activeIndex !== null ? images[activeIndex] : undefined;

  function showPrev() {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % images.length,
    );
  }

  if (images.length === 0) return null;

  return (
    <>
      <Stagger
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          className,
        )}
        staggerChildren={0.05}
      >
        {images.map((image, index) => {
          // Dynamic aspect ratios for luxury editorial layout
          const isTall = index % 3 === 0;
          const aspectClass = isTall ? "aspect-[4/5]" : "aspect-[16/11]";

          return (
            <StaggerItem key={`${image.src}-${index}`}>
              <Tilt3D className="w-full">
                <button
                  type="button"
                  className="group relative block w-full text-left outline-none"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Apri l'immagine a schermo intero: ${image.alt}`}
                >
                  <div
                    className={cn(
                      "border-gold/30 bg-card/80 group-hover:border-gold/80 group-hover:shadow-gold/20 relative w-full overflow-hidden rounded-3xl border shadow-xl backdrop-blur-md transition-all duration-500 group-hover:shadow-2xl",
                      aspectClass,
                    )}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      quality={92}
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Hover expand badge */}
                    <div className="group-hover:border-gold group-hover:bg-gold absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:text-black">
                      <Maximize2 className="size-4" />
                    </div>

                    {/* Caption bar */}
                    <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between">
                      <p className="font-display max-w-[80%] text-sm font-medium text-white drop-shadow-sm">
                        {image.alt}
                      </p>
                      <Sparkles className="text-gold/80 size-4 shrink-0 transition-transform duration-300 group-hover:scale-125" />
                    </div>
                  </div>
                </button>
              </Tilt3D>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Dialog open={isOpen} onOpenChange={(next) => !next && setActiveIndex(null)}>
        <DialogContent
          className="border-gold/40 max-w-5xl bg-black/90 p-4 text-white shadow-2xl backdrop-blur-2xl sm:p-6"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") showPrev();
            if (event.key === "ArrowRight") showNext();
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <div>
              <DialogTitle className="font-display text-gold text-lg font-medium">
                {active?.alt ?? "Galleria fotografica"}
              </DialogTitle>
              <DialogDescription className="text-xs text-white/70">
                Immagine {activeIndex !== null ? activeIndex + 1 : 0} di {images.length} ·
                Donna Maria Suite &amp; Relax
              </DialogDescription>
            </div>
            <span className="border-gold/30 bg-gold/15 text-gold inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase">
              <Sparkles className="size-3" />
              Vista HD
            </span>
          </div>

          {active && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 sm:aspect-[16/10]">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                quality={98}
                sizes="90vw"
                className="object-contain"
              />
            </div>
          )}

          {images.length > 1 && (
            <div className="mt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={showPrev}
                className="border-gold/30 hover:border-gold hover:bg-gold/20 flex size-11 items-center justify-center rounded-full border bg-white/10 text-white transition-all hover:scale-105"
                aria-label="Immagine precedente"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <p className="font-display text-gold/90 max-w-md truncate text-center text-sm italic">
                {active?.alt}
              </p>
              <button
                type="button"
                onClick={showNext}
                className="border-gold/30 hover:border-gold hover:bg-gold/20 flex size-11 items-center justify-center rounded-full border bg-white/10 text-white transition-all hover:scale-105"
                aria-label="Immagine successiva"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
