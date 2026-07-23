"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server. React warns
 * ("useLayoutEffect does nothing on the server") whenever a Client
 * Component using a bare `useLayoutEffect` is rendered during SSR — which
 * every Client Component is, once, in the App Router. Use this instead in
 * any shared hook/component that needs layout timing but may render on
 * the server (e.g. `useGsap`).
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
