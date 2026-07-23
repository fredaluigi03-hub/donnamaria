# SEO

## Metadata

Every route's `metadata` export should go through `buildMetadata()` in
`lib/metadata.ts` rather than constructing a raw `Metadata` object —
it fills in `metadataBase`, title templating (`%s · Site Name`), Open
Graph, Twitter cards, and robots directives from `config/site.ts`, so a
page only needs to override `title` and `description`:

```ts
export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "...",
});
```

Update `config/site.ts` once per project (name, description, URL, OG
image, social handles) rather than editing metadata per-page.

## Structured data

Add JSON-LD via a small inline `<script type="application/ld+json">` in
the relevant `page.tsx` for entities that benefit from rich results
(Organization on the homepage, Article for blog posts, LocalBusiness for
location-based clients). There's no site-wide default because the right
schema is entity-specific — decide per project, per page type.

## Sitemap and robots

`app/sitemap.ts` and `app/robots.ts` use Next's built-in metadata file
conventions and read from `siteConfig.url`. Add new top-level routes to
the `routes` array in `sitemap.ts` as they're built; both files
regenerate automatically at build time — nothing to run manually.

## Images

Always use `next/image`, never a raw `<img>`, so images get automatic
`avif`/`webp` conversion, responsive `srcset`, and lazy loading below the
fold. Set `priority` on the single largest above-the-fold image (usually
the hero) so it isn't lazy-loaded. Every image needs meaningful `alt`
text — empty `alt=""` only for purely decorative images.

## URLs and routing

Keep URLs lowercase, hyphenated, and stable — changing a published URL
without a redirect loses indexed rankings. If a route is renamed or
removed, add a redirect in `next.config.ts`.

## Core Web Vitals

SEO and performance are the same discipline in practice — see
`docs/Performance.md`. Poor LCP/CLS/INP directly suppresses ranking, not
just user experience.

## Per-project checklist

Before launch: verify `config/site.ts` has real (not placeholder) values,
confirm `NEXT_PUBLIC_SITE_URL` is set to the production domain in the
hosting environment, generate and check `/sitemap.xml` and `/robots.txt`
in a deployed preview, and run each key page through a rich-results
testing tool if structured data was added.
