"use client";

import { useMemo, useState } from "react";

import { LightboxGrid } from "@/components/sections/lightbox-grid";
import { galleryCategories, galleryImages, type GalleryCategory } from "@/config/gallery";
import { cn } from "@/lib/utils";

const filters = ["Tutte", ...galleryCategories] as const;
type Filter = (typeof filters)[number];

/** Filterable photo grid for /galleria — filters are plain buttons (aria-pressed), no Tabs primitive needed. */
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
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filtra la galleria per categoria"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={active === filter}
            onClick={() => setActive(filter)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === filter
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <LightboxGrid images={images} key={active} />
    </div>
  );
}
