import Image from "next/image";

/**
 * Faint, near-native-resolution logo watermark for a page section's
 * background. The source file is 388×387px, so it's shown close to that
 * size (object-contain, capped width) instead of stretched to fill the
 * section — which would blur it — and kept faint enough that any softness
 * at the edges is invisible.
 *
 * Parent must be `relative`; place this as the first child, before the
 * content Container, so it sits behind everything (z-0) without affecting
 * layout (absolute, pointer-events-none, decorative).
 */
export function LogoWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
    >
      <Image
        src="/images/logo.png"
        alt=""
        width={388}
        height={387}
        priority
        className="w-full max-w-md opacity-[0.05] grayscale sm:max-w-lg"
      />
    </div>
  );
}
