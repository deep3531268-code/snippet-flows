import * as React from "react";
import { ArrowUpRight, FileCode2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DashboardBadge,
  DashboardButton,
  DashboardCard,
  SectionHeader,
} from "@/features/dashboard/ui";
import {
  dashboardColors,
  dashboardRadius,
  dashboardTypography,
} from "@/features/dashboard/theme";

function ContinueWorking({
  className,
}: {
  className?: string;
}) {
  return (
    <DashboardCard className={cn("flex flex-col gap-5", className)}>
      <SectionHeader
        title="Continue Working"
        description="Your most recent snippet"
        action={
          <DashboardButton variant="secondary" size="sm">
            Open
            <ArrowUpRight aria-hidden className="size-3.5" />
          </DashboardButton>
        }
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center",
              dashboardRadius.button,
              "bg-gradient-to-br from-[#2563eb]/25 to-[#2563eb]/5 text-[#7cb3ff]",
            )}
          >
            <FileCode2 aria-hidden className="size-5" />
          </div>
          <div className="grid gap-0.5">
            <p
              className={cn(
                dashboardTypography.body,
                dashboardColors.heading,
                "font-semibold",
              )}
            >
              auth middleware setup
            </p>
            <p className={cn(dashboardTypography.caption, dashboardColors.caption)}>
              Updated 2 hours ago
            </p>
          </div>
        </div>
        <DashboardBadge variant="secondary">TypeScript</DashboardBadge>
      </div>

      <div
        className={cn(
          "overflow-hidden bg-[#0a111c]",
          dashboardRadius.button,
          "ring-1 ring-white/[0.06]",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1.5 border-b px-4 py-2.5",
            "border-b-white/[0.06]",
            "bg-[#0c1420]",
          )}
        >
          <span aria-hidden className="size-2.5 rounded-full bg-[#fb7185]/80" />
          <span aria-hidden className="size-2.5 rounded-full bg-[#fbbf24]/80" />
          <span aria-hidden className="size-2.5 rounded-full bg-[#4ade80]/80" />
          <span
            className={cn(
              "ml-2 font-mono text-xs",
              dashboardColors.caption,
            )}
          >
            middleware.ts
          </span>
        </div>
        <div
          className={cn(
            "px-4 py-4 font-mono text-[13px] leading-relaxed",
            dashboardColors.body,
          )}
        >
          <span className={cn(dashboardColors.primaryText)}>export</span>{" "}
          <span className={cn(dashboardColors.heading)}>async function</span>{" "}
          <span className={cn(dashboardColors.success)}>middleware</span>
          {"("}requests{")"} {"{"}
          <br />
          &nbsp;&nbsp;<span className={cn(dashboardColors.primaryText)}>return</span>{" "}
          await auth.middleware(requests)
          <br />
          {"}"}
        </div>
      </div>
    </DashboardCard>
  );
}

export { ContinueWorking };
