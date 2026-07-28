"use client";

import Link from "next/link";
import { ArrowRight, ArrowUp, Home } from "lucide-react";
import { useLenis } from "lenis/react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";

export interface RoomNavProps {
  /** Other rooms to cross-link to — deliberately just slug/name (strings),
   * not the full Room record, so this stays serializable across the
   * server → client boundary (the full record carries lucide-react icon
   * components, which React can't send to a Client Component as props). */
  otherRooms: { slug: string; name: string }[];
}

/**
 * Bottom-of-page navigation for room detail pages: home, back-to-top, and
 * links to the other rooms. Split out from RoomDetail (a Server Component)
 * because it needs the Lenis "use client" scroll hook — keeping it isolated
 * here means RoomDetail can stay server-rendered and pass `room` (which
 * includes non-serializable icon components) straight to JSX without ever
 * crossing a client-component prop boundary.
 */
import { Tilt3D } from "@/components/animations/tilt-3d";

export function RoomNav({ otherRooms }: RoomNavProps) {
  const lenis = useLenis();

  function scrollToTop() {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Section className="relative py-16 md:py-20">
      <Container className="flex flex-col items-center gap-8">
        <FadeIn className="flex flex-col items-center gap-2 text-center">
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">
            Esplora le altre dimore
          </span>
          <p className="font-display text-muted-foreground text-lg font-light italic">
            Ogni camera ha una sua storia speciale.
          </p>
        </FadeIn>

        <FadeIn delay={0.05} className="flex flex-wrap items-center justify-center gap-4">
          <Tilt3D>
            <button
              type="button"
              onClick={scrollToTop}
              className="group border-gold/40 bg-card/90 hover:border-gold hover:bg-gold/10 text-foreground hover:shadow-gold/20 inline-flex items-center gap-2.5 rounded-full border px-6 py-3 text-xs font-semibold tracking-widest uppercase shadow-xl shadow-black/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
            >
              <ArrowUp
                className="text-gold size-4 transition-transform duration-300 group-hover:-translate-y-1"
                aria-hidden="true"
              />
              Torna in alto
            </button>
          </Tilt3D>

          <Tilt3D>
            <Link
              href="/"
              className="group border-gold/40 bg-card/90 hover:border-gold hover:bg-gold/10 text-foreground hover:shadow-gold/20 inline-flex items-center gap-2.5 rounded-full border px-6 py-3 text-xs font-semibold tracking-widest uppercase shadow-xl shadow-black/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
            >
              <Home className="text-gold size-4" aria-hidden="true" />
              Torna alla Home
            </Link>
          </Tilt3D>

          {otherRooms.map((other) => (
            <Tilt3D key={other.slug}>
              <Link
                href={`/camere/${other.slug}`}
                className="group border-gold/30 bg-card/80 hover:border-gold hover:bg-gold/10 text-foreground inline-flex items-center gap-2 rounded-full border px-6 py-3 text-xs font-medium tracking-widest uppercase shadow-lg shadow-black/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
              >
                <span>{other.name}</span>
                <ArrowRight
                  className="text-gold size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Tilt3D>
          ))}
        </FadeIn>
      </Container>
    </Section>
  );
}
