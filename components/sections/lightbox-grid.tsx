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
        className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", className)}
        staggerChildren={0.04}
      >
        {images.map((image, index) => (
          <StaggerItem key={`${image.src}-${index}`}>
            <button
              type="button"
              className="focus-visible:ring-ring block w-full rounded-lg focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => setActiveIndex(index)}
              aria-label={`Apri l'immagine a schermo intero: ${image.alt}`}
            >
              <HoverScale scale={1.03}>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 23vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </HoverScale>
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      <Dialog open={isOpen} onOpenChange={(next) => !next && setActiveIndex(null)}>
        <DialogContent
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") showPrev();
            if (event.key === "ArrowRight") showNext();
          }}
        >
          <DialogTitle>{active?.alt ?? "Galleria fotografica"}</DialogTitle>
          <DialogDescription>
            Immagine {activeIndex !== null ? activeIndex + 1 : 0} di {images.length}
          </DialogDescription>

          {active && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:aspect-video">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                quality={95}
                sizes="90vw"
                className="object-contain"
              />
            </div>
          )}

          {images.length > 1 && (
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={showPrev}
                className="focus-visible:ring-ring rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Immagine precedente"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <p className="max-w-md truncate text-center text-sm text-white/80">
                {active?.alt}
              </p>
              <button
                type="button"
                onClick={showNext}
                className="focus-visible:ring-ring rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Immagine successiva"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
