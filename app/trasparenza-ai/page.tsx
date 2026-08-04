import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeading } from "@/components/ui/page-heading";
import { FadeIn } from "@/components/animations/fade-in";
import { aiDisclosure } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({ title: aiDisclosure.badge });

/**
 * Versione pubblica e indicizzabile della dichiarazione IA.
 * Il <dialog> nel footer è comodo ma vive solo lato client: se un domani serve
 * dimostrare *cosa* era dichiarato e *da quando*, serve un URL con una data.
 */
export default function TrasparenzaAiPage() {
  return (
    <Section className="pt-32">
      <Container>
        <FadeIn>
          <PageHeading
            title={aiDisclosure.panelTitle}
            description={aiDisclosure.panelBody[0]}
            descriptionClassName="max-w-2xl"
          />
        </FadeIn>
        <FadeIn delay={0.05}>
          <div className="text-muted-foreground mt-8 flex max-w-2xl flex-col gap-4 text-base leading-relaxed">
            {aiDisclosure.panelBody.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="text-foreground">{aiDisclosure.confirmationNote}</p>
            <p className="text-sm">
              Ultimo aggiornamento:{" "}
              <time dateTime={aiDisclosure.updatedAt}>
                {new Date(aiDisclosure.updatedAt).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </p>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
