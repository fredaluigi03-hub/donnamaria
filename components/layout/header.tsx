"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { mainNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { rooms } from "@/config/rooms";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useClickOutside } from "@/hooks/use-click-outside";

// Everything the "Camere" dropdown surfaces besides the rooms themselves —
// quick access to the rest of the site without leaving the menu, per
// explicit request rather than making the visitor drill into /camere first.
const roomsMenuExtraLinks = [
  { label: "La Struttura", href: "/la-struttura" },
  { label: "Galleria", href: "/galleria" },
  { label: "Contatti", href: "/contatti" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [roomsMenuOpen, setRoomsMenuOpen] = useState(false);
  const roomsMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !open;

  useClickOutside(roomsMenuRef, () => setRoomsMenuOpen(false), roomsMenuOpen);

  // Small delay before closing on mouseleave — moving the cursor diagonally
  // from the trigger down into the panel would otherwise clip the trigger's
  // hover area and close it before the pointer ever reaches the panel.
  function openRoomsMenu() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setRoomsMenuOpen(true);
  }
  function scheduleCloseRoomsMenu() {
    closeTimeoutRef.current = setTimeout(() => setRoomsMenuOpen(false), 150);
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      // `initial` must stay independent of `useReducedMotion()` — that hook
      // resolves differently between the server render and the client's
      // first paint, and changing `initial` (unlike `transition`) changes
      // the SSR-emitted style attribute, which causes a hydration mismatch.
      // Reduced motion is instead honored via a zero duration/delay below.
      initial={isHome ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.8,
        delay: isHome && !shouldReduceMotion ? 0.3 : 0,
        ease: "easeOut",
      }}
      className={cn(
        "sticky top-0 z-30 border-b transition-colors duration-300",
        transparent
          ? "border-transparent bg-transparent"
          : "border-border/60 bg-background/80 backdrop-blur-md",
      )}
    >
      <Container className="flex h-20 items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
          aria-label={siteConfig.name}
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={48}
            height={48}
            priority
            className="size-11 shrink-0 object-contain md:size-12"
          />
          <span
            className={cn(
              "font-display text-lg leading-tight font-semibold tracking-tight transition-colors",
              transparent ? "text-white" : "text-foreground",
            )}
          >
            Donna Maria
            <span className="block text-[0.65rem] font-medium tracking-[0.2em] uppercase opacity-80">
              Suite &amp; Relax
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {mainNav.map((item) =>
            item.href === "/camere" ? (
              <div
                key={item.href}
                ref={roomsMenuRef}
                className="relative"
                onMouseEnter={openRoomsMenu}
                onMouseLeave={scheduleCloseRoomsMenu}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors",
                    transparent
                      ? "text-white/90 hover:text-white"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setRoomsMenuOpen(false)}
                  aria-haspopup="true"
                  aria-expanded={roomsMenuOpen}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform",
                      roomsMenuOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </Link>

                <div
                  className={cn(
                    "border-border bg-background absolute top-full left-1/2 z-40 mt-3 w-64 -translate-x-1/2 rounded-lg border p-2 shadow-lg transition-all duration-150",
                    roomsMenuOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-1 opacity-0",
                  )}
                  role="menu"
                >
                  <p className="text-muted-foreground px-3 pt-1.5 pb-1 text-xs font-medium tracking-wide uppercase">
                    Le Camere
                  </p>
                  {rooms.map((room) => (
                    <Link
                      key={room.slug}
                      href={`/camere/${room.slug}`}
                      role="menuitem"
                      className="text-foreground hover:bg-secondary block rounded-md px-3 py-2 text-sm font-medium transition-colors"
                      onClick={() => setRoomsMenuOpen(false)}
                    >
                      {room.name}
                    </Link>
                  ))}
                  <div className="border-border my-2 border-t" />
                  {roomsMenuExtraLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className="text-muted-foreground hover:bg-secondary hover:text-foreground block rounded-md px-3 py-2 text-sm transition-colors"
                      onClick={() => setRoomsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  transparent
                    ? "text-white/90 hover:text-white"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle transparent={transparent} />
          <Button asChild variant={transparent ? "secondary" : "default"}>
            <Link href="/contatti#richiedi-disponibilita">Prenota Ora</Link>
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center rounded-md p-2 md:hidden",
            transparent ? "text-white" : "text-foreground",
          )}
          aria-label={open ? "Chiudi il menu" : "Apri il menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </Container>

      <div
        id="mobile-nav"
        className={cn(
          "bg-background text-foreground grid overflow-hidden transition-[grid-template-rows] duration-300 ease-(--ease-standard) md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <Container className="flex flex-col gap-1 pb-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground rounded-md px-2 py-2.5 text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-2">
              <ThemeToggle />
              <Button asChild>
                <Link
                  href="/contatti#richiedi-disponibilita"
                  onClick={() => setOpen(false)}
                >
                  Prenota Ora
                </Link>
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </motion.header>
  );
}
