import * as React from "react";

import { cn } from "@/lib/utils";
import {
  dashboardBorders,
  dashboardColors,
  dashboardRadius,
  dashboardShadows,
  dashboardTypography,
} from "@/features/dashboard/theme";

function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-5 px-8 py-16 text-center",
        dashboardRadius.card,
        dashboardBorders.subtleMuted,
        "bg-[#0f1826]/40 backdrop-blur-sm",
        dashboardShadows.soft,
        className,
      )}
    >
      {Icon ? (
        <div
          className={cn(
            "flex size-16 items-center justify-center",
            dashboardRadius.button,
            dashboardColors.primarySoft,
            "ring-1 ring-[#2563eb]/20",
          )}
        >
          <Icon aria-hidden className="size-7" />
        </div>
      ) : null}
      <div className="grid gap-1.5">
        <p className={cn(dashboardTypography.sectionTitle, dashboardColors.heading)}>
          {title}
        </p>
        {description ? (
          <p className={cn(dashboardTypography.body, dashboardColors.secondary)}>
            {description}
          </p>
        ) : null}
      </div>
      {children ? (
        <div className="mt-2 flex items-center justify-center gap-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export { EmptyState };
