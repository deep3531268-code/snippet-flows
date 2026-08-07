import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { DashboardInput } from "./dashboard-input";
import { dashboardColors } from "@/features/dashboard/theme";

function SearchInput({
  className,
  kbd,
  ...props
}: React.ComponentProps<"input"> & { kbd?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2",
          dashboardColors.secondary,
        )}
      />
      <DashboardInput
        type="search"
        aria-label="Search"
        role="searchbox"
        className="h-11 rounded-[14px] pl-10 pr-12"
        {...props}
      />
      {kbd ? (
        <kbd
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2",
            "flex h-6 min-w-6 items-center justify-center rounded-md px-1.5",
            "bg-white/[0.06] text-[11px] font-medium text-[#94a3b8]",
            "font-sans ring-1 ring-white/[0.07]",
          )}
        >
          {kbd}
        </kbd>
      ) : null}
    </div>
  );
}

export { SearchInput };
