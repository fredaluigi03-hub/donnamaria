import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Vertical-rhythm primitive: consistent section padding site-wide.
 * Pair with `<Container>` for horizontal rhythm:
 *   <Section><Container>...</Container></Section>
 *
 * Deliberately generous (96 → 176px): negative space is what makes editorial
 * layouts read as composed rather than sparse, and it's the cheapest luxury
 * signal there is. The previous 80 → 128px left sections feeling merely
 * un-styled next to the now much larger section headings.
 */
function Section({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="section"
      // `overflow-x-clip`: several layers inside sections bleed past their own
      // box on purpose — the light-bleed behind the room photos, the glow
      // behind headings, the rotated coverflow cards. That spill is the
      // effect; giving the page a horizontal scrollbar is not. Clipping at the
      // section (full viewport width) keeps the bleed visible while stopping
      // it from creating scroll. `clip` not `hidden`: `hidden` would make this
      // a scroll container and break `position: sticky` inside it, and unlike
      // `hidden` it doesn't flatten nested `preserve-3d` children.
      className={cn("overflow-x-clip py-24 md:py-32 lg:py-44", className)}
      {...props}
    />
  );
}

export { Section };
