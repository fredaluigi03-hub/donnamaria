import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The one horizontal-rhythm primitive for the whole site. Every section
 * should nest its content in a `<Container>` rather than hand-rolling
 * `max-w-*` + `px-*` classes, so the page grid stays consistent.
 * See docs/Design-System.md#containers-and-grid.
 */
function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full max-w-(--container-2xl) px-6 md:px-10", className)}
      {...props}
    />
  );
}

export { Container };
