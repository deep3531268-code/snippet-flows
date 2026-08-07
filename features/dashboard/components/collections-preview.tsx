"use client"

import Link from "next/link"
import { Folder } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state"

export function CollectionsPreview() {
  return (
    <section className="grid h-fit gap-3">
      <div className="grid gap-0.5">
        <h2 className="font-heading text-sm font-medium tracking-tight">
          Collections
        </h2>
        <p className="text-sm text-muted-foreground">
          Group related snippets together for fast access.
        </p>
      </div>

      <DashboardEmptyState
        icon={Folder}
        title="No collections yet"
        description="Collections you create will appear here, ready to organize your snippets by project or theme."
      >
        <Button asChild>
          <Link href="/dashboard/collections">Create your first collection</Link>
        </Button>
      </DashboardEmptyState>
    </section>
  )
}
