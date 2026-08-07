"use client"

import Link from "next/link"
import { History, Pencil, Plus } from "lucide-react"

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state"
import { StaggerContainer, StaggerItem } from "@/components/shared/motion"
import {
  formatRelativeTime,
  type RecentSnippet,
} from "./continue-working"

export function RecentActivity({ snippets }: { snippets: RecentSnippet[] }) {
  const events = snippets.map((snippet) => ({
    id: snippet.id,
    title: snippet.title,
    createdAt: new Date(snippet.createdAt).getTime(),
    updatedAt: new Date(snippet.updatedAt).getTime(),
  }))

  return (
    <section className="grid h-fit gap-3">
      <div className="grid gap-0.5">
        <h2 className="font-heading text-sm font-medium tracking-tight">
          Recent activity
        </h2>
        <p className="text-sm text-muted-foreground">
          The latest changes across your library.
        </p>
      </div>

      {events.length === 0 ? (
        <DashboardEmptyState
          icon={History}
          title="No activity yet"
          description="Edits, shares, and imports will show up here."
        />
      ) : (
        <StaggerContainer className="grid gap-2">
          {events.map((event) => {
            const created = event.createdAt === event.updatedAt
            return (
              <StaggerItem key={event.id}>
                <Link
                  href="/dashboard/snippets"
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-foreground/15 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    {created ? (
                      <Plus className="size-4" />
                    ) : (
                      <Pencil className="size-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {created ? "Created" : "Updated"} &ldquo;{event.title}&rdquo;
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(
                        created
                          ? new Date(event.createdAt).toISOString()
                          : new Date(event.updatedAt).toISOString(),
                      )}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      )}
    </section>
  )
}
