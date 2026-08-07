"use client"

import Link from "next/link"
import { Braces, PanelLeftClose } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/features/dashboard/components/navigation/use-media-query"
import { cn } from "@/lib/utils"

import { DashboardNavigation } from "./dashboard-navigation"
import { SidebarFooter } from "./sidebar-footer"

export function DashboardSidebar({
  open,
  onClose,
  collapsed,
}: {
  open: boolean
  onClose: () => void
  collapsed: boolean
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const isRail = collapsed && isDesktop

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-background/60 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[300px] shrink-0 flex-col border-r border-border bg-background transition-[width,transform] duration-200 ease-out motion-reduce:transition-none md:static md:z-auto md:translate-x-0",
          isRail && "w-[64px]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <TooltipProvider delayDuration={0}>
          <div
            className={cn(
              "flex h-16 shrink-0 items-center border-b border-border",
              isRail ? "justify-center px-0" : "justify-between px-3",
            )}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md transition-opacity duration-150 hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label="SnippetFlow dashboard"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                <Braces className="size-4" aria-hidden />
              </span>
              <span
                className={cn(
                  "font-heading text-sm font-semibold tracking-tight",
                  isRail && "hidden",
                )}
              >
                SnippetFlow
              </span>
            </Link>

            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <PanelLeftClose className="size-4" aria-hidden />
            </Button>
          </div>

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto",
              isRail ? "p-1.5" : "p-3",
            )}
          >
            <DashboardNavigation collapsed={isRail} />
          </div>

          <SidebarFooter collapsed={isRail} />
        </TooltipProvider>
      </aside>
    </>
  )
}
