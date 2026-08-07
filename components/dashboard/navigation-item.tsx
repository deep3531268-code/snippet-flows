"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function NavigationItem({
  href,
  icon: Icon,
  children,
  collapsed = false,
}: {
  href: string
  icon: LucideIcon
  children: React.ReactNode
  collapsed?: boolean
}) {
  const pathname = usePathname()
  const isActive =
    href === "/dashboard" ? pathname === href : pathname.startsWith(href)

  const item = (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex h-8 items-center gap-2.5 rounded-md text-[13px] transition-colors duration-150 motion-reduce:transition-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        collapsed ? "justify-center px-0" : "px-3",
        isActive
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {isActive ? (
        <span
          className={cn(
            "absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary",
            collapsed ? "left-0" : "left-0.5",
          )}
          aria-hidden
        />
      ) : null}
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors duration-150 motion-reduce:transition-none",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
        aria-hidden
      />
      {!collapsed && children}
    </Link>
  )

  if (!collapsed) return item

  return (
    <Tooltip>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {children}
      </TooltipContent>
    </Tooltip>
  )
}
