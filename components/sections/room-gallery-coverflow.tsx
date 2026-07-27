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

// True-3D cascade values. The neighbours don't just shrink — they turn away
// from the viewer and sit further back in Z, which is what actually reads as
// depth rather than as scaled-down copies.
const ROTATE_PER_STEP = 34; // degrees a neighbour turns away from the viewer
const SHIFT_PER_STEP = 42; // % of the card's own width it slides aside
const DEPTH_PER_STEP = 190; // px pushed back along Z

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
      {/* Clipping happens on this OUTER wrapper, never on the track itself:
          per spec, giving an element `overflow` other than `visible` forces it
          to flatten its 3D children, which would silently undo the whole
          cascade. Clipping from an ancestor just trims the rendered result, so
          the rotated cards can bleed off the edges (as coverflow should)
          without pushing the page into horizontal scroll. */}
      <div className="relative overflow-hidden">
        {/* Light bleed sampled from whichever photo is in front — the same
            trick as the homepage room bands: a heavily blurred copy sitting
            behind the cascade, so the carousel bathes its surroundings in the
            active photo's own colour and shifts hue as the visitor flips
            (pool blues → bedroom ambers). Tiny thumbnail on purpose
            (`sizes="10vw"`, quality 40): it's blurred to mush anyway, so
            shipping more pixels would buy nothing. */}
        {images[active] && (
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-4 bottom-4 opacity-50 blur-[64px] saturate-150"
          >
            <Image
              src={images[active].src}
              alt=""
              fill
              quality={40}
              sizes="10vw"
              className="rounded-3xl object-cover"
            />
          </div>
        )}
        <div
          // `perspective` on the track (not on each card) is what makes the
          // cards share one vanishing point — per-card perspective would make
          // each one its own little scene and the cascade would look flat.
          // `preserve-3d` stops the browser flattening the children back down.
          className="relative h-[340px] w-full [perspective:1400px] [transform-style:preserve-3d] sm:h-[420px] md:h-[480px]"
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
                  "absolute inset-0 m-auto h-full w-[78%] overflow-hidden rounded-xl [transform-style:preserve-3d] sm:w-[70%]",
                  isActive ? "cursor-default" : "cursor-pointer",
                )}
                style={{
                  zIndex: 10 - distance,
                  // Layered shadow rather than a single `shadow-xl`: a tight
                  // contact shadow plus a wide soft cast, and the active card
                  // sits visibly higher off the page than its neighbours. Depth
                  // you can see under an object is what sells it as an object.
                  boxShadow: isActive
                    ? "0 2px 6px rgba(24,20,16,0.16), 0 30px 70px -20px rgba(24,20,16,0.48)"
                    : "0 1px 4px rgba(24,20,16,0.12), 0 16px 40px -18px rgba(24,20,16,0.34)",
                }}
                animate={{
                  x: `${offset * SHIFT_PER_STEP}%`,
                  // Negative sign: a card sitting to the right turns its left
                  // edge toward the viewer, like a record in a rack.
                  rotateY: -offset * ROTATE_PER_STEP,
                  z: -distance * DEPTH_PER_STEP,
                  scale: isActive ? 1 : 1 - distance * 0.06,
                  opacity: isActive ? 1 : 1 - distance * 0.26,
                  // Depth of field: only the front photo is in focus, the ones
                  // behind soften with distance exactly as they would through a
                  // lens. This is what makes a photo "arrive" — it resolves into
                  // focus as it comes forward instead of merely sliding over.
                  filter: isActive ? "blur(0px)" : `blur(${distance * 2.5}px)`,
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
                {/* Warm shade on the cards that are turned away — a champagne
                  tint pulled from the brand accent instead of the flat black
                  wash this had before, so receding cards read as being in
                  shadow within the same warm room, not greyed out. */}
                {!isActive && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(200deg, rgba(184,149,106,0.22) 0%, rgba(58,44,32,0.42) 100%)",
                    }}
                  />
                )}
                {/* Specular edge: a single hairline of light down the leading
                  edge of the active card, the way a lit surface catches. */}
                {isActive && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl ring-1 ring-white/15 ring-inset"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
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
