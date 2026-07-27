import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  // `rounded-full` is the one button shape for the whole site (see
  // docs/03_DESIGN_SYSTEM.md — "Buttons: Large. Rounded."). Set it once
  // here, not as a per-instance override — every <Button> call site
  // inherits it automatically, sizes only add height/padding/text size.
  // Depth language matches Card and the room photos: a tight contact shadow
  // plus a wide soft warm cast (24,20,16 ink, never neutral grey), a hair of
  // lift on hover and a press back down on :active — so buttons feel like
  // physical controls instead of flat fills. `translate` (not `transform`) in
  // the transition list: Tailwind v4's translate utilities compile to the
  // standalone property, transitioning `transform` would make the lift snap.
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,translate] duration-(--duration-fast) ease-(--ease-standard) outline-none hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(24,20,16,0.12),0_10px_24px_-10px_rgba(24,20,16,0.40)] hover:bg-primary/90 hover:shadow-[0_2px_4px_rgba(24,20,16,0.14),0_16px_32px_-12px_rgba(24,20,16,0.48)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-[0_1px_2px_rgba(24,20,16,0.06),0_8px_20px_-12px_rgba(24,20,16,0.22)] hover:bg-accent hover:text-accent-foreground hover:shadow-[0_2px_4px_rgba(24,20,16,0.08),0_14px_28px_-14px_rgba(24,20,16,0.30)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_1px_2px_rgba(24,20,16,0.06),0_8px_20px_-12px_rgba(24,20,16,0.22)] hover:bg-secondary/80",
        // Ghost and link have no surface to cast a shadow, so the lift is
        // reset — a levitating line of text reads as a glitch, not a control.
        ghost: "hover:bg-accent hover:text-accent-foreground hover:translate-y-0",
        link: "text-primary underline-offset-4 hover:underline hover:translate-y-0",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3.5",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
