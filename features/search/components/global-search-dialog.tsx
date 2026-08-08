"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Clock, CornerDownLeft, History, SearchX } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchInput } from "@/features/dashboard/ui"
import { cn } from "@/lib/utils"

import { isSearchableQuery } from "../normalize"
import type { RecentOpenEntry } from "../memory/search-memory"
import { useGlobalSearch } from "../state/search-context"
import type { SearchItem, SearchMode, SearchSection } from "../types"
import { SearchResultRow } from "./search-result-row"

const SEARCH_MODES = [
  { value: "all", label: "All" },
  { value: "snippets", label: "Snippets" },
  { value: "collections", label: "Collections" },
  { value: "tags", label: "Tags" },
] as const satisfies ReadonlyArray<{ value: SearchMode; label: string }>

type SearchRow =
  | { key: string; type: "recent-search"; term: string }
  | { key: string; type: "recently-opened"; entry: RecentOpenEntry }
  | { key: string; type: "section-header"; section: SearchSection }
  | { key: string; type: "result"; item: SearchItem }
  | { key: string; type: "empty"; section: SearchSection }
  | { key: string; type: "hint"; text: string }
  | { key: string; type: "loading" }
  | { key: string; type: "no-results" }

interface SearchGroup {
  id: string
  label: string
  rows: SearchRow[]
}

