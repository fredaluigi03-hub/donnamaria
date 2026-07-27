/**
 * Site-wide atmospheric ground: two very slowly drifting light blooms plus a
 * fine grain veil, fixed behind all content.
 *
 * Why this exists: a single flat `--background` fill is what made the pages
 * below the cinematic Hero read as *empty* rather than *composed* — with
 * oversized type and generous spacing, the leftover area has to be worth
 * looking at, and a dead uniform ivory isn't. This gives the ground depth and
 * a slow sense of life without putting photography behind photography (which
 * would fight the room images and force a heavy legibility scrim).
 *
 * Deliberately cheap: two blurred radial gradients and an inline SVG noise
 * data-URI. No WebGL, no image requests, no scroll listeners — the drift is
 * pure CSS `transform` on the compositor, and `prefers-reduced-motion` is
 * already neutralized by the global backstop in app/globals.css.
 *
 * `aria-hidden` + `pointer-events-none`: it's texture, never content.
 */

// feTurbulence grain, inlined as a data URI so it costs no network request.
// Encoded (not raw) because `#` in the markup would otherwise terminate the
// CSS url() early.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

function AmbientBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Warm champagne bloom, upper right — echoes the golden-hour footage. */}
      <div
        className="absolute -top-[20%] -right-[10%] h-[70vh] w-[70vw] rounded-full opacity-[0.5] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(184,149,106,0.30) 0%, rgba(184,149,106,0.10) 45%, transparent 72%)",
          animation: "ambient-drift-a 34s ease-in-out infinite",
        }}
      />
      {/* Cool water bloom, lower left — the only cool note in the palette, kept
          faint so it reads as reflected pool light rather than a second brand
          color competing with the champagne accent. */}
      <div
        className="absolute -bottom-[25%] -left-[15%] h-[75vh] w-[75vw] rounded-full opacity-[0.45] blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(120,164,178,0.26) 0%, rgba(120,164,178,0.09) 48%, transparent 74%)",
          animation: "ambient-drift-b 46s ease-in-out infinite",
        }}
      />
      {/* Grain veil — the thing that stops large flat areas looking digital.
          Kept under 4% so it never reads as noise on its own. */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat" }}
      />
    </div>
  );
}

export { AmbientBackdrop };
