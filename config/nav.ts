import type { NavItem } from "@/types";

/** Primary site navigation, consumed by Header/Footer. Edit here only. */
export const mainNav: NavItem[] = [
  { label: "Camere", href: "/camere" },
  { label: "La Struttura", href: "/la-struttura" },
  { label: "Galleria", href: "/galleria" },
  { label: "Contatti", href: "/contatti" },
];

export const footerNav: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Termini", href: "/terms" },
  { label: "Trasparenza AI", href: "/trasparenza-ai" },
];
