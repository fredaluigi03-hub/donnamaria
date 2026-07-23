import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({ title: "Privacy" });

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      title="Informativa Privacy"
      description="Il testo legale dell'informativa sulla privacy (trattamento dei dati personali, GDPR) sarà pubblicato qui — da redigere con un consulente prima del lancio del sito."
    />
  );
}
