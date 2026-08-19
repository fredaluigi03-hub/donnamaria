import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Common props shape for components that just render children + className. */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

/** A single room amenity — icon + short label, used across room cards/pages. */
export interface RoomAmenity {
  icon: LucideIcon;
  label: string;
}

export type RoomSlug = "suite-francy" | "domi" | "mery";

/** A single hotel room/suite, the shared data shape behind config/rooms.ts. */
export interface Room {
  slug: RoomSlug;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  accent: "suite" | "domi" | "mery";
  guests: string;
  /** Surface area, e.g. "22 m²" — shown alongside guests/bed type on cards and detail pages. */
  size: string;
  /** Bed configuration, e.g. "Matrimoniale" or "Matrimoniale king-size". */
  bedType: string;
  heroImage: string;
  coverImage: string;
  gallery: { src: string; alt: string }[];
  amenities: RoomAmenity[];
  /** € per night — the single source the booking widget and the
   * reservation API both price from, so what a guest sees while searching
   * matches what actually gets recorded. */
  basePricePerNight: number;
}

/** A single primary navigation entry. */
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

/** A single social/contact link, e.g. for the footer. */
export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export type { Database, Json } from "./supabase";
