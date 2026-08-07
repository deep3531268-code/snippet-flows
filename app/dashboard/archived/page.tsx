import type { Metadata } from "next"
import Link from "next/link"
import { Archive } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state"
import { WorkspaceHeader } from "@/components/dashboard/workspace-header"

export const metadata: Metadata = {
  title: "Archived",
}

export default function ArchivedPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <WorkspaceHeader
        title="Archived"
        description="Snippets stored out of the way but still available."
      />

      <DashboardEmptyState
        icon={Archive}
        title="No archived snippets"
        description="Archived snippets will appear here, ready to restore."
      >
        <Button asChild variant="outline">
          <Link href="/dashboard/snippets">Browse snippets</Link>
        </Button>
      </DashboardEmptyState>
    </div>
  )
}
