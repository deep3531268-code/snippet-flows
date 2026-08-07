import * as React from "react";

import { cn } from "@/lib/utils";
import {
  dashboardBorders,
  dashboardRadius,
  dashboardShadows,
  dashboardTransitions,
} from "@/features/dashboard/theme";

function DashboardCard({
  className,
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      data-slot="dashboard-card"
      className={cn(
        dashboardRadius.card,
        dashboardBorders.subtle,
        "bg-[#0f1826]/60 backdrop-blur-xl text-[#e8edf5]",
        dashboardShadows.soft,
        "p-6",
        interactive &&
          cn(
            dashboardTransitions.base,
            dashboardShadows.hoverElevation,
            "hover:border-white/[0.12]",
          ),
        className,
      )}
      {...props}
    />
  );
}

export { DashboardCard };
