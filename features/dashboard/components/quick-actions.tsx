"use client"

import Link from "next/link"
import {
  ArrowRight,
  Clock,
  FilePlus2,
  FileUp,
  FolderPlus,
  LayoutTemplate,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { StaggerContainer, StaggerItem } from "@/components/shared/motion"
import { cn } from "@/lib/utils"

type QuickAction =
  | {
      key: string
      label: string
      description: string
      icon: LucideIcon
      href: string
    }
  | {
      key: string
      label: string
      description: string
      icon: LucideIcon
      comingSoon: string
    }

const QUICK_ACTIONS: QuickAction[] = [
  {
    key: "new",
    label: "New snippet",
    description: "Capture a new piece of code",
    icon: FilePlus2,
    href: "/dashboard/snippets",
  },
  {
    key: "import",
    label: "Import snippets",
    description: "Bring in snippets from a file",
    icon: FileUp,
    comingSoon: "Available in D2.5 – Import",
  },
  {
    key: "templates",
    label: "Browse templates",
    description: "Start from a community template",
    icon: LayoutTemplate,
    comingSoon: "Available in D2.6 – Templates",
  },
  {
    key: "collection",
    label: "Create collection",
    description: "Group snippets by project",
    icon: FolderPlus,
    href: "/dashboard/collections",
  },
]

export function QuickActions() {
  return (
    <TooltipProvider delayDuration={0}>
      <section className="grid gap-3">
        <div className="grid gap-0.5">
          <h2 className="font-heading text-sm font-medium tracking-tight">
            Quick actions
          </h2>
          <p className="text-sm text-muted-foreground">
            Jump into the tools you use most.
          </p>
        </div>

        <StaggerContainer className="grid gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.map((action) => {
            const body = (
              <>
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors",
                      "href" in action &&
                        "group-hover:bg-primary/10 group-hover:text-primary",
                    )}
                  >
                    <action.icon className="size-4" />
                  </div>
                  <div className="grid min-w-0 gap-0.5">
                    <p className="truncate text-sm font-medium">{action.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
                {"href" in action ? (
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
                ) : (
                  <Clock className="size-4 shrink-0 text-muted-foreground/60" />
                )}
              </>
            )

            if ("href" in action) {
              return (
                <StaggerItem key={action.key} className="h-full">
                  <Link
                    href={action.href}
                    className="group flex h-full items-center justify-between gap-4 rounded-lg border border-border bg-card p-3 transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-foreground/15 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    {body}
                  </Link>
                </StaggerItem>
              )
            }

            return (
              <StaggerItem key={action.key} className="h-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      aria-disabled="true"
                      className="flex h-full cursor-not-allowed items-center justify-between gap-4 rounded-lg border border-dashed border-border bg-card/50 p-3 opacity-70"
                    >
                      {body}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">{action.comingSoon}</TooltipContent>
                </Tooltip>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </section>
    </TooltipProvider>
  )
}
