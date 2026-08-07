"use client"

import * as React from "react"
import { Copy, Trash2, X } from "lucide-react"

import { DashboardButton, IconButton } from "@/features/dashboard/ui"

function CollectionBulkToolbar({
  count,
  onDuplicate,
  onDelete,
  onClear,
  pending = false,
}: {
  count: number
  onDuplicate: () => void
  onDelete: () => void
  onClear: () => void
  pending?: boolean
}) {
  return (
    <div
      role="toolbar"
      aria-label={`Bulk actions on ${count} selected collections`}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-[#2563eb]/25 bg-[#2563eb]/10 px-3 py-2"
    >
      <span className="text-sm font-medium text-[#f3f6fb]" aria-live="polite">
        {count} {count === 1 ? "collection" : "collections"} selected
      </span>

      <div className="flex flex-wrap items-center gap-1">
        <DashboardButton
          type="button"
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={onDuplicate}
        >
          <Copy className="size-3.5" />
          Duplicate
        </DashboardButton>
        <IconButton
          type="button"
          aria-label="Delete selected collections"
          disabled={pending}
          onClick={onDelete}
          className="size-8 text-[#fb7185]"
        >
          <Trash2 className="size-4" />
        </IconButton>
      </div>

      <IconButton
        type="button"
        aria-label="Clear selection"
        disabled={pending}
        onClick={onClear}
        className="ml-auto size-8"
      >
        <X className="size-4" />
      </IconButton>
    </div>
  )
}

export { CollectionBulkToolbar }
