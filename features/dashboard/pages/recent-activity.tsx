import * as React from "react";
import { FilePlus2, FolderPlus, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DashboardCard,
  SectionHeader,
} from "@/features/dashboard/ui";
import {
  dashboardColors,
  dashboardRadius,
  dashboardTypography,
} from "@/features/dashboard/theme";

const ACTIVITY = [
  {
    icon: FilePlus2,
    text: "Created snippet 'rate limiter'",
    time: "2h ago",
    iconClass: "bg-[#2563eb]/15 text-[#7cb3ff] ring-1 ring-[#2563eb]/25",
  },
  {
    icon: FolderPlus,
    text: "Added snippet to 'Backend'",
    time: "5h ago",
    iconClass: "bg-[#10b981]/15 text-[#6ee7b7] ring-1 ring-[#10b981]/25",
  },
  {
    icon: Tag,
    text: "Tagged snippet with 'typescript'",
    time: "1d ago",
    iconClass: "bg-[#8b5cf6]/15 text-[#c4b5fd] ring-1 ring-[#8b5cf6]/25",
  },
] as const;

function RecentActivity({
  className,
}: {
  className?: string;
}) {
  return (
    <DashboardCard className={cn("flex flex-col gap-5", className)}>
      <SectionHeader title="Recent Activity" description="What you've been up to" />
      <ul className="relative flex flex-col">
        <span
          aria-hidden
          className="absolute top-3 bottom-3 left-[15px] w-px bg-white/[0.07]"
        />
        {ACTIVITY.map((item) => (
          <li
            key={item.text}
            className="relative flex items-center gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center",
                dashboardRadius.button,
                item.iconClass,
              )}
            >
              <item.icon
                aria-hidden
                className="size-4"
              />
            </div>
            <div className="grid min-w-0 flex-1 gap-0.5">
              <p
                className={cn(
                  dashboardTypography.body,
                  dashboardColors.body,
                  "truncate font-medium",
                )}
              >
                {item.text}
              </p>
              <p className={cn(dashboardTypography.caption, dashboardColors.caption)}>
                {item.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

export { RecentActivity };
