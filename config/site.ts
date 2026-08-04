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
  // "Rielaborata", non "Generata": le immagini partono da fotografie reali
  // della struttura. Dichiarare più del vero non è prudenza — è dire
  // all'ospite che il posto che sta guardando non esiste.
  tagShort: "Rielaborata con IA",
  /** Pagina pubblica: è la versione linkabile e indicizzabile della dichiarazione. */
  href: "/trasparenza-ai",
  // Data fissa, non `new Date()`: serve a dire "questo testo è online da qui",
  // e una data che si aggiorna da sola ogni build non prova nulla.
  updatedAt: "2026-08-05",
  /** Riga sopra il tasto di invio: è lì che l'ospite decide davvero. */
  formNote:
    "Prima di inviare: le immagini di questo sito partono da fotografie reali della struttura, rielaborate con IA per angolo, luce e qualità.",
  /** Ripetuta nella conferma, così resta anche fuori dalla pagina. */
  confirmationNote:
    "Ti ricordiamo che le immagini del sito sono fotografie della struttura rielaborate con IA: saremo felici di inviarti scatti non rielaborati della camera prima della conferma.",
  roomNote:
    "Le immagini di questa camera sono fotografie reali rielaborate con intelligenza artificiale: luce, colori e prospettiva possono differire da quanto vedrai dal vivo.",
  panelTitle: "Trasparenza sulle immagini",
  panelBody: [
    "Le immagini e i video di questo sito — hero, gallerie delle camere, piscina, area wellness ed esterni — partono da fotografie reali della struttura, rielaborate con intelligenza artificiale per angolo di ripresa, luce e qualità. Gli ambienti che vedi esistono e sono i nostri.",
    "L'IA riguarda il modo in cui gli ambienti sono ripresi, non ciò che offriamo. Colori, luce e prospettiva possono quindi differire da quanto vedrai dal vivo.",
    "Lo dichiariamo in modo esplicito come previsto dall'art. 50 del Regolamento UE 2024/1689 sull'intelligenza artificiale, che riguarda i contenuti generati o manipolati con IA ed è applicabile dal 2 agosto 2026.",
  ],
} as const;
