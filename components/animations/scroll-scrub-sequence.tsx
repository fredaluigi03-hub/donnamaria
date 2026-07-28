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
  // Lets the preload effect re-trigger the sizing effect's `resize()` once the
  // first frame has loaded and the source resolution is finally knowable.
  const resizeRef = useRef<(() => void) | null>(null);
  const sizedToSourceRef = useRef(false);

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

  // Canvas buffer resolution, scaled by DPR but capped by how much detail the
  // source frames actually hold.
  //
  // Rendering at a flat 1x used to be right, when the frames were ~1136px
  // wide: a retina-sized buffer would only have stretched that same limited
  // source further. The frames now come off a 4K master at 1920px, so a flat
  // 1x throws real detail away — on a 2x screen the browser upscales the whole
  // canvas, softening a source that had the pixels to be sharp.
  //
  // Asking for full DPR would be just as wrong in the other direction: a 2x
  // buffer on a 1425px panel wants ~3200px of source across, and there are
  // only 1920. So take the smaller of the two — never more than the display
  // can show, never more than the frames can supply.
  const bufferScaleFor = (cssWidth: number, sourceWidth: number) => {
    if (!cssWidth || !sourceWidth) return 1;
    return Math.min(window.devicePixelRatio || 1, Math.max(1, sourceWidth / cssWidth));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const source = imagesRef.current.find((i) => i?.naturalWidth)?.naturalWidth ?? 0;
      const scale = bufferScaleFor(rect.width, source);
      canvas.width = Math.round(rect.width * scale);
      canvas.height = Math.round(rect.height * scale);
      sizeRef.current = { width: canvas.width, height: canvas.height };
      draw(frameRef.current);
    };
    resizeRef.current = resize;
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
     
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
        // The very first frame to arrive is what tells us the source
        // resolution, and the buffer was sized before any of them existed —
        // so re-run the sizing now that there's something to measure.
        if (!sizedToSourceRef.current) {
          sizedToSourceRef.current = true;
          resizeRef.current?.();
        }
        if (i === frameRef.current) draw(i);
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
     
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
