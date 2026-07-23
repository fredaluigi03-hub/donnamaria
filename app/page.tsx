import { Hero } from "@/components/sections/hero";
import { SearchWidget } from "@/components/booking/search-widget";
import { Container } from "@/components/ui/container";
import { OutdoorExperience } from "@/components/sections/outdoor-experience";
import { RoomsShowcase } from "@/components/sections/rooms-showcase";
import { WellnessShowcase } from "@/components/sections/wellness-showcase";
import { Features } from "@/components/sections/features";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { Testimonials } from "@/components/sections/testimonials";
import { LocationContact } from "@/components/sections/location-contact";
import { Cta } from "@/components/sections/cta";
import { siteConfig } from "@/config/site";

const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: siteConfig.name,
  description: siteConfig.description,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  url: siteConfig.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.province,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.country,
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Piscina panoramica" },
    { "@type": "LocationFeatureSpecification", name: "Jacuzzi" },
    { "@type": "LocationFeatureSpecification", name: "Sauna" },
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi gratuito" },
    { "@type": "LocationFeatureSpecification", name: "Parcheggio privato" },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
      />
      <Hero
        kicker="Serino, Irpinia"
        title="Il tuo rifugio di charme tra le colline d'Irpinia"
        subtitle="Suite eleganti, piscina panoramica, jacuzzi e sauna: un'ospitalità autentica a Serino, nel cuore verde della Campania."
        imageSrc="/images/hero-fallback.webp"
        imageAlt="Jacuzzi panoramica al tramonto di Donna Maria Suite & Relax"
        videoSrc="/videos/hero.mp4"
        primaryCta={{ label: "Prenota Ora", href: "/contatti#richiedi-disponibilita" }}
        secondaryCta={{ label: "Scopri le Camere", href: "/camere" }}
      />

      {/* Overlaps the hero's bottom padding — the "Booking-style" search bar. */}
      <Container className="relative z-10 -mt-10 mb-16 md:-mt-14">
        <SearchWidget />
      </Container>

      <OutdoorExperience />
      <WellnessShowcase />
      <RoomsShowcase />
      <Features />
      <GalleryPreview />
      <Testimonials />
      <LocationContact />
      <Cta />
    </>
  );
}
