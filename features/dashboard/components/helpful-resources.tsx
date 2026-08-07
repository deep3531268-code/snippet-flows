"use client"

import { BookOpen, FileDown, Keyboard } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { StaggerContainer, StaggerItem } from "@/components/shared/motion"

const RESOURCES: {
  label: string
  description: string
  icon: LucideIcon
}[] = [
  {
    label: "Documentation",
    description: "Guides and references for every SnippetFlow feature.",
    icon: BookOpen,
  },
  {
    label: "Keyboard shortcuts",
    description: "Speed up your workflow with the command palette.",
    icon: Keyboard,
  },
  {
    label: "Import guide",
    description: "Bring your existing snippets into SnippetFlow.",
    icon: FileDown,
  },
]

export function HelpfulResources() {
  return (
    <section className="grid h-fit gap-3">
      <div className="grid gap-0.5">
        <h2 className="font-heading text-sm font-medium tracking-tight">
          Helpful resources
        </h2>
        <p className="text-sm text-muted-foreground">
          Get the most out of your workspace.
        </p>
      </div>

      <StaggerContainer className="grid gap-2">
        {RESOURCES.map(({ label, description, icon: Icon }) => (
          <StaggerItem key={label}>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
                <Icon className="size-4" />
              </div>
              <div className="grid min-w-0 flex-1 gap-0.5">
                <p className="truncate text-sm font-medium">{label}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {description}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                Soon
              </span>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  )
}
