import type { Metadata } from "next"
import Link from "next/link"
import { Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state"
import { WorkspaceHeader } from "@/components/dashboard/workspace-header"

export const metadata: Metadata = {
  title: "Shared",
}

export default function SharedPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <WorkspaceHeader
        title="Shared"
        description="Snippets you've shared or received from others."
      />

      <DashboardEmptyState
        icon={Share2}
        title="Nothing shared yet"
        description="Share a snippet with a link and it will show up here."
      >
        <Button asChild variant="outline">
          <Link href="/dashboard/snippets">Browse snippets</Link>
        </Button>
      </DashboardEmptyState>
    </div>
  )
}
