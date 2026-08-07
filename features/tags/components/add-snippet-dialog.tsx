"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { FileCode2, SearchX } from "lucide-react"

import { DashboardButton, DashboardInput } from "@/features/dashboard/ui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { listSnippetOptions } from "@/features/snippets/actions"
import { LanguageIcon, languageLabel } from "@/features/snippets/components/language-icon"
import { Highlight } from "@/features/snippets/components/highlight"
import type { SnippetListItem } from "@/features/snippets/types"
import { cn } from "@/lib/utils"

function AddSnippetDialog({
  open,
  onOpenChange,
  existingSnippetIds,
  onAdded,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingSnippetIds: string[]
  onAdded: (snippets: SnippetListItem[]) => void
}) {
  const [options, setOptions] = useState<SnippetListItem[]>([])
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setSearch("")
    setOptions([])
    setSelected(new Set())
    listSnippetOptions().then((snippets) => {
      if (!cancelled) setOptions(snippets)
    })
    return () => {
      cancelled = true
    }
  }, [open])

  const available = useMemo(
    () => options.filter((option) => !existingSnippetIds.includes(option.id)),
    [options, existingSnippetIds],
  )

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return available
    return available.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(query) ||
        snippet.description?.toLowerCase().includes(query) ||
        snippet.language.toLowerCase().includes(query),
    )
  }, [available, search])

  const toggle = (id: string) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSave = () => {
    if (selected.size === 0) return
    setPending(true)
    onAdded(available.filter((snippet) => selected.has(snippet.id)))
    setPending(false)
    onOpenChange(false)
  }

  const renderBody = () => {
    if (options.length === 0) {
      return (
        <div className="grid place-items-center gap-2 py-10 text-center">
          <FileCode2 className="size-8 text-[#5b6b82]" />
          <p className="text-sm text-[#94a3b8]">
            No snippets yet. Create snippets from the Snippets page first.
          </p>
        </div>
      )
    }
    if (available.length === 0) {
      return (
        <div className="grid place-items-center gap-2 py-10 text-center">
          <FileCode2 className="size-8 text-[#5b6b82]" />
          <p className="text-sm text-[#94a3b8]">
            All your snippets are already in this tag.
          </p>
        </div>
      )
    }
    if (visible.length === 0) {
      return (
        <div className="grid place-items-center gap-2 py-10 text-center">
          <SearchX className="size-8 text-[#5b6b82]" />
          <p className="text-sm text-[#94a3b8]">No snippets found.</p>
        </div>
      )
    }
    return (
      <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
        {visible.map((snippet) => (
          <label
            key={snippet.id}
            className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-[#e8edf5] transition-colors hover:bg-white/[0.04]"
          >
            <input
              type="checkbox"
              checked={selected.has(snippet.id)}
              onChange={() => toggle(snippet.id)}
              className={cn(
                "size-4 shrink-0 cursor-pointer appearance-none rounded border border-white/[0.15] bg-white/[0.03] transition-colors",
                "checked:border-[#2563eb] checked:bg-[#2563eb]",
              )}
            />
            <LanguageIcon language={snippet.language} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">
                <Highlight text={snippet.title} query={search} />
              </span>
              <span className="block truncate text-xs text-[#94a3b8]">
                {languageLabel(snippet.language)}
              </span>
            </span>
          </label>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/[0.08] bg-[#0f1826] text-[#e8edf5] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#f3f6fb]">Add snippet</DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            Choose existing snippets to add to this tag.
          </DialogDescription>
        </DialogHeader>

        {options.length > 0 && available.length > 0 ? (
          <DashboardInput
            placeholder="Search snippets..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        ) : null}

        {renderBody()}

        <DialogFooter className="gap-2">
          <DashboardButton
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="button"
            disabled={pending || selected.size === 0}
            onClick={handleSave}
          >
            Add
          </DashboardButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { AddSnippetDialog }
