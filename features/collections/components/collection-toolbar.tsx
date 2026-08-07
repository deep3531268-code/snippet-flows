"use client"

import * as React from "react"
import { LayoutGrid, Rows3 } from "lucide-react"

import { IconButton } from "@/features/dashboard/ui"
import { CollectionSearchBar } from "./collection-search-bar"
import { CollectionFilterMenu } from "./collection-filter-menu"
import { CollectionSortMenu } from "./collection-sort-menu"
import type {
  CollectionListFilters,
  CollectionListSort,
  CollectionView,
} from "../query"
import { cn } from "@/lib/utils"

function SelectAllCheckbox({
  checked,
  onCheckedChange,
  disabled,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <input
      type="checkbox"
      aria-label="Select all collections"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onCheckedChange(event.target.checked)}
      className="size-4 shrink-0 cursor-pointer appearance-none rounded border border-white/[0.15] bg-white/[0.03] transition-colors checked:border-[#2563eb] checked:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}

function CollectionToolbar({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  search,
  onSearchChange,
  selectable = false,
  allSelected = false,
  onToggleSelectAll,
}: {
  filters: CollectionListFilters
  onFiltersChange: (patch: Partial<CollectionListFilters>) => void
  sort: CollectionListSort
  onSortChange: (sort: CollectionListSort) => void
  view: CollectionView
  onViewChange: (view: CollectionView) => void
  search: string
  onSearchChange: (value: string) => void
  selectable?: boolean
  allSelected?: boolean
  onToggleSelectAll: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {selectable ? (
        <SelectAllCheckbox
          checked={allSelected}
          onCheckedChange={() => onToggleSelectAll()}
        />
      ) : null}

      <CollectionSearchBar
        value={search}
        onChange={onSearchChange}
        className="min-w-56 flex-1 basis-64"
      />

      <CollectionFilterMenu filters={filters} onChange={onFiltersChange} />

      <CollectionSortMenu sort={sort} onChange={onSortChange} />

      <div
        role="group"
        aria-label="View mode"
        className="ml-auto flex items-center gap-1 rounded-[12px] border border-white/[0.07] bg-white/[0.03] p-1"
      >
        <IconButton
          type="button"
          aria-label="Grid view"
          aria-pressed={view === "grid"}
          onClick={() => onViewChange("grid")}
          className={cn(
            "size-8 rounded-lg",
            view === "grid"
              ? "bg-[#2563eb]/20 text-[#7cb3ff]"
              : "text-[#94a3b8]",
          )}
        >
          <LayoutGrid className="size-4" />
        </IconButton>
        <IconButton
          type="button"
          aria-label="List view"
          aria-pressed={view === "list"}
          onClick={() => onViewChange("list")}
          className={cn(
            "size-8 rounded-lg",
            view === "list"
              ? "bg-[#2563eb]/20 text-[#7cb3ff]"
              : "text-[#94a3b8]",
          )}
        >
          <Rows3 className="size-4" />
        </IconButton>
      </div>
    </div>
  )
}

export { CollectionToolbar }
