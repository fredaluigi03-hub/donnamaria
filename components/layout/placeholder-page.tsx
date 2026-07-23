import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeading } from "@/components/ui/page-heading";
import { FadeIn } from "@/components/animations/fade-in";

/**
 * Scaffolding placeholder for routes that don't have final content yet.
 * Replace with real page content when building the actual client site —
 * this file exists only so the starter kit's nav links resolve.
 */
export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Section className="pt-32">
      <Container>
        <FadeIn>
          <PageHeading
            title={title}
            description={description}
            descriptionClassName="max-w-xl"
          />
        </FadeIn>
      </Container>
    </Section>
  );
}
