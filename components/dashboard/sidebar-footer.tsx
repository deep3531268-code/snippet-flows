"use client"

import { Settings, User as UserIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"

import { LogoutButton } from "./logout-button"
import { NavigationItem } from "./navigation-item"

export function SidebarFooter({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div
      className={collapsed ? "shrink-0 border-t border-border p-1.5" : "shrink-0 border-t border-border p-3"}
    >
      <div className="flex flex-col gap-0.5">
        <NavigationItem href="/dashboard/settings" icon={Settings} collapsed={collapsed}>
          Settings
        </NavigationItem>
        <NavigationItem href="/dashboard/profile" icon={UserIcon} collapsed={collapsed}>
          Profile
        </NavigationItem>
        <Separator className={collapsed ? "my-1" : "my-2"} />
        <LogoutButton collapsed={collapsed} />
      </div>
    </div>
  )
}
