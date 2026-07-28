"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HERO_FOOTAGE_END_VH } from "@/components/sections/hero";
import { mainNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { rooms } from "@/config/rooms";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";

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
  const [pastHeroFootage, setPastHeroFootage] = useState(false);
  const [roomsMenuOpen, setRoomsMenuOpen] = useState(false);
  const roomsMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const mounted = useMounted();

  const isHome = pathname === "/";

  // While the homepage hero is playing its scroll-scrubbed footage, the header
  // shows the wordmark and nothing else — the nav and the booking button fade
  // out so the film owns the screen, then come back once the sequence lands.
  // Mirrors the Hero's own conditions: the scrub only exists on a mounted,
  // non-mobile, motion-allowing client, and `mounted` also keeps the server
  // render and the first paint identical (both "not immersive").
  const heroFootagePlaying =
    isHome && mounted && !shouldReduceMotion && !isMobile && !open && !pastHeroFootage;

  // Chrome stays off for the whole of the footage, not just the first 80px.
  // Without the `heroFootagePlaying` term the header picked up its ivory
  // background, blur and bottom border as soon as the visitor started
  // scrolling — laying an opaque white bar across the top of a full-bleed
  // film that is supposed to own the screen. Nothing is scrolling *under* the
  // header during the pin anyway (the hero is fixed in place), so the bar has
  // nothing to separate and no reason to be there.
  const transparent = isHome && !open && (!scrolled || heroFootagePlaying);

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
      // The threshold is the moment the footage *stops*, not the moment the
      // hero unpins — the hero holds its last frame for a while after the film
      // ends, and waiting for the unpin left the nav missing for a few hundred
      // pixels of finished, motionless picture. Imported rather than hardcoded
      // so retiming the scrub keeps the nav and the hero copy in step.
      setPastHeroFootage(
        window.scrollY >= (HERO_FOOTAGE_END_VH / 100) * window.innerHeight,
      );
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When scrolled, navigation links appear inside a horizontal translucent glass bar over the video/sections
  const showNav = !heroFootagePlaying || scrolled;

  return (
    <motion.header
      initial={isHome ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.8,
        delay: isHome && !shouldReduceMotion ? 0.3 : 0,
        ease: "easeOut",
      }}
      className={cn(
        "fixed inset-x-0 top-0 z-40 py-3 transition-all duration-500",
        transparent ? "border-transparent bg-transparent" : "bg-transparent",
      )}
    >
      <Container className="flex items-center justify-between">
        <div
          className={cn(
            "flex w-full items-center justify-between p-3.5 transition-all duration-500 md:px-6 md:py-3",
            scrolled
              ? "border-gold/40 shadow-gold/15 rounded-2xl border bg-gradient-to-r from-white/95 via-amber-50/90 to-white/95 text-neutral-950 shadow-xl backdrop-blur-xl md:rounded-full"
              : "bg-transparent text-white",
          )}
        >
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
              className="size-10 shrink-0 object-contain md:size-11"
            />
            <span
              className={cn(
                "font-display text-lg leading-tight font-semibold tracking-tight transition-colors",
                scrolled
                  ? "text-neutral-950"
                  : transparent
                    ? "text-white"
                    : "text-foreground",
              )}
            >
              Donna Maria
              <span className="block text-[0.65rem] font-medium tracking-[0.2em] uppercase opacity-80">
                Suite &amp; Relax
              </span>
            </span>
          </Link>

          <nav
            className={cn(
              "hidden items-center gap-8 transition-all duration-500 md:flex",
              showNav ? "visible opacity-100" : "invisible opacity-0",
            )}
          >
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
                      scrolled
                        ? "hover:text-gold text-neutral-900"
                        : transparent
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
                      "border-gold/30 bg-card/95 text-foreground absolute top-full left-1/2 z-50 mt-3 w-64 -translate-x-1/2 rounded-xl border p-2 shadow-2xl backdrop-blur-xl transition-all duration-150",
                      roomsMenuOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-1 opacity-0",
                    )}
                    role="menu"
                  >
                    <p className="text-gold px-3 pt-1.5 pb-1 text-xs font-medium tracking-wide uppercase">
                      Le Camere
                    </p>
                    {rooms.map((room) => (
                      <Link
                        key={room.slug}
                        href={`/camere/${room.slug}`}
                        role="menuitem"
                        className="text-foreground hover:bg-gold/10 hover:text-gold block rounded-md px-3 py-2 text-sm font-medium transition-colors"
                        onClick={() => setRoomsMenuOpen(false)}
                      >
                        {room.name}
                      </Link>
                    ))}
                    <div className="border-border/60 my-2 border-t" />
                    {roomsMenuExtraLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        role="menuitem"
                        className="text-muted-foreground hover:bg-gold/10 hover:text-gold block rounded-md px-3 py-2 text-sm transition-colors"
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
                    scrolled
                      ? "hover:text-gold text-neutral-900"
                      : transparent
                        ? "text-white/90 hover:text-white"
                        : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div
            className={cn(
              "hidden items-center gap-2 transition-all duration-500 md:flex",
              showNav ? "visible opacity-100" : "invisible opacity-0",
            )}
          >
            <Button
              asChild
              className={cn(
                "rounded-full px-6 transition-all",
                scrolled
                  ? "bg-white text-black shadow-md hover:bg-white/90"
                  : "bg-white/90 text-black hover:bg-white",
              )}
            >
              <Link href="/contatti#richiedi-disponibilita">Prenota Ora</Link>
            </Button>
          </div>

          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-md p-2 md:hidden",
              scrolled || transparent ? "text-white" : "text-foreground",
            )}
            aria-label={open ? "Chiudi il menu" : "Apri il menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
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
            <div className="pt-2">
              <Button asChild className="w-full">
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
