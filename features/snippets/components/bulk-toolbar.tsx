"use client"

import * as React from "react"
import { Archive, Download, Star, Trash2, X } from "lucide-react"

import { DashboardButton, IconButton } from "@/features/dashboard/ui"

function BulkToolbar({
  count,
  allFavorited,
  onFavorite,
  onArchive,
  onDelete,
  onExport,
  onClear,
  pending = false,
}: {
  count: number
  allFavorited: boolean
  onFavorite: () => void
  onArchive: () => void
  onDelete: () => void
  onExport: () => void
  onClear: () => void
  pending?: boolean
}) {
  return (
    <div
      role="toolbar"
      aria-label={`Bulk actions on ${count} selected snippets`}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-[#2563eb]/25 bg-[#2563eb]/10 px-3 py-2"
    >
      <span className="text-sm font-medium text-[#f3f6fb]" aria-live="polite">
        {count} {count === 1 ? "snippet" : "snippets"} selected
      </span>

      <div className="flex flex-wrap items-center gap-1">
        <IconButton
          type="button"
          aria-label={
            allFavorited ? "Remove all selected from favorites" : "Add all selected to favorites"
          }
          disabled={pending}
          onClick={onFavorite}
          className="size-8"
        >
          <Star
            className={cnIcon(allFavorited)}
          />
        </IconButton>
        <IconButton
          type="button"
          aria-label="Archive selected snippets"
          disabled={pending}
          onClick={onArchive}
          className="size-8"
        >
          <Archive className="size-4" />
        </IconButton>
        <IconButton
          type="button"
          aria-label="Delete selected snippets"
          disabled={pending}
          onClick={onDelete}
          className="size-8 text-[#fb7185]"
        >
          <Trash2 className="size-4" />
        </IconButton>
        <DashboardButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={onExport}
          disabled
          title="Export is coming in a later milestone"
        >
          <Download className="size-3.5" />
          Export
        </DashboardButton>
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

function cnIcon(favorited: boolean) {
  return favorited
    ? "size-4 fill-[#fbbf24] text-[#fbbf24]"
    : "size-4 text-[#94a3b8]"
}

export { BulkToolbar }
