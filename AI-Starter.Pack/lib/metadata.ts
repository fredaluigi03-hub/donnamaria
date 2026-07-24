import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Build a page-level Metadata object with sensible SEO defaults, merged
 * with per-page overrides. Use this in every `page.tsx` instead of writing
 * ad-hoc metadata objects, so title templates, OG images, and canonical
 * URLs stay consistent site-wide. See docs/SEO.md.
 */
export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const title = overrides.title ?? siteConfig.name;
  const description = overrides.description ?? siteConfig.description;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s · ${siteConfig.name}`,
    },
    description,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.author,
    openGraph: {
      type: "website",
      locale: "it_IT",
      url: siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    // Favicon/apple-touch-icon are generated from app/icon.png + app/apple-icon.png
    // (Next.js file-convention) — no manual `icons` field needed here.
    ...overrides,
  };
}
