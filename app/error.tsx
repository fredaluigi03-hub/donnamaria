"use client";

import { useEffect } from "react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";

/**
 * Route-level error boundary (Next.js file convention). Catches errors
 * thrown while rendering a route segment or its children and shows a
 * recoverable UI instead of the framework's default error screen.
 * Does not catch errors in the root layout — see app/global-error.tsx.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with real error reporting (Sentry, etc.) per project.
    console.error(error);
  }, [error]);

  return (
    <Section className="pt-40">
      <Container className="flex flex-col items-start gap-6">
        <p className="text-muted-foreground text-sm font-medium">Errore</p>
        <PageHeading
          title="Qualcosa è andato storto."
          description="Si è verificato un errore imprevisto. Puoi riprovare, oppure tornare alla home."
          descriptionClassName="max-w-md"
        />
        <Button onClick={reset}>Riprova</Button>
      </Container>
    </Section>
  );
}
