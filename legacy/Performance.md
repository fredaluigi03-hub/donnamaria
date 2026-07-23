# Performance

## Budgets

Treat these as the default budget for every project on this kit unless
the client brief says otherwise: LCP under 2.5s, CLS under 0.1, INP under
200ms, and a total JS payload (first load) under ~200KB gzipped for the
homepage. Check with Lighthouse (or `next build` output + a WebPageTest
run) before calling a page done, not just once at project end.

## Images and fonts

Every image goes through `next/image` (see `docs/SEO.md`) — this alone
prevents most CLS regressions from images. Fonts load through
`next/font/google` in `lib/fonts.ts`, which self-hosts and inlines
`font-display: swap` automatically — never add a third-party `<link>` to
Google Fonts directly, it reintroduces a render-blocking request this
setup exists to avoid.

## Rendering strategy

Default to Server Components; add `"use client"` only where interactivity
genuinely requires it (forms, animated components, anything using
`useState`/`useEffect`/browser APIs). Every animation primitive in
`components/animations/` is already marked `"use client"` — compose them
from Server Component pages rather than making the whole page client-side.
Use `app/loading.tsx` and Suspense boundaries around slow data fetches so
the shell paints immediately.

## Animation performance

Motion and GSAP animate `transform`/`opacity` almost exclusively in this
kit's primitives — both are compositor-friendly and don't trigger layout.
Avoid adding animations that touch `width`, `height`, `top`, or `left`
directly; animate `scale`/`translate` instead. `SmoothScroll` keeps GSAP's
ScrollTrigger ticking off `gsap.ticker`, not a separate `requestAnimationFrame`
loop, to avoid duplicate render work.

## Bundle discipline

Check `next build`'s route-level bundle output after adding a new
dependency — a single misplaced client-only chart or rich-text library
can double a route's JS payload. Prefer dynamic `import()` with
`next/dynamic` for anything heavy that isn't needed on initial paint
(modals, below-the-fold widgets).

## Caching and data

Use Next's fetch caching and `revalidate` options deliberately per route
rather than defaulting to fully dynamic rendering — static or
incrementally revalidated pages are the fastest and cheapest to serve.
For Supabase reads that don't need to be real-time, prefer Server
Components with a sensible `revalidate` over client-side fetching.

## Verifying before launch

Run `npm run build` and read the route size table it prints; run a
Lighthouse pass on the deployed Vercel preview, not just localhost
(network conditions differ materially); confirm no console errors/warnings
on first load in production mode.
