"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface CoverflowImage {
  src: string;
  alt: string;
}

export interface RoomGalleryCoverflowProps {
  images: CoverflowImage[];
  className?: string;
}

// Cards more than this many positions from the active one aren't rendered
// at all — keeps the DOM light and avoids a wall of near-invisible cards
// stacking up behind the visible cascade on rooms with a big gallery.
const MAX_VISIBLE_OFFSET = 2;

/**
 * Front-facing "coverflow" gallery: the active photo is large and centered,
 * neighbors peek in partially to each side and cascade further back the
 * further they are from active. Click a peeking photo (or the arrows, or
 * Left/Right) to bring it to the front. Replaces a flat grid-of-thumbnails
 * gallery on request — used identically on all three room detail pages via
 * `RoomDetail`, so this is the single place to adjust the pattern.
 */
export function RoomGalleryCoverflow({ images, className }: RoomGalleryCoverflowProps) {
  const [active, setActive] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  function go(delta: number) {
    setActive((prev) => (prev + delta + images.length) % images.length);
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div
        className="relative h-[340px] w-full sm:h-[420px] md:h-[480px]"
        role="group"
        aria-roledescription="carousel"
        aria-label="Galleria fotografica della camera"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") go(-1);
          if (event.key === "ArrowRight") go(1);
        }}
      >
        {images.map((image, index) => {
          // Signed distance from the active card, wrapped to whichever
          // direction is shorter so the cascade always builds from the
          // nearest side instead of crossing the whole track.
          let offset = index - active;
          if (offset > images.length / 2) offset -= images.length;
          if (offset < -images.length / 2) offset += images.length;

          const distance = Math.abs(offset);
          if (distance > MAX_VISIBLE_OFFSET) return null;
          const isActive = offset === 0;

          return (
            <motion.button
              key={image.src}
              type="button"
              aria-label={isActive ? image.alt : `Vai alla foto: ${image.alt}`}
              aria-current={isActive}
              tabIndex={isActive ? -1 : 0}
              onClick={() => setActive(index)}
              className={cn(
                "absolute inset-0 m-auto h-full w-[78%] overflow-hidden rounded-xl shadow-xl sm:w-[70%]",
                isActive ? "cursor-default" : "cursor-pointer",
              )}
              style={{ zIndex: 10 - distance }}
              animate={{
                x: `${offset * 48}%`,
                scale: isActive ? 1 : 1 - distance * 0.14,
                opacity: isActive ? 1 : 1 - distance * 0.35,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 280, damping: 32 }
              }
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                quality={90}
                sizes="(min-width: 1024px) 55vw, 80vw"
                className="object-cover"
              />
              {!isActive && (
                <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Foto precedente"
          className="border-border bg-card hover:bg-secondary inline-flex size-10 items-center justify-center rounded-full border transition-colors"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <p className="text-muted-foreground min-w-12 text-center text-sm tabular-nums">
          {active + 1} / {images.length}
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Foto successiva"
          className="border-border bg-card hover:bg-secondary inline-flex size-10 items-center justify-center rounded-full border transition-colors"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
