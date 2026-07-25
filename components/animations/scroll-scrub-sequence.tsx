"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

export interface ScrollScrubSequenceProps {
  /** Frames live at `${basePath}-XXX.${extension}`, 1-indexed, zero-padded to 3 digits. */
  basePath: string;
  frameCount: number;
  extension?: string;
  /** 0..1 value that picks the frame — typically a scroll-linked `scrollYProgress`. */
  progress: MotionValue<number>;
  className?: string;
}

/**
 * Plays a pre-extracted image sequence on a <canvas>, picking whichever
 * frame corresponds to `progress` (0..1) — used in place of an
 * autoplaying/looping <video> for the Hero background.
 *
 * Why: an autoplaying loop has a restart every N seconds that reads as a
 * jarring "jump" no crossfade fully hides, and it never stops, which feels
 * restless if a visitor just wants to read the hero copy. Driving the frame
 * directly off scroll instead means the motion only ever happens because
 * the visitor is scrolling — it advances as they scroll down and, since
 * `progress` is just scroll position, naturally rewinds if they scroll back
 * up. No loop, no autoplay, no restart to notice.
 *
 * Drawn on `<canvas>` (not swapped `<img src>`) so changing frames never
 * costs a layout/paint — object-cover cropping is computed once per resize
 * and frames are just blitted.
 */
export function ScrollScrubSequence({
  basePath,
  frameCount,
  extension = "jpg",
  progress,
  className,
}: ScrollScrubSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0 });

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];
    const { width, height } = sizeRef.current;
    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;
    if (!width || !height) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // object-cover: scale the frame up to fill the box, center-cropping
    // whichever axis overflows — same visual contract as the <video>'s
    // `object-cover` it replaces.
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = width / height;
    let drawWidth: number;
    let drawHeight: number;
    if (imgRatio > boxRatio) {
      drawHeight = height;
      drawWidth = drawHeight * imgRatio;
    } else {
      drawWidth = width;
      drawHeight = drawWidth / imgRatio;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(
      img,
      (width - drawWidth) / 2,
      (height - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
  };

  // Keep the canvas's pixel buffer matched to its displayed size — at 1x,
  // deliberately *not* multiplied by devicePixelRatio. The source frames
  // are photographic stills capped at ~1280px wide; on a 2x/3x-DPR screen,
  // sizing the canvas buffer to match the panel's real pixel density would
  // just make the browser stretch that same limited source further,
  // compounding the softness instead of adding any real sharpness — there's
  // no extra detail in the source to resolve at a higher buffer size. 1x
  // plus `imageSmoothingQuality: "high"` below is the sharper result for
  // this specific case (a low-res source stretched to fill the viewport).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
      sizeRef.current = { width: canvas.width, height: canvas.height };
      draw(frameRef.current);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preload every frame once. The first frame draws as soon as it's ready
  // (so the canvas never sits blank on top of the poster image underneath);
  // later frames just backfill `imagesRef` for the scrub handler below —
  // if the user scrolls faster than they've loaded, `draw()` silently
  // no-ops for that frame until it arrives (the poster/last-good frame
  // stays visible rather than flashing broken image icons).
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = `${basePath}-${String(i + 1).padStart(3, "0")}.${extension}`;
      img.onload = () => {
        if (cancelled) return;
        if (i === frameRef.current) draw(i);
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath, frameCount, extension]);

  useMotionValueEvent(progress, "change", (latest) => {
    const index = Math.min(
      frameCount - 1,
      Math.max(0, Math.round(latest * (frameCount - 1))),
    );
    if (index === frameRef.current) return;
    frameRef.current = index;
    draw(index);
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}
