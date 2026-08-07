import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  dashboardColors,
  dashboardFocus,
  dashboardRadius,
  dashboardTransitions,
} from "@/features/dashboard/theme";

const dashboardButtonVariants = cva(
  cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 font-medium whitespace-nowrap select-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    dashboardRadius.button,
    dashboardTransitions.base,
    dashboardFocus.ring,
    "active:scale-[0.98]",
  ),
  {
    variants: {
      variant: {
        primary: cn(
          dashboardColors.primary,
          "shadow-sm hover:shadow-md",
          dashboardColors.primaryHover,
        ),
        secondary: cn(
          "border border-white/[0.08] bg-white/[0.03] text-[#e8edf5]",
          "hover:bg-white/[0.08] hover:text-white",
        ),
        ghost: "bg-transparent hover:bg-white/[0.06] hover:text-white",
        destructive: cn(
          dashboardColors.error,
          "bg-[#fb7185]/10 hover:bg-[#fb7185]/20",
        ),
      },
      size: {
        default: "h-9 px-4 text-sm",
        sm: "h-8 px-3 text-sm",
        lg: "h-10 px-5 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function DashboardButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof dashboardButtonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="dashboard-button"
      data-variant={variant}
      data-size={size}
      className={cn(dashboardButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { DashboardButton, dashboardButtonVariants };
