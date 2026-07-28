import { Hero } from "@/components/sections/hero";
import { SearchWidget } from "@/components/booking/search-widget";
import { Container } from "@/components/ui/container";
import { RoomsShowcase } from "@/components/sections/rooms-showcase";
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
        imageSrc="/images/hero-jacuzzi-poster.webp"
        imageAlt="Piscina panoramica al tramonto tra le colline d'Irpinia, Donna Maria Suite & Relax"
        // 69 frames at 1920x1080, re-extracted from the 4K source at 8fps and
        // cut at 8.6s — the burned-in "B&B DONNA MARIA RELAX / BOOK YOUR STAY"
        // end card starts fading in right after that. The corner watermark is
        // painted out with ffmpeg's `delogo` rather than cropped away, which is
        // what the previous pass had to do at the cost of 11% of the frame.
        scrubFrames={{
          basePath: "/images/hero-jacuzzi/frame",
          count: 69,
          extension: "webp",
        }}
        primaryCta={{ label: "Prenota Ora", href: "/contatti#richiedi-disponibilita" }}
        secondaryCta={{ label: "Scopri le Camere", href: "/camere" }}
      />

      <Container className="py-10 md:py-14">
        <SearchWidget />
      </Container>

      <RoomsShowcase />
      <Features className="bg-secondary/30" />
      <GalleryPreview />
      <Testimonials />
      <LocationContact />
      <Cta />
    </>
  );
}
