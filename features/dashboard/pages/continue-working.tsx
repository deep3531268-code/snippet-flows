import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, FileCode2 } from "lucide-react";

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
  dashboardTypography,
} from "@/features/dashboard/theme";
import { RelativeTime } from "@/features/shared/components/relative-time";
import {
  SNIPPET_LANGUAGE_LABELS,
  type SnippetLanguage,
} from "@/features/snippets/languages";
import type { DashboardRecentSnippet } from "../types";

const PREVIEW_LINES = 6;

function languageLabel(language: string) {
  return SNIPPET_LANGUAGE_LABELS[language as SnippetLanguage] ?? language;
}

function ContinueWorking({
  snippet,
  action,
  timestamp,
  className,
}: {
  snippet: DashboardRecentSnippet | null;
  action: string | null;
  timestamp: string | null;
  className?: string;
}) {
  return (
    <DashboardCard className={cn("flex flex-col gap-5", className)}>
      <SectionHeader
        title="Continue Working"
        description="Your most recent snippet"
        action={
          <DashboardButton asChild variant="secondary" size="sm">
            <Link href="/dashboard/snippets">
              Open
              <ArrowUpRight aria-hidden className="size-3.5" />
            </Link>
          </DashboardButton>
        }
      />

      {snippet ? (
        <>
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
                  {snippet.title}
                </p>
                <p className={cn(dashboardTypography.caption, dashboardColors.caption)}>
                  {action ?? "Updated"}{" "}
                  <RelativeTime date={timestamp ?? snippet.updatedAt} />
                </p>
              </div>
            </div>
            <DashboardBadge variant="secondary">
              {languageLabel(snippet.language)}
            </DashboardBadge>
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
                  "ml-2 truncate font-mono text-xs",
                  dashboardColors.caption,
                )}
              >
                {snippet.title}
              </span>
            </div>
            <pre
              className={cn(
                "overflow-hidden px-4 py-4 font-mono text-[13px] leading-relaxed",
                dashboardColors.body,
              )}
            >
              {snippet.content.split("\n").slice(0, PREVIEW_LINES).join("\n")}
            </pre>
          </div>
        </>
      ) : (
        <EmptyState
          icon={FileCode2}
          title="No snippets yet"
          description="Create your first snippet and it will show up here."
          className="min-h-[280px] flex-1 border-0 bg-transparent shadow-none"
        >
          <DashboardButton asChild size="sm">
            <Link href="/dashboard/snippets">New Snippet</Link>
          </DashboardButton>
        </EmptyState>
      )}
    </DashboardCard>
  );
}

export { ContinueWorking };
