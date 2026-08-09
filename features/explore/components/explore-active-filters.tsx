"use client"

import * as React from "react"
import { X } from "lucide-react"

import { DashboardBadge, IconButton } from "@/features/dashboard/ui"
import {
  LanguageIcon,
  languageLabel,
} from "@/features/snippets/components/language-icon"
import type { ExploreFilters } from "@/features/explore/query"

type ActiveFilterChip = {
  key: string
  ariaLabel: string
  label: React.ReactNode
  onRemove: () => void
}

// Shows which search/filter values are applied so the current discovery
// state stays visible without opening the filter menu. Each chip clears just
// its own filter; "Clear all" resets search + filters in one action.
function ExploreActiveFilters({
  filters,
  onChange,
  onClear,
}: {
  filters: ExploreFilters
  onChange: (patch: Partial<ExploreFilters>) => void
  onClear: () => void
}) {
  const chips: ActiveFilterChip[] = []

  const query = filters.query.trim()
  if (query) {
    chips.push({
      key: "query",
      ariaLabel: "Remove search",
      label: <span>{`"${query}"`}</span>,
      onRemove: () => onChange({ query: "" }),
    })
  }

  if (filters.language !== "all") {
    chips.push({
      key: `language:${filters.language}`,
      ariaLabel: "Remove language filter",
      label: (
        <>
          <LanguageIcon
            language={filters.language}
            size="sm"
            className="size-5 rounded-md"
          />
          {languageLabel(filters.language)}
        </>
      ),
      onRemove: () => onChange({ language: "all" }),
    })
  }

  if (filters.tag !== "all") {
    chips.push({
      key: `tag:${filters.tag}`,
      ariaLabel: "Remove tag filter",
      label: <span className="text-[#7cb3ff]">#{filters.tag}</span>,
      onRemove: () => onChange({ tag: "all" }),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <DashboardBadge
          key={chip.key}
          variant="secondary"
          className="h-7 max-w-full gap-1 pr-1 text-xs"
        >
          <span className="min-w-0 max-w-40 truncate">{chip.label}</span>
          <IconButton
            type="button"
            aria-label={chip.ariaLabel}
            onClick={chip.onRemove}
            className="size-5 rounded-full border-0 bg-transparent p-0 hover:bg-white/10"
          >
            <X className="size-3" />
          </IconButton>
        </DashboardBadge>
      ))}

      <button
        type="button"
        onClick={onClear}
        className="text-xs text-[#94a3b8] transition-colors hover:text-white"
      >
        Clear all
      </button>
    </div>
  )
}

export { ExploreActiveFilters }
