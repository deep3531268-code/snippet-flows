import * as React from "react";

import { cn } from "@/lib/utils";
import {
  dashboardColors,
  dashboardTypography,
} from "@/features/dashboard/theme";

function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="section-header"
      className={cn(
        "flex flex-wrap items-start justify-between gap-4",
        className,
      )}
    >
      <div className="grid gap-1">
        <h2 className={cn(dashboardTypography.sectionTitle, dashboardColors.heading)}>
          {title}
        </h2>
        {description ? (
          <p className={cn(dashboardTypography.body, dashboardColors.secondary)}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export { SectionHeader };
