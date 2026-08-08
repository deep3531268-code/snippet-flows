import type { SearchMode } from "./types"

export const SEARCH_CONFIG = {
  debounceMs: 250,
  minQueryLength: 1,
  maxQueryLength: 200,
  defaultMode: "all" as SearchMode,
  limits: {
    snippets: 8,
    collections: 6,
    tags: 6,
  },
  preview: {
    maxLines: 3,
    maxLineLength: 120,
  },
  memory: {
    storageKey: "snippetflow:search-memory:v1",
    maxRecentSearches: 8,
    maxRecentlyOpened: 12,
  },
} as const
