import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Vertical-rhythm primitive: consistent section padding site-wide.
 * Pair with `<Container>` for horizontal rhythm:
 *   <Section><Container>...</Container></Section>
 */
function Section({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="section"
      className={cn("py-20 md:py-28 lg:py-32", className)}
      {...props}
    />
  );
}

export { Section };
