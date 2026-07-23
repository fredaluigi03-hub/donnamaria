import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Native `<select>` styled to match `Input`/`Textarea`. A single-field
 * dropdown doesn't warrant pulling in Radix Select — kept lightweight.
 */
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "border-input flex h-10 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3.5 py-2 text-sm shadow-sm transition-[color,box-shadow] outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[3px]",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
  );
}

export { Select };