export function GlobalSearchDialog() {
  const router = useRouter()
  const {
    isOpen,
    close,
    query,
    setQuery,
    debouncedQuery,
    mode,
    setMode,
    sections,
    isSearching,
    activeIndex,
    setActiveIndex,
    moveActive,
    recentSearches,
    recentlyOpened,
    rememberSearch,
    rememberOpened,
    clearSearchMemory,
  } = useGlobalSearch()

  const queryActive = isSearchableQuery(debouncedQuery)

  const groups = React.useMemo(() => {
    const built: SearchGroup[] = []
    const visibleSections = sections.filter((section) =>
      mode === "all" ? queryActive : section.id === mode,
    )

    if (queryActive && isSearching) {
      built.push({
        id: "loading",
        label: "Searching",
        rows: [
          { key: "loading:1", type: "loading" },
          { key: "loading:2", type: "loading" },
          { key: "loading:3", type: "loading" },
        ],
      })
      return built
    }

    if (queryActive) {
      const populated = visibleSections.filter(
        (section) => section.results.length > 0,
      )
      if (populated.length === 0) {
        built.push({
          id: "no-results",
          label: "No results",
          rows: [{ key: "no-results", type: "no-results" }],
        })
        return built
      }
      for (const section of populated) {
        const rows: SearchRow[] = [
          { key: `section:${section.id}`, type: "section-header", section },
        ]
        for (const item of section.results) {
          rows.push({ key: `result:${item.id}`, type: "result", item })
        }
        built.push({ id: section.id, label: section.title, rows })
      }
      return built
    }

    if (recentSearches.length > 0 || recentlyOpened.length > 0) {
      const rows: SearchRow[] = [
        ...recentSearches.map(
          (term): SearchRow => ({
            key: `recent-search:${term}`,
            type: "recent-search",
            term,
          }),
        ),
        ...recentlyOpened.map(
          (entry): SearchRow => ({
            key: `recently-opened:${entry.id}`,
            type: "recently-opened",
            entry,
          }),
        ),
      ]
      built.push({ id: "recent", label: "Recent", rows })
    } else if (mode === "all") {
      built.push({
        id: "hint",
        label: "Start",
        rows: [
          {
            key: "hint",
            type: "hint",
            text: "Search your snippets, collections, and tags",
          },
        ],
      })
    }

    for (const section of visibleSections) {
      const rows: SearchRow[] = [
        { key: `section:${section.id}`, type: "section-header", section },
      ]
      if (section.results.length === 0) {
        rows.push({ key: `empty:${section.id}`, type: "empty", section })
      } else {
        for (const item of section.results) {
          rows.push({ key: `result:${item.id}`, type: "result", item })
        }
      }
      built.push({ id: section.id, label: section.title, rows })
    }

    return built
  }, [
    queryActive,
    isSearching,
    mode,
    sections,
    recentSearches,
    recentlyOpened,
  ])

  const { navigable, groupStarts } = React.useMemo(() => {
    const options: { row: SearchRow; index: number }[] = []
    const starts: number[] = []
    let cursor = 0
    for (const group of groups) {
      starts.push(cursor)
      for (const row of group.rows) {
        if (row.type === "section-header" || row.type === "loading") continue
        options.push({ row, index: cursor })
        cursor += 1
      }
    }
    return { navigable: options, groupStarts: starts }
  }, [groups])

  const rowIndexByKey = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const { row, index } of navigable) map.set(row.key, index)
    return map
  }, [navigable])

  const activeRow =
    activeIndex >= 0 && activeIndex < navigable.length
      ? navigable[activeIndex].row
      : null

  function activate(row: SearchRow | null): boolean {
    if (!row) return false
    switch (row.type) {
      case "recent-search":
        setQuery(row.term)
        return true
      case "recently-opened":
        if (row.entry.route) {
          router.push(row.entry.route)
          close()
        }
        return true
      case "result":
        if (row.item.route) {
          router.push(row.item.route)
          rememberOpened(row.item)
          close()
        }
        return true
      default:
        return false
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.nativeEvent.isComposing) return
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        event.stopPropagation()
        moveActive(1, navigable.length)
        break
      case "ArrowUp":
        event.preventDefault()
        event.stopPropagation()
        moveActive(-1, navigable.length)
        break
      case "Tab": {
        event.preventDefault()
        event.stopPropagation()
        if (groupStarts.length === 0) break
        const direction = event.shiftKey ? -1 : 1
        const current = groupStarts.reduce(
          (match, start, index) => (start <= activeIndex ? index : match),
          0,
        )
        const next =
          (current + direction + groupStarts.length) % groupStarts.length
        setActiveIndex(groupStarts[next])
        break
      }
      case "Enter":
        event.preventDefault()
        event.stopPropagation()
        if (activate(activeRow)) break
        if (query.trim()) rememberSearch(query)
        break
    }
  }

  const activeId =
    activeRow && activeIndex >= 0 ? `search-option-${activeIndex}` : undefined

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) close()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Global search</DialogTitle>
        <DialogDescription className="sr-only">
          Search snippets, collections, and tags across SnippetFlow.
        </DialogDescription>

        <div onKeyDown={onKeyDown} className="flex flex-col">
          <div className="border-b p-3">
            <SearchInput
              id="global-search-input"
              autoFocus
              role="combobox"
              aria-expanded
              aria-controls="search-results"
              aria-activedescendant={activeId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search snippets, collections, and tags"
              aria-label="Search everything"
              kbd="Esc"
              className="w-full"
            />
            <div
              role="group"
              aria-label="Search mode"
              className="mt-2 flex flex-wrap items-center gap-1"
            >
              {SEARCH_MODES.map((searchMode) => {
                const selected = mode === searchMode.value
                return (
                  <button
                    key={searchMode.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setMode(searchMode.value)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                      selected
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    {searchMode.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div
            id="search-results"
            role="listbox"
            aria-label="Search results"
            className="max-h-[min(60vh,420px)] overflow-y-auto p-2"
          >
            {groups.map((group) => {
              const isRecent = group.id === "recent"
              return (
                <section
                  key={group.id}
                  role="group"
                  aria-label={group.label}
                  className="mb-1 last:mb-0"
                >
                  <div className="flex items-center justify-between px-1 pb-1">
                    <span className="px-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                      {group.label}
                    </span>
                    {isRecent && recentSearches.length > 0 ? (
                      <button
                        type="button"
                        onClick={clearSearchMemory}
                        className="px-2 text-[10px] font-medium text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>

                  {group.rows.map((row) => {
                    if (row.type === "section-header") {
                      return (
                        <div
                          key={row.key}
                          className="flex items-center gap-2 px-3 pt-2 pb-1"
                        >
                          <row.section.icon
                            className="size-3.5 text-muted-foreground"
                            aria-hidden
                          />
                          <span className="text-xs font-medium text-muted-foreground">
                            {row.section.title}
                          </span>
                          <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                            {row.section.results.length}
                          </span>
                        </div>
                      )
                    }

                    const index = rowIndexByKey.get(row.key)
                    const active = index === activeIndex
                    const optionId = index != null ? `search-option-${index}` : undefined

                    const baseRow = cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm outline-none",
                      "focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "bg-muted text-foreground"
                        : "text-foreground/90 hover:bg-muted/60",
                    )

                    switch (row.type) {
                      case "recent-search":
                        return (
                          <button
                            key={row.key}
                            type="button"
                            id={optionId}
                            role="option"
                            aria-selected={active}
                            onMouseEnter={() => index != null && setActiveIndex(index)}
                            onClick={() => activate(row)}
                            className={baseRow}
                          >
                            <History
                              className="size-4 shrink-0 text-muted-foreground"
                              aria-hidden
                            />
                            <span className="flex-1 truncate">{row.term}</span>
                            <CornerDownLeft
                              className="size-3.5 shrink-0 text-muted-foreground"
                              aria-hidden
                            />
                          </button>
                        )
                      case "recently-opened":
                        return (
                          <button
                            key={row.key}
                            type="button"
                            id={optionId}
                            role="option"
                            aria-selected={active}
                            onMouseEnter={() => index != null && setActiveIndex(index)}
                            onClick={() => activate(row)}
                            className={baseRow}
                          >
                            <Clock
                              className="size-4 shrink-0 text-muted-foreground"
                              aria-hidden
                            />
                            <span className="flex-1 truncate">{row.entry.title}</span>
                            <Badge variant="outline" className="shrink-0 capitalize">
                              {row.entry.kind}
                            </Badge>
                          </button>
                        )
                      case "result":
                        return (
                          <SearchResultRow
                            key={row.key}
                            item={row.item}
                            query={debouncedQuery}
                            active={active}
                            id={optionId}
                            onMouseEnter={() =>
                              index != null && setActiveIndex(index)
                            }
                            onActivate={() => activate(row)}
                          />
                        )
                      case "loading":
                        return (
                          <div
                            key={row.key}
                            role="option"
                            aria-selected={false}
                            aria-disabled
                            className={cn(baseRow, "cursor-default")}
                          >
                            <span className="flex w-full flex-col gap-1.5">
                              <Skeleton className="h-3.5 w-2/3" />
                              <Skeleton className="h-3 w-full" />
                            </span>
                          </div>
                        )
                      case "no-results":
                        return (
                          <div
                            key={row.key}
                            role="option"
                            aria-selected={false}
                            aria-disabled
                            className={cn(
                              baseRow,
                              "cursor-default text-muted-foreground",
                            )}
                          >
                            <SearchX
                              className="size-4 shrink-0 text-muted-foreground"
                              aria-hidden
                            />
                            <span className="truncate">
                              No results for &quot;{debouncedQuery.trim()}&quot;
                            </span>
                          </div>
                        )
                      case "empty":
                        return (
                          <div
                            key={row.key}
                            id={optionId}
                            role="option"
                            aria-selected={active}
                            aria-disabled
                            className={cn(baseRow, "cursor-default text-muted-foreground")}
                          >
                            <span>
                              No {row.section.title.toLowerCase()} yet.
                            </span>
                          </div>
                        )
                      case "hint":
                        return (
                          <div
                            key={row.key}
                            id={optionId}
                            role="option"
                            aria-selected={active}
                            aria-disabled
                            className={cn(baseRow, "cursor-default text-muted-foreground")}
                          >
                            <span>{row.text}</span>
                          </div>
                        )
                    }
                  })}
                </section>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 border-t px-3 py-2 text-[10px] text-muted-foreground">
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> navigate
            </span>
            <span>
              <kbd>↵</kbd> open
            </span>
            <span>
              <kbd>tab</kbd> section
            </span>
            <span className="ml-auto">
              <kbd>esc</kbd> close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
