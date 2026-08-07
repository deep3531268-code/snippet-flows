import type { Metadata } from "next"
import Link from "next/link"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state"
import { WorkspaceHeader } from "@/components/dashboard/workspace-header"

export const metadata: Metadata = {
  title: "Favorites",
}

export default function FavoritesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <WorkspaceHeader
        title="Favorites"
        description="Snippets you've starred for quick access."
      />

      <DashboardEmptyState
        icon={Star}
        title="No favorite snippets"
        description="Star snippets you use often and they'll show up here."
      >
        <Button asChild variant="outline">
          <Link href="/dashboard/snippets">Browse snippets</Link>
        </Button>
      </DashboardEmptyState>
    </div>
  )
}
