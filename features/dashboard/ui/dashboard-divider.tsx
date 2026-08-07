import * as React from "react";

import { cn } from "@/lib/utils";

function DashboardDivider({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      data-slot="dashboard-divider"
      className={cn("h-px w-full bg-white/[0.07]", className)}
      {...props}
    />
  );
}

export { DashboardDivider };
