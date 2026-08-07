"use client"

import Link from "next/link"
import { PanelLeft, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

import { DashboardSearch } from "./dashboard-search"
import { DashboardUserMenu, type DashboardUser } from "./dashboard-user-menu"

export function DashboardTopbar({
  user,
  collapsed,
  onMenuClick,
  onToggleCollapsed,
}: {
  user: DashboardUser
  collapsed: boolean
  onMenuClick: () => void
  onToggleCollapsed: () => void
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sm:px-5 md:gap-3">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <PanelLeft className="size-4" aria-hidden />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        className="hidden md:inline-flex"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-pressed={collapsed}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-4" aria-hidden />
        ) : (
          <PanelLeftClose className="size-4" aria-hidden />
        )}
      </Button>

      <DashboardSearch />

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {/* TODO(D2): Replace with the real snippet creation flow. Temporary link to the snippets page. */}
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/dashboard/snippets">
            <Plus className="size-4" aria-hidden />
            New Snippet
          </Link>
        </Button>
        <ThemeToggle />
        <DashboardUserMenu user={user} />
      </div>
    </header>
  )
}
