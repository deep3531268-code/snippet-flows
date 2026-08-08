"use client"

import * as React from "react"

import { useDebounce, useLocalStorage } from "@/features/shared/hooks"

import { SEARCH_CONFIG } from "../config"
import { normalizeSearchQuery } from "../normalize"
import {
  SEARCH_SECTIONS,
  createSearchApi,
  type SearchApi,
} from "../api/search"
import { GlobalSearchDialog } from "../components/global-search-dialog"
import {
  DEFAULT_SEARCH_MEMORY,
  MAX_RECENT_SEARCHES,
  MAX_RECENTLY_OPENED,
  SEARCH_MEMORY_KEY,
  createEmptySearchMemory,
  serializeSearchMemory,
  validateSearchMemory,
  type RecentOpenEntry,
  type SearchMemory,
} from "../memory/search-memory"
import type {
  SearchFilters,
  SearchItem,
  SearchMode,
  SearchSection,
  SearchSort,
} from "../types"

export interface SearchContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void

  query: string
  setQuery: (query: string) => void
  debouncedQuery: string

  mode: SearchMode
  setMode: (mode: SearchMode) => void
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  sort: SearchSort
  setSort: (sort: SearchSort) => void

  sections: SearchSection[]
  isSearching: boolean

  activeIndex: number
  setActiveIndex: (index: number) => void
  moveActive: (delta: number, rowCount: number) => void
  resetActive: () => void

  recentSearches: string[]
  recentlyOpened: RecentOpenEntry[]
  rememberSearch: (term: string) => void
  rememberOpened: (item: SearchItem) => void
  clearSearchMemory: () => void
}

const SearchContext = React.createContext<SearchContextValue | null>(null)

export function useGlobalSearch(): SearchContextValue {
  const context = React.useContext(SearchContext)
  if (!context) {
    throw new Error("useGlobalSearch must be used within <GlobalSearchProvider>")
  }
  return context
}

export function GlobalSearchProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQueryState] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [sections, setSections] = React.useState<SearchSection[]>(SEARCH_SECTIONS)
  const [isSearching, setIsSearching] = React.useState(false)
  const [api] = React.useState<SearchApi>(() => createSearchApi())
  const searchRequestRef = React.useRef(0)

  const debouncedQuery = useDebounce(query, SEARCH_CONFIG.debounceMs)

  const [memory, setMemory] = useLocalStorage<SearchMemory>(
    SEARCH_MEMORY_KEY,
    DEFAULT_SEARCH_MEMORY,
    validateSearchMemory,
    serializeSearchMemory,
  )

  const open = React.useCallback(() => {
    setActiveIndex(0)
    setIsOpen(true)
  }, [])

  const close = React.useCallback(() => {
    setQueryState("")
    setActiveIndex(0)
    setIsOpen(false)
  }, [])

  const toggle = React.useCallback(() => {
    setActiveIndex(0)
    setIsOpen((value) => !value)
  }, [])

  const setQuery = React.useCallback((next: string) => {
    setQueryState(next)
    setActiveIndex(0)
  }, [])

  const setMode = React.useCallback(
    (next: SearchMode) => {
      setMemory((previous) => ({ ...previous, lastMode: next }))
    },
    [setMemory],
  )

  const setFilters = React.useCallback(
    (next: SearchFilters) => {
      setMemory((previous) => ({ ...previous, lastFilters: next }))
    },
    [setMemory],
  )

  const setSort = React.useCallback(
    (next: SearchSort) => {
      setMemory((previous) => ({ ...previous, lastSort: next }))
    },
    [setMemory],
  )

  const rememberSearch = React.useCallback(
    (term: string) => {
      const normalized = term.trim().toLowerCase()
      if (!normalized) return
      setMemory((previous) => ({
        ...previous,
        recentSearches: [
          normalized,
          ...previous.recentSearches.filter((entry) => entry !== normalized),
        ].slice(0, MAX_RECENT_SEARCHES),
      }))
    },
    [setMemory],
  )

  const rememberOpened = React.useCallback(
    (item: SearchItem) => {
      if (!item.route) return
      const entry: RecentOpenEntry = {
        id: item.id,
        kind: item.kind,
        title: item.title,
        route: item.route,
        openedAt: Date.now(),
      }
      setMemory((previous) => ({
        ...previous,
        recentlyOpened: [
          entry,
          ...previous.recentlyOpened.filter((other) => other.id !== item.id),
        ].slice(0, MAX_RECENTLY_OPENED),
      }))
    },
    [setMemory],
  )

  const clearSearchMemory = React.useCallback(
    () => setMemory(createEmptySearchMemory()),
    [setMemory],
  )

  const moveActive = React.useCallback((delta: number, rowCount: number) => {
    setActiveIndex((current) => {
      if (rowCount <= 0) return 0
      if (current < 0) return 0
      return (current + delta + rowCount) % rowCount
    })
  }, [])

  const resetActive = React.useCallback(() => setActiveIndex(0), [])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault()
        setIsOpen((value) => !value)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  React.useEffect(() => {
    const query = normalizeSearchQuery(debouncedQuery)
    const requestId = ++searchRequestRef.current

    if (query.length < SEARCH_CONFIG.minQueryLength) {
      const reset = () => {
        setSections(SEARCH_SECTIONS)
        setIsSearching(false)
      }
      reset()
      return
    }

    const begin = () => setIsSearching(true)
    begin()

    api
      .search(query)
      .then((result) => {
        if (requestId !== searchRequestRef.current) return
        const apply = () => setSections(result)
        apply()
      })
      .catch(() => {
        if (requestId !== searchRequestRef.current) return
        const apply = () => setSections(SEARCH_SECTIONS)
        apply()
      })
      .finally(() => {
        if (requestId !== searchRequestRef.current) return
        const finish = () => setIsSearching(false)
        finish()
      })

    return () => {
      searchRequestRef.current += 1
    }
  }, [api, debouncedQuery])

  const value = React.useMemo<SearchContextValue>(
    () => ({
      isOpen,
      open,
      close,
      toggle,

      query,
      setQuery,
      debouncedQuery,

      mode: memory.lastMode,
      setMode,
      filters: memory.lastFilters,
      setFilters,
      sort: memory.lastSort,
      setSort,

      sections,
      isSearching,

      activeIndex,
      setActiveIndex,
      moveActive,
      resetActive,

      recentSearches: memory.recentSearches,
      recentlyOpened: memory.recentlyOpened,
      rememberSearch,
      rememberOpened,
      clearSearchMemory,
    }),
    [
      isOpen,
      open,
      close,
      toggle,
      query,
      setQuery,
      debouncedQuery,
      memory.lastMode,
      setMode,
      memory.lastFilters,
      setFilters,
      memory.lastSort,
      setSort,
      sections,
      isSearching,
      activeIndex,
      moveActive,
      resetActive,
      memory.recentSearches,
      memory.recentlyOpened,
      rememberSearch,
      rememberOpened,
      clearSearchMemory,
    ],
  )

  return (
    <SearchContext.Provider value={value}>
      {children}
      <GlobalSearchDialog />
    </SearchContext.Provider>
  )
}
