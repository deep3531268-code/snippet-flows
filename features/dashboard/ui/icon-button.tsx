import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import {
  dashboardFocus,
  dashboardHover,
  dashboardRadius,
} from "@/features/dashboard/theme";

function IconButton({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      type="button"
      data-slot="icon-button"
      className={cn(
        "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center",
        dashboardRadius.button,
        "border border-white/[0.07]",
        "bg-white/[0.03] hover:bg-white/[0.08]",
        "text-[#94a3b8] hover:text-white",
        dashboardHover.surface,
        dashboardFocus.ring,
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export { IconButton };
