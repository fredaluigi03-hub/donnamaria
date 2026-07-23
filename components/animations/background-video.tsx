"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface BackgroundVideoProps {
  src: string;
  /** Poster is rendered by the caller underneath — passed through only so both video layers share it. */
  poster: string;
  className?: string;
}

const CROSSFADE_SECONDS = 1.4;

/**
 * Seamless-looping video background: two <video> layers playing the same
 * clip, offset so one always has a fresh copy ready. As the active layer
 * nears its end, the standby layer starts playing from frame 0 and the two
 * crossfade — no blank frame, no visible restart. Falls back to the poster
 * image (rendered by the caller, underneath) until the first frame decodes,
 * and pauses both layers while the tab is hidden.
 *
 * Shared by every cinematic full-bleed video section (Hero, homepage
 * storytelling sections) — see docs/03_DESIGN_SYSTEM.md's Motion section for
 * why looping footage, not a fixed-length clip, is the site's video language.
 */
export function BackgroundVideo({ src, poster, className }: BackgroundVideoProps) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<"a" | "b">("a");
  const crossfadingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [opacityA, setOpacityA] = useState(1);
  const [opacityB, setOpacityB] = useState(0);

  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB) return;

    videoA.muted = true;
    videoB.muted = true;
    videoB.pause();
    videoB.currentTime = 0;

    const crossfadeTo = (next: "a" | "b") => {
      const outgoing = next === "b" ? videoA : videoB;
      const incoming = next === "b" ? videoB : videoA;
      incoming.currentTime = 0;
      void incoming.play();
      if (next === "b") {
        setOpacityA(0);
        setOpacityB(1);
      } else {
        setOpacityA(1);
        setOpacityB(0);
      }
      activeRef.current = next;
      window.setTimeout(() => {
        outgoing.pause();
        outgoing.currentTime = 0;
        crossfadingRef.current = false;
      }, CROSSFADE_SECONDS * 1000);
    };

    const watch = (source: "a" | "b") => () => {
      if (activeRef.current !== source || crossfadingRef.current) return;
      const active = source === "a" ? videoA : videoB;
      if (!active.duration || Number.isNaN(active.duration)) return;
      if (active.duration - active.currentTime <= CROSSFADE_SECONDS) {
        crossfadingRef.current = true;
        crossfadeTo(source === "a" ? "b" : "a");
      }
    };

    const onTimeUpdateA = watch("a");
    const onTimeUpdateB = watch("b");
    const onReady = () => setReady(true);

    videoA.addEventListener("timeupdate", onTimeUpdateA);
    videoB.addEventListener("timeupdate", onTimeUpdateB);
    videoA.addEventListener("loadeddata", onReady);

    // `loadeddata` can fire before this effect runs and attaches the
    // listener above — the browser starts loading a <video>'s source as
    // soon as it's in the DOM, independent of React's effect timing, and
    // on a fast/cached local video it can easily win that race. Missing the
    // event would leave `ready` stuck at `false` forever, so the video
    // would sit at opacity 0 behind the poster image — mounted and even
    // playing, but permanently invisible. Cover the case where the data is
    // already there by the time we check.
    if (videoA.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setReady(true);
    }
    // Last-resort safety net in case some browser fires neither in a
    // timely way — never leave the video invisible indefinitely.
    const readyFallback = window.setTimeout(() => setReady(true), 2500);

    const onVisibilityChange = () => {
      const active = activeRef.current === "a" ? videoA : videoB;
      if (document.hidden) {
        videoA.pause();
        videoB.pause();
      } else {
        void active.play();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      videoA.removeEventListener("timeupdate", onTimeUpdateA);
      videoB.removeEventListener("timeupdate", onTimeUpdateB);
      videoA.removeEventListener("loadeddata", onReady);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearTimeout(readyFallback);
    };
  }, []);

  return (
    <>
      <video
        ref={videoARef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-hidden="true"
        style={{ opacity: ready ? opacityA : 0 }}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-linear",
          className,
        )}
      >
        <source src={src} type="video/mp4" />
      </video>
      <video
        ref={videoBRef}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{ opacity: ready ? opacityB : 0 }}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-linear",
          className,
        )}
      >
        <source src={src} type="video/mp4" />
      </video>
    </>
  );
}
