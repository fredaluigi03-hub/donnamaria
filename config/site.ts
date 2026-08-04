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

/**
 * Testi della disclosure IA — centralizzati qui perché la stessa frase compare
 * nel badge del footer, nel pannello, sulle etichette dei media e nella scheda
 * camera: un solo punto da aggiornare se la formulazione legale cambia.
 */
export const aiDisclosure = {
  badge: "Trasparenza AI",
  tagShort: "Generata con IA",
  roomNote:
    "Le immagini di questa camera sono generate con intelligenza artificiale: arredi, luci e proporzioni possono differire dall'ambiente reale.",
  panelTitle: "Contenuti generati con IA",
  panelBody: [
    "Le immagini e i video di questo sito — hero, gallerie delle camere, piscina, area wellness ed esterni — sono generati con intelligenza artificiale. Non sono fotografie reali della struttura.",
    "La struttura, le camere e i servizi che descriviamo sono invece reali: l'IA riguarda il modo in cui gli ambienti vengono rappresentati, non ciò che offriamo. Arredi, finiture e proporzioni possono quindi differire da quanto troverai al tuo arrivo.",
    "Lo dichiariamo in modo esplicito come previsto dall'art. 50 del Regolamento UE 2024/1689 sull'intelligenza artificiale, applicabile dal 2 agosto 2026.",
  ],
} as const;
