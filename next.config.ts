import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // `frame-ancestors 'self'` (not the previous wildcard) stops other sites
  // from embedding this one in an iframe for a clickjacking overlay — a
  // form the visitor thinks is on this page but is actually being fed
  // clicks/keystrokes to click through to something else.
  // `X-Frame-Options` repeats the same rule for the handful of older
  // browsers that don't honour the CSP directive.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self';" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
