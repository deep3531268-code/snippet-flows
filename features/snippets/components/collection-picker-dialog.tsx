"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Folder } from "lucide-react"

import { DashboardButton } from "@/features/dashboard/ui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { listCollectionOptions } from "@/features/collections/actions"
import type { SnippetListItem } from "@/features/snippets/types"
import { cn } from "@/lib/utils"

type CollectionOption = { id: string; name: string }

function CollectionPickerDialog({
  snippet,
  onOpenChange,
  onSaved,
}: {
  snippet: SnippetListItem | null
  onOpenChange: (open: boolean) => void
  onSaved: (collections: CollectionOption[]) => void
}) {
  const open = Boolean(snippet)

  const [options, setOptions] = useState<CollectionOption[]>([])
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setOptions([])
    setSelected(
      new Set((snippet?.collections ?? []).map((collection) => collection.id)),
    )
    listCollectionOptions().then((collections) => {
      if (!cancelled) setOptions(collections)
    })
    return () => {
      cancelled = true
    }
  }, [open, snippet])

  const toggle = (id: string) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSave = async () => {
    if (!snippet) return
    setPending(true)
    onSaved(options.filter((option) => selected.has(option.id)))
    setPending(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/[0.08] bg-[#0f1826] text-[#e8edf5] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#f3f6fb]">
            Add to collection
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            Choose collections for &ldquo;{snippet?.title}&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
          {options.length === 0 ? (
            <p className="text-sm text-[#5b6b82]">
              No collections yet. Create one from the Collections page first.
            </p>
          ) : (
            options.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-[#e8edf5] transition-colors hover:bg-white/[0.04]"
              >
                <input
                  type="checkbox"
                  checked={selected.has(option.id)}
                  onChange={() => toggle(option.id)}
                  className={cn(
                    "size-4 shrink-0 cursor-pointer appearance-none rounded border border-white/[0.15] bg-white/[0.03] transition-colors",
                    "checked:border-[#2563eb] checked:bg-[#2563eb]",
                  )}
                />
                <Folder className="size-4 shrink-0 text-[#94a3b8]" />
                <span className="truncate">{option.name}</span>
              </label>
            ))
          )}
        </div>

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
            disabled={pending}
            onClick={handleSave}
          >
            Save
          </DashboardButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { CollectionPickerDialog }
