"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap } from "gsap";

/**
 * Mount once near the root of the app (see app/layout.tsx). Provides a
 * global Lenis instance (`root`) so `useLenis` works anywhere, and drives
 * Lenis's raf loop from GSAP's ticker (with `autoRaf: false`) so GSAP and
 * Lenis never fall out of sync — the integration pattern recommended by
 * both projects. Without this, ScrollTrigger-pinned/scrubbed animations
 * drift relative to the smoothed scroll position.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    let scrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger | undefined;

    import("gsap/ScrollTrigger").then((mod) => {
      scrollTrigger = mod.ScrollTrigger;
      gsap.registerPlugin(scrollTrigger);
      lenisRef.current?.lenis?.on("scroll", () => scrollTrigger?.update());
    });

    function update(time: number) {
      // GSAP's ticker reports time in seconds; Lenis expects milliseconds.
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      scrollTrigger?.getAll().forEach((instance) => instance.kill());
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
