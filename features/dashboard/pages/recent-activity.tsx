import * as React from "react";
import Link from "next/link";
import { Activity, FilePlus2, FolderPlus, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DashboardCard,
  EmptyState,
  SectionHeader,
} from "@/features/dashboard/ui";
import {
  dashboardColors,
  dashboardRadius,
  dashboardTypography,
} from "@/features/dashboard/theme";
import { RelativeTime } from "@/features/shared/components/relative-time";
import type { DashboardActivityEvent, DashboardActivityKind } from "../types";

const ACTIVITY_KINDS: Record<
  DashboardActivityKind,
  { icon: typeof FilePlus2; iconClass: string }
> = {
  snippet: {
    icon: FilePlus2,
    iconClass: "bg-[#2563eb]/15 text-[#7cb3ff] ring-1 ring-[#2563eb]/25",
  },
  collection: {
    icon: FolderPlus,
    iconClass: "bg-[#10b981]/15 text-[#6ee7b7] ring-1 ring-[#10b981]/25",
  },
  tag: {
    icon: Tag,
    iconClass: "bg-[#8b5cf6]/15 text-[#c4b5fd] ring-1 ring-[#8b5cf6]/25",
  },
};

function RecentActivity({
  activity,
  className,
}: {
  activity: DashboardActivityEvent[];
  className?: string;
}) {
  return (
    <DashboardCard className={cn("flex flex-col gap-5", className)}>
      <SectionHeader title="Recent Activity" description="What you've been up to" />
      {activity.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Your recent changes to snippets, collections, and tags will appear here."
          className="min-h-[280px] flex-1 border-0 bg-transparent shadow-none"
        />
      ) : (
        <ul className="relative flex flex-col">
          <span
            aria-hidden
            className="absolute top-3 bottom-3 left-[15px] w-px bg-white/[0.07]"
          />
          {activity.map((item) => {
            const { icon: Icon, iconClass } = ACTIVITY_KINDS[item.kind];
            return (
              <li
                key={item.id}
                className="relative flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div
                  className={cn(
                    "relative z-10 flex size-8 shrink-0 items-center justify-center",
                    dashboardRadius.button,
                    iconClass,
                  )}
                >
                  <Icon aria-hidden className="size-4" />
                </div>
                <div className="grid min-w-0 flex-1 gap-0.5">
                  {item.route ? (
                    <Link
                      href={item.route}
                      className={cn(
                        "truncate font-medium",
                        dashboardTypography.body,
                        dashboardColors.body,
                        "hover:text-[#f3f6fb]",
                      )}
                    >
                      {item.text}
                    </Link>
                  ) : (
                    <p
                      className={cn(
                        dashboardTypography.body,
                        dashboardColors.body,
                        "truncate font-medium",
                      )}
                    >
                      {item.text}
                    </p>
                  )}
                  <p
                    className={cn(
                      dashboardTypography.caption,
                      dashboardColors.caption,
                    )}
                  >
                    <RelativeTime date={item.timestamp} />
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}

export { RecentActivity };
