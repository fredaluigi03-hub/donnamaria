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
    <Section className="py-12 md:py-16">
      <Container className="flex flex-col items-center gap-6">
        <FadeIn className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/">
              <Home aria-hidden="true" />
              Home
            </Link>
          </Button>
          <Button type="button" variant="outline" onClick={scrollToTop}>
            <ArrowUp aria-hidden="true" />
            Torna su
          </Button>
        </FadeIn>

        <FadeIn delay={0.05} className="flex flex-col items-center gap-3">
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            Scopri le altre camere
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {otherRooms.map((other) => (
              <Button key={other.slug} asChild variant="ghost">
                <Link href={`/camere/${other.slug}`}>
                  {other.name}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            ))}
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
