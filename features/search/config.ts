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
  ranking: {
    weights: {
      exactTitle: 1000,
      startsWithTitle: 900,
      wordBoundaryTitle: 800,
      containsTitle: 700,
      descriptionMatch: 500,
      contentMatch: 300,
    },
    futureAiWeight: 0,
    futureVectorWeight: 0,
    fuzzyThreshold: 0,
    semanticThreshold: 0,
  },
  memory: {
    storageKey: "snippetflow:search-memory:v1",
    maxRecentSearches: 8,
    maxRecentlyOpened: 12,
  },
} as const
