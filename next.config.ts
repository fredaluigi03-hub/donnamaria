import type { NextConfig } from "next";

/**
 * Central Next.js configuration.
 *
 * Keep this file the single source of truth for framework-level behavior
 * (images, redirects, headers, experimental flags). Client-specific
 * overrides should be added here per project, not scattered across the app.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    // 75 is next/image's own default; 92 is used on the homepage hero for
    // extra crispness on its large full-bleed poster frame. 90 is used by the
    // gallery/wellness/exterior sections — without it listed here Next refuses
    // the value and warns on every single request for those images.
    qualities: [75, 90, 92],
    remotePatterns: [
      // Add remote image hosts per client project, e.g.:
      // { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
