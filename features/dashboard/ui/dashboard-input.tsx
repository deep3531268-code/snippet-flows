import * as React from "react";

import { cn } from "@/lib/utils";
import {
  dashboardColors,
  dashboardFocus,
  dashboardRadius,
  dashboardTransitions,
} from "@/features/dashboard/theme";

function DashboardInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="dashboard-input"
      className={cn(
        "h-9 w-full min-w-0 border border-white/[0.07] px-3 text-sm",
        dashboardRadius.input,
        "bg-white/[0.04]",
        dashboardColors.body,
        "placeholder:text-[#5b6b82]",
        dashboardTransitions.theme,
        dashboardFocus.ring,
        "hover:bg-white/[0.07] focus-visible:bg-white/[0.06] focus-visible:border-[#2563eb]/60",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&::-webkit-search-cancel-button]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export { DashboardInput };
