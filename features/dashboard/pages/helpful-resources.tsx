import * as React from "react";
import { ArrowUpRight, BookOpen, Keyboard, PenLine } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DashboardCard,
  SectionHeader,
} from "@/features/dashboard/ui";
import {
  dashboardColors,
  dashboardRadius,
  dashboardTransitions,
  dashboardTypography,
} from "@/features/dashboard/theme";

const RESOURCES = [
  {
    icon: BookOpen,
    label: "Getting started",
    description: "Learn the SnippetFlow basics",
  },
  {
    icon: Keyboard,
    label: "Keyboard shortcuts",
    description: "Move faster with the command palette",
  },
  {
    icon: PenLine,
    label: "Write better snippets",
    description: "Tips for clean, reusable code",
  },
] as const;

function HelpfulResources({
  className,
}: {
  className?: string;
}) {
  return (
    <DashboardCard className={cn("flex flex-col gap-5", className)}>
      <SectionHeader title="Helpful Resources" description="Learn the essentials" />
      <ul className="grid gap-2 sm:grid-cols-3">
        {RESOURCES.map((resource) => (
          <li
            key={resource.label}
            className={cn(
              "group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3",
              dashboardRadius.button,
              dashboardColors.navHover,
              dashboardTransitions.theme,
            )}
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-[10px]",
                "bg-white/[0.04] text-[#7cb3ff] ring-1 ring-white/[0.06]",
                dashboardTransitions.theme,
                "group-hover:bg-[#2563eb]/15 group-hover:text-[#93c5fd]",
              )}
            >
              <resource.icon aria-hidden className="size-4" />
            </div>
            <div className="grid min-w-0 flex-1 gap-0.5">
              <span
                className={cn(
                  "truncate text-sm font-medium",
                  dashboardTypography.body,
                  dashboardColors.body,
                )}
              >
                {resource.label}
              </span>
              <span className={cn("truncate text-xs", dashboardColors.caption)}>
                {resource.description}
              </span>
            </div>
            <ArrowUpRight
              aria-hidden
              className="size-4 shrink-0 text-[#94a3b8] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

export { HelpfulResources };
