import type { Metadata, Viewport } from "next";

import { fontDisplay, fontSans } from "@/lib/fonts";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SmoothScroll } from "@/components/animations/smooth-scroll";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AmbientBackdrop } from "@/components/ui/ambient-backdrop";

import { LoadingScreen } from "@/components/animations/loading-screen";

import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  // Single value, not a light/dark pair: the site is forced to the light
  // theme (see components/layout/theme-provider.tsx), so matching
  // --background here means the mobile browser chrome never mismatches the
  // page underneath it — including for visitors whose OS is set to dark.
  themeColor: "#faf8f5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={cn(fontSans.variable, fontDisplay.variable, "font-sans")}>
        <ThemeProvider>
          <LoadingScreen />
          <AmbientBackdrop />
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
