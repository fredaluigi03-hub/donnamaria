"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Reactively track a CSS media query. Returns `false` on the server and
 * during the first client render to avoid hydration mismatches. Built on
 * `useSyncExternalStore` so subscribing to `matchMedia` changes never
 * triggers a synchronous `setState` inside an effect.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onStoreChange);
      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
