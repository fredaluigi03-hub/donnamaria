"use client";

import Link from "next/link";
import { ArrowUp, Home, Hotel, Sparkles } from "lucide-react";
import { useLenis } from "lenis/react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/animations/fade-in";
import { Tilt3D } from "@/components/animations/tilt-3d";

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
    <Section className="relative -mt-6 py-6 md:-mt-8 md:py-8">
      <Container className="flex flex-col items-center justify-center gap-4 text-center">
        {/* 3D Interactive Navigation Dock */}
        <FadeIn delay={0.05}>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
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
                Torna su
              </button>
            </Tilt3D>

            <Tilt3D>
              <Link
                href="/camere"
                className="group border-gold/40 bg-card/90 hover:border-gold hover:bg-gold/10 text-foreground hover:shadow-gold/20 inline-flex items-center gap-2.5 rounded-full border px-6 py-3 text-xs font-semibold tracking-widest uppercase shadow-xl shadow-black/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
              >
                <Hotel className="text-gold size-4" aria-hidden="true" />
                Vai nelle Camere
              </Link>
            </Tilt3D>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
