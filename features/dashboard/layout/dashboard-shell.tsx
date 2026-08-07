import * as React from "react";

import { cn } from "@/lib/utils";
import { RouteTransition } from "@/features/shared/motion";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";
import { Workspace } from "./workspace";
import {
  dashboardColors,
  dashboardRadius,
  dashboardShadows,
} from "@/features/dashboard/theme";

function DashboardShell({
  sidebar,
  topbar,
  children,
  className,
}: {
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="dashboard-shell"
      className={cn(
        "relative flex h-dvh w-full min-h-0 overflow-hidden p-3 sm:p-5",
        dashboardColors.page,
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_-20%,rgba(37,99,235,0.18),transparent_60%)]"
      />

      <div
        data-slot="dashboard-workspace"
        className={cn(
          "relative flex h-full min-h-0 w-full overflow-hidden border border-white/[0.06]",
          dashboardRadius.workspace,
          dashboardColors.workspaceGlass,
          dashboardShadows.glow,
          dashboardShadows.workspace,
        )}
      >
        {sidebar ?? <DashboardSidebar />}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {topbar ?? <DashboardTopbar />}
          <Workspace>
            <RouteTransition>{children}</RouteTransition>
          </Workspace>
        </div>
      </div>
    </div>
  );
}

export { DashboardShell };
