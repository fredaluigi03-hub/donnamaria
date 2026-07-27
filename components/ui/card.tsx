import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Every card surface on the site, so the depth language stays in one place.
 *
 * The shadow is the same recipe as the room photos and the coverflow cards: a
 * tight contact shadow that grounds the panel on the page plus a wide, very
 * soft cast underneath it — never one medium `shadow-sm`, which reads as a
 * grey outline rather than as light. The pair is what makes a surface look
 * like it's sitting *above* the page instead of drawn onto it.
 *
 * Both layers are warm (24,20,16 — the ink, not black), because a neutral grey
 * shadow on a warm ivory ground is the single most common thing that makes an
 * otherwise nice palette look cheap.
 *
 * On hover the panel lifts a hair and the cast deepens, so the depth is
 * something the visitor can feel rather than just see. Transform + shadow only,
 * so it stays cheap, and `motion-reduce` drops the lift for anyone who's asked
 * for less movement.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground border-border flex flex-col gap-6 rounded-xl border",
        "shadow-[0_1px_2px_rgba(24,20,16,0.05),0_14px_36px_-18px_rgba(24,20,16,0.22)]",
        // `translate`, not `transform`: Tailwind v4's `-translate-y-*` utilities
        // compile to the standalone `translate` property, so transitioning
        // `transform` here would leave the lift snapping instantly while only
        // the shadow eased.
        "transition-[box-shadow,translate] duration-(--duration-base) ease-(--ease-standard)",
        "hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(24,20,16,0.07),0_26px_54px_-20px_rgba(24,20,16,0.30)]",
        "motion-reduce:hover:translate-y-0",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6 pt-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-lg leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
