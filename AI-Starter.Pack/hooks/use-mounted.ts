"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/**
 * True only after the component has mounted on the client. Use to gate
 * browser-only UI (theme toggle icons, portal-based overlays) so server
 * and first client render markup match exactly. Built on
 * `useSyncExternalStore` (rather than a `useEffect` + `setState`) since the
 * "external system" here is simply "are we past hydration."
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
