import * as React from "react";
import Link from "next/link";
import { FileCode2, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DashboardBadge,
  DashboardButton,
  DashboardCard,
  EmptyState,
  SectionHeader,
} from "@/features/dashboard/ui";
import {
  dashboardColors,
  dashboardRadius,
  dashboardTransitions,
  dashboardTypography,
} from "@/features/dashboard/theme";
import { RelativeTime } from "@/features/shared/components/relative-time";
import {
  SNIPPET_LANGUAGE_LABELS,
  type SnippetLanguage,
} from "@/features/snippets/languages";
import type { DashboardRecentSnippet } from "../types";

function languageLabel(language: string) {
  return SNIPPET_LANGUAGE_LABELS[language as SnippetLanguage] ?? language;
}

function RecentSnippets({
  snippets,
  title = "Recent Snippets",
  description = "Your latest updates",
  empty,
  className,
}: {
  snippets: DashboardRecentSnippet[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  empty?: React.ReactNode;
  className?: string;
}) {
  return (
    <DashboardCard className={cn("flex flex-col gap-5", className)}>
      <SectionHeader
        title={title}
        description={description}
        action={
          <DashboardButton asChild variant="secondary" size="sm">
            <Link href="/dashboard/snippets">View all</Link>
          </DashboardButton>
        }
      />
      {snippets.length === 0 ? (
        empty ?? (
          <EmptyState
            icon={FileCode2}
            title="No snippets yet"
            description="Create your first snippet to see it here."
            className="min-h-[280px] flex-1 border-0 bg-transparent shadow-none"
          />
        )
      ) : (
        <ul className="flex flex-col gap-2">
          {snippets.map((snippet) => (
            <li key={snippet.id}>
              <Link
                href="/dashboard/snippets"
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3",
                  dashboardRadius.button,
                  dashboardColors.navHover,
                  dashboardTransitions.theme,
                )}
              >
                <Star
                  aria-hidden
                  className={cn(
                    "size-4 shrink-0",
                    snippet.isFavorite
                      ? "fill-[#f59e0b] text-[#f59e0b]"
                      : "text-[#5b6b82]",
                  )}
                />
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <span
                    className={cn(
                      "truncate text-sm font-medium",
                      dashboardTypography.body,
                      dashboardColors.body,
                    )}
                  >
                    {snippet.title}
                  </span>
                  <span className={cn(dashboardTypography.caption, dashboardColors.caption)}>
                    <RelativeTime date={snippet.updatedAt} />
                  </span>
                </div>
                {snippet.collections[0] ? (
                  <DashboardBadge variant="secondary">
                    {snippet.collections[0].name}
                  </DashboardBadge>
                ) : null}
                <DashboardBadge variant="secondary">
                  {languageLabel(snippet.language)}
                </DashboardBadge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}

export { RecentSnippets };
