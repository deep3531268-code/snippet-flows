import * as React from "react";
import { ArrowUpRight, FolderPlus, Import, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DashboardCard,
  SectionContainer,
  SectionHeader,
} from "@/features/dashboard/ui";
import {
  dashboardColors,
  dashboardRadius,
  dashboardTransitions,
  dashboardTypography,
} from "@/features/dashboard/theme";

const ACTIONS = [
  {
    label: "New Snippet",
    description: "Create a snippet from scratch",
    icon: Plus,
    tile: "bg-[#2563eb]/15 text-[#7cb3ff] ring-1 ring-[#2563eb]/30",
    shadow: "group-hover:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.55)]",
  },
  {
    label: "New Collection",
    description: "Group snippets into a collection",
    icon: FolderPlus,
    tile: "bg-[#10b981]/15 text-[#6ee7b7] ring-1 ring-[#10b981]/30",
    shadow: "group-hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)]",
  },
  {
    label: "Import Snippets",
    description: "Bring in snippets from elsewhere",
    icon: Import,
    tile: "bg-[#8b5cf6]/15 text-[#c4b5fd] ring-1 ring-[#8b5cf6]/30",
    shadow: "group-hover:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)]",
  },
] as const;

function QuickActions({
  className,
}: {
  className?: string;
}) {
  return (
    <SectionContainer className={className}>
      <SectionHeader
        title="Quick Actions"
        description="Start something new"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {ACTIONS.map((action) => (
          <DashboardCard
            key={action.label}
            interactive
            className={cn(
              "group flex cursor-pointer flex-col gap-5 p-6",
              action.shadow,
            )}
          >
            <div
              className={cn(
                "flex size-12 items-center justify-center",
                dashboardRadius.button,
                dashboardTransitions.base,
                "group-hover:scale-110",
                action.tile,
              )}
            >
              <action.icon aria-hidden className="size-6" />
            </div>
            <div className="grid gap-1">
              <p
                className={cn(
                  dashboardTypography.sectionTitle,
                  dashboardColors.heading,
                )}
              >
                {action.label}
              </p>
              <p className={cn(dashboardTypography.body, dashboardColors.secondary)}>
                {action.description}
              </p>
            </div>
            <span
              aria-hidden
              className={cn(
                "mt-auto inline-flex items-center gap-1.5 text-sm font-medium",
                dashboardColors.primaryText,
                dashboardTransitions.base,
                "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100",
              )}
            >
              Open
              <ArrowUpRight className="size-4" />
            </span>
          </DashboardCard>
        ))}
      </div>
    </SectionContainer>
  );
}

export { QuickActions };
