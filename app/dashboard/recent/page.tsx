import type { Metadata } from "next"
import Link from "next/link"
import { Eye, History, PencilLine } from "lucide-react"

import { DashboardBadge, DashboardButton } from "@/features/dashboard/ui"
import { WorkspaceHeader } from "@/components/dashboard/workspace-header"
import { RecentSnippets } from "@/features/dashboard/pages/recent-snippets"
import { getRecentPageData } from "@/features/dashboard/actions"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Recent",
}

const MAX_VISIBLE = 5

function RecentEmptyState({
  icon: Icon,
  message,
}: {
  icon: typeof Eye
  message: string
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        "rounded-[12px] border border-white/[0.05]",
        "bg-[#0f1826]/40 px-4 py-3",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-white/[0.05] text-[#7d8ba3]">
          <Icon aria-hidden className="size-3.5" />
        </span>
        <p className="text-sm text-[#94a3b8]">{message}</p>
      </div>
      <DashboardButton asChild variant="secondary" size="sm">
        <Link href="/dashboard/snippets">Browse snippets</Link>
      </DashboardButton>
    </div>
  )
}

export default async function RecentPage() {
  const data = await getRecentPageData()

  const viewed = data.viewed.slice(0, MAX_VISIBLE)
  const edited = data.edited.slice(0, MAX_VISIBLE)
  const totalRecent = data.viewed.length + data.edited.length

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <WorkspaceHeader
        title="Recent"
        description="Your recently viewed and edited snippets"
      >
        <DashboardBadge variant="secondary" className="gap-1.5">
          <History aria-hidden className="size-3" />
          {totalRecent} recent
        </DashboardBadge>
      </WorkspaceHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentSnippets
          title="Recently Viewed"
          description="Snippets you opened most recently"
          snippets={viewed}
          empty={
            <RecentEmptyState
              icon={Eye}
              message="No recently viewed snippets"
            />
          }
        />
        <RecentSnippets
          title="Recently Edited"
          description="Snippets you created or edited most recently"
          snippets={edited}
          empty={
            <RecentEmptyState
              icon={PencilLine}
              message="No recently edited snippets"
            />
          }
        />
      </div>
    </div>
  )
}
