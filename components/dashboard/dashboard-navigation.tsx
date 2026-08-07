"use client"

import {
  Archive,
  Clock,
  FileCode2,
  Folder,
  LayoutDashboard,
  Share2,
  Star,
  Tags,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { NavigationItem } from "./navigation-item"

const WORKSPACE_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/snippets", label: "All Snippets", icon: FileCode2 },
  { href: "/dashboard/collections", label: "Collections", icon: Folder },
  { href: "/dashboard/shared", label: "Shared", icon: Share2 },
]

const LIBRARY_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard/favorites", label: "Favorites", icon: Star },
  { href: "/dashboard/recent", label: "Recent", icon: Clock },
  { href: "/dashboard/archived", label: "Archived", icon: Archive },
]

function NavGroup({
  label,
  items,
  collapsed,
}: {
  label: string
  items: { href: string; label: string; icon: LucideIcon }[]
  collapsed: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {!collapsed && (
        <p className="px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
          {label}
        </p>
      )}
      {items.map((item) => (
        <NavigationItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          collapsed={collapsed}
        >
          {item.label}
        </NavigationItem>
      ))}
    </div>
  )
}

export function DashboardNavigation({ collapsed }: { collapsed: boolean }) {
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Primary">
      <NavGroup label="Workspace" items={WORKSPACE_NAV} collapsed={collapsed} />

      <Separator className={cn("my-2", collapsed && "my-1")} />

      <NavGroup label="Library" items={LIBRARY_NAV} collapsed={collapsed} />

      <Separator className={cn("my-2", collapsed && "my-1")} />

      <NavGroup
        label="Tags"
        collapsed={collapsed}
        items={[{ href: "/dashboard/snippets", label: "All tags", icon: Tags }]}
      />
    </nav>
  )
}
