import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  dashboardColors,
  dashboardRadius,
} from "@/features/dashboard/theme";

const dashboardBadgeVariants = cva(
  cn(
    "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1",
    "px-2 text-xs font-medium whitespace-nowrap",
    dashboardRadius.badge,
  ),
  {
    variants: {
      variant: {
        default: cn(dashboardColors.primary),
        secondary: cn(
          "bg-white/[0.06] text-[#c3cddd] ring-1 ring-white/[0.06]",
        ),
        outline: cn("border border-white/[0.08] text-[#e8edf5]"),
        success: cn(
          dashboardColors.success,
          "bg-[#4ade80]/10",
        ),
        warning: cn(
          dashboardColors.warning,
          "bg-[#fbbf24]/10",
        ),
        error: cn(
          dashboardColors.error,
          "bg-[#fb7185]/10",
        ),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function DashboardBadge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof dashboardBadgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="dashboard-badge"
      data-variant={variant}
      className={cn(dashboardBadgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { DashboardBadge, dashboardBadgeVariants };
