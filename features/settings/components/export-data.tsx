"use client"

import * as React from "react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { exportSnippets } from "@/features/snippets/actions"
import type { SnippetExportScope } from "@/features/snippets/types"
import { cn } from "@/lib/utils"

const EXPORT_SCOPES: { value: SnippetExportScope; label: string }[] = [
  { value: "all", label: "All snippets" },
  { value: "favorites", label: "Favorites" },
  { value: "archived", label: "Archived" },
]

export function ExportData() {
  const [scope, setScope] = useState<SnippetExportScope>("all")
  const [pending, start] = useTransition()

  const download = () => {
    const formData = new FormData()
    formData.set("scope", scope)
    start(async () => {
      try {
        const result = await exportSnippets(formData)
        if (result?.error || !result?.ok || !result.json) {
          toast.error(result?.error ?? "Export failed")
          return
        }

        const blob = new Blob([result.json], {
          type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `snippetflow-${scope}-${new Date()
          .toISOString()
          .slice(0, 10)}.json`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
        toast.success("Export downloaded")
      } catch {
        toast.error("Export failed")
      }
    })
  }

  return (
    <div className="grid gap-4">
      <div
        role="radiogroup"
        aria-label="Export scope"
        className="flex w-fit items-center gap-0.5 rounded-lg border bg-card p-1"
      >
        {EXPORT_SCOPES.map((option) => {
          const active = option.value === scope
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={pending}
              onClick={() => setScope(option.value)}
              className={cn(
                "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                pending && "pointer-events-none opacity-70",
              )}
            >
              {active && (
                <motion.span
                  layoutId="export-scope-pill"
                  className="absolute inset-0 rounded-md bg-muted"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative">{option.label}</span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          disabled={pending}
          onClick={download}
          className="gap-1.5"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          Export as JSON
        </Button>
        <p className="text-xs text-muted-foreground">
          Downloads a JSON file with your selected snippets.
        </p>
      </div>
    </div>
  )
}
