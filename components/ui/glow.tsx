import { cn } from "@/lib/utils";

export interface GlowProps {
  /**
   * Tailwind background class for the wide outer layer — pass a per-room
   * accent (`bg-room-suite`, `bg-room-domi`, `bg-room-mery`) to tint it.
   * Defaults to the champagne brand accent.
   */
  accentClass?: string;
  /**
   * Softer preset for grids. One glowing panel is a focal point; twelve of
   * them at full strength turn a section into haze, so cards use this.
   */
  subtle?: boolean;
  className?: string;
}

/**
 * The two-layer light bleed used behind panels across the site.
 *
 * Why two layers rather than one: a single coloured blur reads as a smudge
 * sitting behind the card. A wide soft wash *plus* a tighter halo hugging the
 * panel's edge reads as a light with a source — the near layer is the falloff
 * you'd actually see where an object meets a lit surface. Same reasoning as
 * the layered shadows on Card and Button: depth comes from two distances, not
 * from one stronger effect.
 *
 * Requires a `relative` (or otherwise positioned) parent, and sits at `-z-10`
 * so it stays behind the panel's own opaque surface and only shows as spill
 * around the edges. `aria-hidden`: it's light, never content.
 */
function Glow({ accentClass = "bg-gold", subtle = false, className }: GlowProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] blur-3xl",
          subtle ? "opacity-30" : "opacity-45",
          accentClass,
          className,
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "bg-gold pointer-events-none absolute -inset-2 -z-10 rounded-3xl blur-xl",
          subtle ? "opacity-20" : "opacity-30",
        )}
      />
    </>
  );
}

export { Glow };
