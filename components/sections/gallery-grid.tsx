"use client";

import { useMemo, useState } from "react";

import { LightboxGrid } from "@/components/sections/lightbox-grid";
import { galleryCategories, galleryImages, type GalleryCategory } from "@/config/gallery";
import { cn } from "@/lib/utils";

const filters = ["Tutte", ...galleryCategories] as const;
type Filter = (typeof filters)[number];

/** Filterable photo grid for /galleria — filters are plain buttons (aria-pressed), no Tabs primitive needed. */
import { Sparkles } from "lucide-react";
import { Tilt3D } from "@/components/animations/tilt-3d";

export function GalleryGrid() {
  const [active, setActive] = useState<Filter>("Tutte");

  const images = useMemo(() => {
    if (active === "Tutte") return galleryImages;
    return galleryImages.filter(
      (image) => image.category === (active as GalleryCategory),
    );
  }, [active]);

  return (
    <div className="flex flex-col gap-10">
      <div
        className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
        role="group"
        aria-label="Filtra la galleria per categoria"
      >
        {filters.map((filter) => {
          const isActive = active === filter;
          return (
            <Tilt3D key={filter}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(filter)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider uppercase shadow-md backdrop-blur-md transition-all duration-300",
                  isActive
                    ? "border-gold/60 shadow-gold/25 scale-105 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-amber-100 shadow-lg"
                    : "bg-card/90 text-foreground border-gold/30 hover:border-gold/70 hover:bg-gold/10 hover:shadow-gold/15 border",
                )}
              >
                {isActive && <Sparkles className="text-gold size-3.5" />}
                <span>{filter}</span>
              </button>
            </Tilt3D>
          );
        })}
      </div>

      <LightboxGrid images={images} key={active} />
    </div>
  );
}
