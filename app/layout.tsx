import type { Metadata, Viewport } from "next";

import { fontDisplay, fontSans } from "@/lib/fonts";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SmoothScroll } from "@/components/animations/smooth-scroll";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  // Matches --background in app/globals.css (light/dark) so the mobile
  // browser chrome never mismatches the page underneath it.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1714" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={cn(fontSans.variable, fontDisplay.variable, "font-sans")}>
        <ThemeProvider>
          <SmoothScroll>
            <div className="flex min-h-dvh flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
