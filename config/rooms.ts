import {
  Bath,
  BedDouble,
  BedSingle,
  ChefHat,
  Coffee,
  Droplets,
  Flower2,
  Footprints,
  Gift,
  Heart,
  Layers,
  Refrigerator,
  Shirt,
  ShowerHead,
  Sofa,
  Sparkles,
  Tv,
  UtensilsCrossed,
  Users,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";

import type { Room } from "@/types";

/**
 * Single source of truth for the three rooms — consumed by the homepage
 * rooms showcase, the /camere hub, each room detail page, and the gallery
 * filters. Edit room copy/images/amenities here only; components read from
 * this file.
 *
 * Icon-to-concept mapping is intentionally 1:1 across all rooms (same
 * amenity always uses the same icon) — don't reuse an icon for a
 * different concept within the same room's list.
 *
 * `size` (m²) values are estimates pending real measurements from the
 * property — confirm and correct before launch.
 */

// Shared amenity building blocks — compose per room below so identical
// concepts (Wi-Fi, aria condizionata, ecc.) don't drift in icon or label.
const wifi: Room["amenities"][number] = { icon: Wifi, label: "Wi-Fi gratuito" };
const tv: Room["amenities"][number] = { icon: Tv, label: "TV" };
const ac: Room["amenities"][number] = { icon: Wind, label: "Aria condizionata" };
const breakfast: Room["amenities"][number] = {
  icon: UtensilsCrossed,
  label: "Colazione inclusa",
};
const coffeeMachine: Room["amenities"][number] = {
  icon: Coffee,
  label: "Macchina da caffè in camera",
};
const minibar: Room["amenities"][number] = { icon: Refrigerator, label: "Frigobar" };
const courtesyKit: Room["amenities"][number] = { icon: Gift, label: "Kit di cortesia" };
const extraPillows: Room["amenities"][number] = {
  icon: Layers,
  label: "Cuscini extra",
};
const shower: Room["amenities"][number] = { icon: ShowerHead, label: "Doccia" };
const linens: Room["amenities"][number] = {
  icon: Shirt,
  label: "Biancheria inclusa",
};
const slippers: Room["amenities"][number] = { icon: Footprints, label: "Ciabattine" };
const privateBathroom: Room["amenities"][number] = {
  icon: Bath,
  label: "Bagno privato",
};

export const rooms: Room[] = [
  {
    slug: "suite-francy",
    name: "Suite Francy",
    tagline: "Sauna privata e vasca idromassaggio",
    shortDescription:
      "Una suite romantica pensata per il puro relax, con sauna privata e vasca idromassaggio.",
    description:
      "La Suite Francy è il nostro angolo più intimo e romantico: uno spazio elegante dove il benessere privato diventa protagonista del soggiorno. Sauna privata e vasca idromassaggio trasformano ogni momento in un rituale di relax, mentre gli arredi curati nei minimi dettagli avvolgono gli ospiti in un'atmosfera calda e raffinata. L'esperienza ideale per chi cerca una fuga romantica o semplicemente il proprio tempo di totale benessere.",
    accent: "suite",
    guests: "2 ospiti",
    size: "26 m²",
    bedType: "Matrimoniale king-size",
    heroImage: "/images/rooms/suite/lettosuiteorizzontale.jpg",
    coverImage: "/images/rooms/suite/lettosuite.jpg",
    gallery: [
      {
        src: "/images/rooms/suite/lettosuiteorizzontale.jpg",
        alt: "Vista d'insieme della Suite Francy",
      },
      { src: "/images/rooms/suite/lettosuite.jpg", alt: "Letto della Suite Francy" },
      {
        src: "/images/rooms/suite/saunasuite.png",
        alt: "Sauna privata della Suite Francy",
      },
      { src: "/images/rooms/suite/sauna2.png", alt: "Dettaglio della sauna privata" },
      {
        src: "/images/rooms/suite/vascasuite.png",
        alt: "Vasca idromassaggio della Suite Francy",
      },
      { src: "/images/rooms/suite/bagnosuite.png", alt: "Bagno della Suite Francy" },
      {
        src: "/images/rooms/suite/angolobagnosuite.png",
        alt: "Angolo bagno della Suite Francy",
      },
      {
        src: "/images/rooms/suite/lavandinosuite.png",
        alt: "Lavandino della Suite Francy",
      },
      {
        src: "/images/rooms/suite/vasosuite.png",
        alt: "Dettaglio bagno della Suite Francy",
      },
    ],
    // No piscina in this room — everything else included.
    amenities: [
      { icon: Sparkles, label: "Sauna privata" },
      { icon: Droplets, label: "Vasca idromassaggio" },
      { icon: Heart, label: "Atmosfera romantica" },
      wifi,
      tv,
      ac,
      breakfast,
      coffeeMachine,
      minibar,
      courtesyKit,
      extraPillows,
      shower,
      linens,
      slippers,
      privateBathroom,
      { icon: BedDouble, label: "Letto matrimoniale" },
      { icon: Users, label: "Fino a 2 ospiti" },
    ],
  },
  {
    slug: "domi",
    name: "Appartamento Domi",
    tagline: "Living, cucina e comfort per la famiglia",
    shortDescription:
      "Un appartamento spazioso con zona living e cucina, perfetto per le famiglie.",
    description:
      "L'appartamento Domi è pensato per chi cerca lo spazio e la libertà di una vera casa lontano da casa. Zona living luminosa, cucina attrezzata e divano letto lo rendono la soluzione ideale per famiglie e soggiorni prolungati, senza rinunciare alla cura del dettaglio che contraddistingue tutta la struttura. Ogni angolo è stato pensato per far sentire a proprio agio anche i più piccoli.",
    accent: "domi",
    guests: "Fino a 4 ospiti",
    size: "38 m²",
    bedType: "2 letti singoli + divano letto",
    heroImage: "/images/rooms/domi/lettodomiorizzontale.jpg",
    // `hero.jpg` (4:5 portrait, for the homepage band) is a different file from
    // the legacy `hero.png` and from `lettodomiorizzontale.jpg` (16:9, the page
    // header above) — three similar names, three different crops. Don't
    // collapse them.
    coverImage: "/images/rooms/domi/hero.jpg",
    gallery: [
      {
        src: "/images/rooms/domi/lettodomiorizzontale.jpg",
        alt: "Vista d'insieme dell'appartamento Domi",
      },
      {
        src: "/images/rooms/domi/ingressodomi.png",
        alt: "Ingresso dell'appartamento Domi",
      },
      {
        src: "/images/rooms/domi/salottinodomi.png",
        alt: "Zona living dell'appartamento Domi",
      },
      {
        src: "/images/rooms/domi/cucinettadomi.png",
        alt: "Cucina dell'appartamento Domi",
      },
      {
        src: "/images/rooms/domi/caffettieradomi.png",
        alt: "Angolo caffè dell'appartamento Domi",
      },
      {
        src: "/images/rooms/domi/letto2domi.png",
        alt: "Camera da letto dell'appartamento Domi",
      },
      {
        src: "/images/rooms/domi/lavandinidomi.png",
        alt: "Bagno dell'appartamento Domi",
      },
      { src: "/images/rooms/domi/docciadomi.png", alt: "Doccia dell'appartamento Domi" },
      {
        src: "/images/rooms/domi/quadrodomi.png",
        alt: "Dettaglio d'arredo dell'appartamento Domi",
      },
    ],
    amenities: [
      { icon: ChefHat, label: "Cucina attrezzata" },
      { icon: Sofa, label: "Divano letto" },
      wifi,
      breakfast,
      tv,
      ac,
      minibar,
      courtesyKit,
      extraPillows,
      shower,
      linens,
      coffeeMachine,
      { icon: BedSingle, label: "2 letti singoli" },
      slippers,
      privateBathroom,
      { icon: Users, label: "Ideale per famiglie" },
    ],
  },
  {
    slug: "mery",
    name: "Camera Mery",
    tagline: "Camera matrimoniale in toni rosa",
    shortDescription:
      "Una camera matrimoniale romantica, avvolta in delicati toni rosa cipria.",
    description:
      "La camera Mery è un rifugio delicato e romantico, dove i toni rosa cipria incontrano un design curato ed elegante. Pensata per chi cerca un soggiorno intimo all'insegna del relax, unisce comfort e atmosfera in ogni dettaglio, dal letto matrimoniale agli arredi scelti con cura per creare un'esperienza serena e avvolgente.",
    accent: "mery",
    guests: "2 ospiti",
    size: "20 m²",
    bedType: "Matrimoniale",
    heroImage: "/images/rooms/mery/lettomeryorizzontale.jpg",
    coverImage: "/images/rooms/mery/lettomery.jpg",
    gallery: [
      {
        src: "/images/rooms/mery/lettomeryorizzontale.jpg",
        alt: "Vista d'insieme della camera Mery",
      },
      {
        src: "/images/rooms/mery/lettomery.jpg",
        alt: "Letto matrimoniale della camera Mery",
      },
      {
        src: "/images/rooms/mery/letto2mery.png",
        alt: "Dettaglio del letto della camera Mery",
      },
      { src: "/images/rooms/mery/scrivaniamery.png", alt: "Scrivania della camera Mery" },
      {
        src: "/images/rooms/mery/cucinamery.png",
        alt: "Angolo cottura della camera Mery",
      },
      { src: "/images/rooms/mery/lavandinomery.png", alt: "Lavandino della camera Mery" },
      { src: "/images/rooms/mery/bagnomery.png", alt: "Bagno della camera Mery" },
    ],
    amenities: [
      { icon: Heart, label: "Atmosfera romantica" },
      { icon: Flower2, label: "Toni rosa cipria" },
      { icon: Waves, label: "Piscina" },
      wifi,
      tv,
      ac,
      breakfast,
      coffeeMachine,
      minibar,
      courtesyKit,
      extraPillows,
      shower,
      linens,
      { icon: Sofa, label: "Divano letto" },
      slippers,
      privateBathroom,
      { icon: BedDouble, label: "Letto matrimoniale" },
      { icon: Users, label: "Fino a 2 ospiti" },
    ],
  },
];

export function getRoomBySlug(slug: string): Room | undefined {
  return rooms.find((room) => room.slug === slug);
}
