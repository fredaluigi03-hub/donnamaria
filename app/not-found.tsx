import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";

export default function NotFound() {
  return (
    <Section className="pt-40">
      <Container className="flex flex-col items-start gap-6">
        <p className="text-muted-foreground text-sm font-medium">404</p>
        <PageHeading
          title="Pagina non trovata."
          description="La pagina che stai cercando non esiste o è stata spostata."
          descriptionClassName="max-w-md"
        />
        <Button asChild>
          <Link href="/">Torna alla home</Link>
        </Button>
      </Container>
    </Section>
  );
}
