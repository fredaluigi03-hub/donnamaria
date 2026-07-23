/**
 * Site identity — the values that change per client project.
 * Update this file (and .env.local) when starting a new build; component
 * code should never hardcode a brand name, URL, or social handle directly.
 */
export const siteConfig = {
  name: "Donna Maria Suite & Relax",
  description:
    "Boutique hotel a Serino, nel cuore dell'Irpinia: suite eleganti, piscina, jacuzzi e sauna per un soggiorno di puro relax.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/images/herohome/hero.png",
  author: "Donna Maria Suite & Relax",
  // Nessuna email reale confermata dalla struttura — legge da env var così
  // può essere impostata senza toccare il codice. Il fallback è
  // intenzionalmente riconoscibile come segnaposto (mai un indirizzo
  // plausibile) per non rischiare di finire in produzione inosservato.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "DA-COMPILARE@donnamariasuite.it",
  phone: "+39 351 274 9127",
  phoneDisplay: "351 274 9127",
  whatsapp: "https://wa.me/393512749127",
  // Link al profilo Google/Booking con le recensioni complete — non ancora
  // fornito. Finché resta `undefined`, il bottone "Leggi tutte le
  // recensioni" non viene renderizzato (vedi testimonials.tsx) invece di
  // puntare a un link finto.
  reviewsUrl: undefined as string | undefined,
  keywords: [
    "boutique hotel Serino",
    "suite relax Irpinia",
    "hotel benessere Avellino",
    "jacuzzi e sauna Campania",
    "soggiorno romantico Irpinia",
    "Donna Maria Suite Relax",
  ],
  address: {
    street: "Via Tenente Paolo de Vivo, 10",
    postalCode: "83028",
    city: "Serino",
    province: "AV",
    country: "IT",
    countryName: "Italia",
  },
  // Nessun profilo social attivo al momento — aggiungere qui quando disponibili.
  links: {},
} as const;
