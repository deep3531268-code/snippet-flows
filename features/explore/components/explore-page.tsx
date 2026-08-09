"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Compass, RotateCcw, SearchX } from "lucide-react"

import {
  DashboardBadge,
  DashboardButton,
  EmptyState,
} from "@/features/dashboard/ui"
import { InfiniteScrollFooter } from "@/features/shared/components"
import { useDebounce, useInfiniteList } from "@/features/shared/hooks"
import { StaggerContainer, StaggerItem } from "@/features/shared/motion"
import { loadMoreExploreSnippets } from "@/features/explore/actions"
import {
  hasActiveExploreFilters,
  type ExploreFilters,
} from "@/features/explore/query"
import type { SnippetListItem, SnippetSort } from "@/features/snippets/types"
import { ExploreActiveFilters } from "./explore-active-filters"
import { ExploreToolbar } from "./explore-toolbar"
import { PublicSnippetCard } from "./public-snippet-card"

function shortQuery(query: string) {
  const trimmed = query.trim()
  return trimmed.length > 32 ? `${trimmed.slice(0, 32)}…` : trimmed
}

function ExplorePage({
  snippets,
  nextCursor,
  hasMore,
  totalCount,
  tags,
}: {
  snippets: SnippetListItem[]
  nextCursor: string | null
  hasMore: boolean
  totalCount: number
  tags: string[]
}) {
  const [searchInput, setSearchInput] = useState("")
  const [language, setLanguage] = useState("all")
  const [tag, setTag] = useState("all")
  const [sort, setSort] = useState<SnippetSort>("updated")

  const debouncedQuery = useDebounce(searchInput, 300)

  const filters = useMemo<ExploreFilters>(
    () => ({ query: debouncedQuery, language, tag }),
    [debouncedQuery, language, tag],
  )

  const patchFilters = useCallback(
    (patch: Partial<ExploreFilters>) => {
      if (patch.query !== undefined) setSearchInput(patch.query)
      if (patch.language !== undefined) setLanguage(patch.language)
      if (patch.tag !== undefined) setTag(patch.tag)
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setSearchInput("")
    setLanguage("all")
    setTag("all")
    setSort("updated")
  }, [])

  // ⌘/Ctrl+F focuses the Explore search input (matches the hint shown in the
  // search field and the pattern used by the snippets list).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey
      if (!mod || event.key.toLowerCase() !== "f") return
      const target = event.target as HTMLElement | null
      if (target?.dataset.exploreSearch !== undefined) return
      event.preventDefault()
      document
        .querySelector<HTMLInputElement>("[data-explore-search]")
        ?.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const hasQuery = filters.query.trim().length > 0
  const hasSelection =
    filters.language !== "all" || filters.tag !== "all"

  const loadPage = useCallback(
    (cursor: string | null) =>
      loadMoreExploreSnippets({
        cursor,
        query: filters.query,
        language: filters.language,
        tag: filters.tag,
        sort,
      }),
    [filters, sort],
  )

  const resetKey = `${filters.query}|${filters.language}|${filters.tag}|${sort}`

  const {
    items,
    hasMore: liveHasMore,
    initialLoading,
    loadingMore,
    error,
    retry,
    sentinelRef,
  } = useInfiniteList<SnippetListItem>({
    initialItems: snippets,
    initialNextCursor: nextCursor,
    initialHasMore: hasMore,
    loadPage,
    resetKey,
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="font-heading text-[32px] font-bold tracking-tight text-[#f3f6fb]">
            Explore
          </h1>
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-sm text-[#94a3b8]">
              Discover public snippets shared by the community.
            </p>
            {!hasActiveExploreFilters(filters) ? (
              <DashboardBadge variant="secondary">
                {(totalCount ?? items.length)}{" "}
                {(totalCount ?? items.length) === 1
                  ? "public snippet"
                  : "public snippets"}
              </DashboardBadge>
            ) : null}
          </div>
        </div>
      </div>

      <ExploreToolbar
        filters={filters}
        onFiltersChange={patchFilters}
        onClearFilters={clearFilters}
        sort={sort}
        onSortChange={setSort}
        tags={tags}
        search={searchInput}
        onSearchChange={setSearchInput}
      />

      <ExploreActiveFilters
        filters={filters}
        onChange={patchFilters}
        onClear={clearFilters}
      />

      {items.length === 0 ? (
        initialLoading ? null : hasActiveExploreFilters(filters) ? (
          <EmptyState
            icon={SearchX}
            title={
              hasQuery && !hasSelection
                ? `No results for "${shortQuery(filters.query)}"`
                : hasSelection && !hasQuery
                  ? "No snippets match your filters"
                  : "No public snippets found"
            }
            description={
              hasQuery && !hasSelection
                ? "Try a different search term."
                : hasSelection && !hasQuery
                  ? "Try removing a filter to see more results."
                  : "Try adjusting your search or filters."
            }
            className="min-h-[320px] flex-1"
          >
            <DashboardButton variant="secondary" onClick={clearFilters}>
              <RotateCcw className="size-4" />
              Clear Filters
            </DashboardButton>
          </EmptyState>
        ) : (
          <EmptyState
            icon={Compass}
            title="No public snippets yet"
            description="When community members share snippets publicly, they will appear here."
            className="min-h-[320px] flex-1"
          />
        )
      ) : (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((snippet) => (
            <StaggerItem key={snippet.id} className="h-full">
              <PublicSnippetCard snippet={snippet} query={filters.query} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {items.length > 0 || initialLoading ? (
        <InfiniteScrollFooter
          sentinelRef={sentinelRef}
          initialLoading={initialLoading}
          loadingMore={loadingMore}
          hasMore={liveHasMore}
          error={error}
          onRetry={retry}
        />
      ) : null}
    </div>
  )
}

export { ExplorePage }
