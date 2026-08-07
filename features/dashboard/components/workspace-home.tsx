"use client"

import Link from "next/link"
import { FilePlus2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { WorkspaceHeader } from "@/components/dashboard/workspace-header"

import { CollectionsPreview } from "./collections-preview"
import { ContinueWorking, type RecentSnippet } from "./continue-working"
import { HelpfulResources } from "./helpful-resources"
import { QuickActions } from "./quick-actions"
import { RecentActivity } from "./recent-activity"

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function WorkspaceHome({
  name,
  recent,
}: {
  name: string | null
  recent: RecentSnippet[]
}) {
  const firstName = name?.split(" ")[0] ?? "there"

  return (
    <div className="flex w-full flex-col gap-6">
      <WorkspaceHeader
        title={`${greeting()}, ${firstName}`}
        description={
          recent.length === 0
            ? "Your snippet library is empty. Create your first snippet to get started."
            : "Pick up where you left off."
        }
      >
        <Button asChild>
          <Link href="/dashboard/snippets">
            <FilePlus2 data-icon="inline-start" aria-hidden />
            New snippet
          </Link>
        </Button>
      </WorkspaceHeader>

      <QuickActions />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <ContinueWorking snippets={recent} />
        <CollectionsPreview />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <RecentActivity snippets={recent} />
        <HelpfulResources />
      </div>
    </div>
  )
}
