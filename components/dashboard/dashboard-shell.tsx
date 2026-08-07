"use client"

import * as React from "react"

import { useSidebarCollapsed } from "@/features/dashboard/components/navigation/use-sidebar-collapsed"

import { Breadcrumbs } from "./breadcrumbs"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardTopbar } from "./dashboard-topbar"
import type { DashboardUser } from "./dashboard-user-menu"

export type { DashboardUser }

export function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const { collapsed, toggleCollapsed } = useSidebarCollapsed()

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background">
      <DashboardTopbar
        user={user}
        collapsed={collapsed}
        onMenuClick={() => setSidebarOpen(true)}
        onToggleCollapsed={toggleCollapsed}
      />

      <div className="flex min-h-0 flex-1">
        <DashboardSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
        />

        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <div className="mx-auto hidden w-full max-w-6xl items-center px-4 pt-4 sm:px-6 md:flex md:pt-5">
            <Breadcrumbs />
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
