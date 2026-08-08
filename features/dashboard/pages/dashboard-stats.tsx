import * as React from "react";
import { FileCode2, Folder, Star, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import { DashboardCard } from "@/features/dashboard/ui";
import {
  dashboardColors,
  dashboardRadius,
  dashboardTransitions,
  dashboardTypography,
} from "@/features/dashboard/theme";
import type { DashboardStats as DashboardStatsData } from "../types";

const STAT_CARDS = [
  {
    key: "total",
    label: "Snippets",
    icon: FileCode2,
    tile: "bg-[#2563eb]/15 text-[#7cb3ff] ring-1 ring-[#2563eb]/30",
  },
  {
    key: "collections",
    label: "Collections",
    icon: Folder,
    tile: "bg-[#10b981]/15 text-[#6ee7b7] ring-1 ring-[#10b981]/30",
  },
  {
    key: "tags",
    label: "Tags",
    icon: Tag,
    tile: "bg-[#8b5cf6]/15 text-[#c4b5fd] ring-1 ring-[#8b5cf6]/30",
  },
  {
    key: "favorites",
    label: "Favorites",
    icon: Star,
    tile: "bg-[#f59e0b]/15 text-[#fcd34d] ring-1 ring-[#f59e0b]/30",
  },
] as const;

function DashboardStats({
  stats,
  className,
}: {
  stats: DashboardStatsData;
  className?: string;
}) {
  return (
    <div
      data-slot="dashboard-stats"
      className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}
    >
      {STAT_CARDS.map(({ key, label, icon: Icon, tile }) => (
        <DashboardCard
          key={key}
          interactive
          className="group flex items-center gap-4"
        >
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center",
              dashboardRadius.button,
              dashboardTransitions.base,
              "group-hover:scale-105",
              tile,
            )}
          >
            <Icon aria-hidden className="size-5" />
          </div>
          <div className="grid min-w-0 gap-0.5">
            <p
              className={cn(
                "text-2xl font-semibold tracking-tight",
                dashboardColors.heading,
              )}
            >
              {stats[key].toLocaleString()}
            </p>
            <p className={cn(dashboardTypography.caption, dashboardColors.caption)}>
              {label}
            </p>
          </div>
        </DashboardCard>
      ))}
    </div>
  );
}

export { DashboardStats };
