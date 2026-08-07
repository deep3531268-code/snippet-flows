import type { Metadata } from "next"
import Link from "next/link"
import { Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state"
import { WorkspaceHeader } from "@/components/dashboard/workspace-header"
import { WorkspaceSection } from "@/components/dashboard/workspace-section"

export const metadata: Metadata = {
  title: "Recent",
}

export default function RecentPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <WorkspaceHeader
        title="Recent"
        description="Snippets you've viewed or edited recently."
      />

      <WorkspaceSection
        title="Recently updated"
        description="Your most recently modified snippets will appear here."
      >
        <DashboardEmptyState
          icon={Clock}
          title="Nothing here yet"
          description="Snippets you open or edit will show up in this list."
        >
          <Button asChild variant="outline">
            <Link href="/dashboard/snippets">Browse snippets</Link>
          </Button>
        </DashboardEmptyState>
      </WorkspaceSection>
    </div>
  )
}
