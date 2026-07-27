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
    // Deliberately pulled UP with a negative margin, not just given small
    // padding: the section above already ends with ~176px of its own bottom
    // padding, so reducing this one's top padding alone still left a screenful
    // of dead air. The negative margin eats into that gap so "Torna su" reads
    // as attached to the content it closes.
    <Section className="-mt-16 pt-0 pb-8 md:-mt-24 md:pb-10">
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
