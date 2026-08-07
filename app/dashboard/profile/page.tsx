import type { Metadata } from "next"
import Link from "next/link"
import { User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state"
import { WorkspaceHeader } from "@/components/dashboard/workspace-header"

export const metadata: Metadata = {
  title: "Profile",
}

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <WorkspaceHeader
        title="Profile"
        description="Manage your public profile and preferences."
      />

      <DashboardEmptyState
        icon={User}
        title="Profile settings coming soon"
        description="Your account details are managed by your authentication provider."
      >
        <Button asChild variant="outline">
          <Link href="/dashboard/settings">Open settings</Link>
        </Button>
      </DashboardEmptyState>
    </div>
  )
}
