"use client"

import { SearchBar } from "@/features/shared/components"
import { SnippetSortMenu } from "@/features/snippets/components/sort-menu"
import type { SnippetListSort } from "@/features/snippets/query"
import type { ExploreFilters } from "@/features/explore/query"
import { ExploreFilterMenu } from "./explore-filter-menu"

function ExploreSearchBar({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Search public snippets…"
      ariaLabel="Search public snippets"
      dataAttribute="explore-search"
      className={className}
    />
  )
}

function ExploreToolbar({
  filters,
  onFiltersChange,
  onClearFilters,
  sort,
  onSortChange,
  tags,
  search,
  onSearchChange,
}: {
  filters: ExploreFilters
  onFiltersChange: (patch: Partial<ExploreFilters>) => void
  onClearFilters: () => void
  sort: SnippetListSort
  onSortChange: (sort: SnippetListSort) => void
  tags: string[]
  search: string
  onSearchChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ExploreSearchBar
        value={search}
        onChange={onSearchChange}
        className="min-w-56 flex-1 basis-64"
      />

      <ExploreFilterMenu
        filters={filters}
        onChange={onFiltersChange}
        tags={tags}
        onClear={onClearFilters}
      />

      <SnippetSortMenu sort={sort} onChange={onSortChange} />
    </div>
  )
}

export { ExploreToolbar }
