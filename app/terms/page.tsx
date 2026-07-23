import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({ title: "Termini" });

export default function TermsPage() {
  return (
    <PlaceholderPage
      title="Termini e Condizioni"
      description="Le condizioni generali di soggiorno e prenotazione saranno pubblicate qui — da redigere con un consulente prima del lancio del sito."
    />
  );
}
