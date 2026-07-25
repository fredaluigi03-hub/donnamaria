"use client";

import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/animations/fade-in";

/**
 * Closing element before the Footer — deliberately minimal (just a "torna
 * su" prompt), not a second big booking pitch. The primary booking CTA
 * already appears in the Hero and the sticky header on every page; a large
 * dark "Prenota il tuo soggiorno" box repeating that same ask right before
 * the footer read as redundant and was replaced with this on request.
 */
export function Cta() {
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
      <Container className="flex justify-center">
        <FadeIn>
          <button
            type="button"
            onClick={scrollToTop}
            className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium tracking-wide transition-colors"
          >
            <ArrowUp
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
            Torna su
          </button>
        </FadeIn>
      </Container>
    </Section>
  );
}
