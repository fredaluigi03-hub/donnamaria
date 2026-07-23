import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface PageHeadingProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  descriptionClassName?: string;
}

/**
 * Standard h1 + intro paragraph used at the top of every interior page
 * (contact, placeholder pages, not-found, error). Extracted because the
 * exact heading/description class pair was duplicated verbatim across
 * those routes — change the look once, here.
 */
function PageHeading({
  title,
  description,
  className,
  descriptionClassName,
}: PageHeadingProps) {
  return (
    <>
      <h1
        className={cn(
          "font-display text-4xl leading-[1.05] font-semibold tracking-tight md:text-5xl",
          className,
        )}
      >
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            "text-muted-foreground mt-4 text-lg font-light",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
    </>
  );
}

export { PageHeading };
