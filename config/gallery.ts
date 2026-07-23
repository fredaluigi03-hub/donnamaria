import { rooms } from "@/config/rooms";

export const galleryCategories = [
  "Suite Francy",
  "Domi",
  "Mery",
  "Piscina",
  "Wellness",
  "Esterni",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export interface GalleryImage {
  src: string;
  alt: string;
  category: GalleryCategory;
}

const roomCategoryByAccent: Record<string, GalleryCategory> = {
  "suite-francy": "Suite Francy",
  domi: "Domi",
  mery: "Mery",
};

const roomImages: GalleryImage[] = rooms.flatMap((room) => [
  {
    src: room.coverImage,
    alt: `${room.name} — ${room.tagline}`,
    category: roomCategoryByAccent[room.slug]!,
  },
  ...room.gallery.map((image) => ({
    ...image,
    category: roomCategoryByAccent[room.slug]!,
  })),
]);

const poolImages: GalleryImage[] = [
  {
    src: "/images/pool/hero.png",
    alt: "Piscina panoramica di Donna Maria Suite & Relax",
    category: "Piscina",
  },
  {
    src: "/images/pool/piscina2.png",
    alt: "Vista laterale della piscina",
    category: "Piscina",
  },
  {
    src: "/images/pool/piescina3.png",
    alt: "Lettini a bordo piscina",
    category: "Piscina",
  },
  {
    src: "/images/pool/piscina4.png",
    alt: "Dettaglio della piscina al tramonto",
    category: "Piscina",
  },
];

const wellnessImages: GalleryImage[] = [
  {
    src: "/images/wellness/jacuzzi.png",
    alt: "Jacuzzi riscaldata nell'area wellness",
    category: "Wellness",
  },
  {
    src: "/images/wellness/jacuzzi2.png",
    alt: "Dettaglio della jacuzzi al tramonto",
    category: "Wellness",
  },
  {
    src: "/images/wellness/sauna2.png",
    alt: "Sauna in legno dell'area wellness",
    category: "Wellness",
  },
  {
    src: "/images/fitness/hero.png",
    alt: "Angolo fitness della struttura",
    category: "Wellness",
  },
];

const exteriorImages: GalleryImage[] = [
  {
    src: "/images/exterior/hero.png",
    alt: "Facciata e ingresso di Donna Maria Suite & Relax",
    category: "Esterni",
  },
  {
    src: "/images/exterior/ingresso2.png",
    alt: "Dettaglio dell'ingresso della struttura",
    category: "Esterni",
  },
];

export const galleryImages: GalleryImage[] = [
  ...roomImages,
  ...poolImages,
  ...wellnessImages,
  ...exteriorImages,
];
