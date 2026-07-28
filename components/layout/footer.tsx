import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/ui/container";
import { footerNav, mainNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { rooms } from "@/config/rooms";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 from-secondary/50 via-secondary/70 to-secondary/90 relative isolate overflow-hidden border-t bg-gradient-to-b">
      {/* Top gold accent gradient line */}
      <div
        aria-hidden="true"
        className="via-gold/60 absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent to-transparent"
      />
      {/* Rich champagne gradient rising from the very bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full"
        style={{
          background:
            "linear-gradient(to top, rgba(184,149,106,0.38) 0%, rgba(184,149,106,0.18) 40%, rgba(184,149,106,0.05) 75%, transparent 100%)",
        }}
      />
      {/* Dual ambient light blooms in lower corners */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 -z-10 h-80 w-[45rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(184,149,106,0.42) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-28 -z-10 h-80 w-[45rem] rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(51,72,47,0.35) 0%, transparent 70%)",
        }}
      />
      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label={siteConfig.name}
            >
              <Image
                src="/images/logo.png"
                alt=""
                width={56}
                height={56}
                className="size-14 object-contain"
              />
              <span className="font-display text-lg font-semibold tracking-tight">
                Donna Maria
                <span className="block text-[0.65rem] font-medium tracking-[0.2em] uppercase opacity-70">
                  Suite &amp; Relax
                </span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm text-pretty">
              {siteConfig.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-display text-sm font-semibold tracking-tight">Le Camere</p>
            <nav className="flex flex-col gap-2">
              {rooms.map((room) => (
                <Link
                  key={room.slug}
                  href={`/camere/${room.slug}`}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {room.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-display text-sm font-semibold tracking-tight">Esplora</p>
            <nav className="flex flex-col gap-2">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-display text-sm font-semibold tracking-tight">Contatti</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Via+Tenente+Paolo+de+Vivo+10+83028+Serino+AV"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-start gap-2 transition-colors"
              >
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.postalCode} {siteConfig.address.city} (
                  {siteConfig.address.province})
                </span>
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>

        <div className="border-border/60 mt-12 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            © {year} {siteConfig.name}. Tutti i diritti riservati.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
