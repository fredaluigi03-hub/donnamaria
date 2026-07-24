"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

/**
 * Returns scroll progress through the document as a 0–1 float, driven by
 * the shared Lenis instance so it stays in sync with smooth-scroll easing
 * (a raw `window.scrollY` listener would feel out of step). Falls back to
 * native scroll events if no Lenis provider is mounted.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useLenis(({ scroll, limit }) => {
    if (limit > 0) setProgress(scroll / limit);
  });

  useEffect(() => {
    function onScroll() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      if (max > 0) setProgress(scrollTop / max);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}
