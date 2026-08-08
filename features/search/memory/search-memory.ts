import { SEARCH_CONFIG } from "../config"
import type {
  SearchFilters,
  SearchItemKind,
  SearchMode,
  SearchSort,
} from "../types"

export interface RecentOpenEntry {
  id: string
  kind: SearchItemKind
  title: string
  route: string
  openedAt: number
}

export interface SearchMemory {
  recentSearches: string[]
  recentlyOpened: RecentOpenEntry[]
  lastFilters: SearchFilters
  lastSort: SearchSort
  lastMode: SearchMode
}

export const SEARCH_MEMORY_KEY = SEARCH_CONFIG.memory.storageKey

export const MAX_RECENT_SEARCHES = SEARCH_CONFIG.memory.maxRecentSearches

export const MAX_RECENTLY_OPENED = SEARCH_CONFIG.memory.maxRecentlyOpened

export function createEmptySearchMemory(): SearchMemory {
  return {
    recentSearches: [],
    recentlyOpened: [],
    lastFilters: {},
    lastSort: { key: "updatedAt", direction: "desc" },
    lastMode: SEARCH_CONFIG.defaultMode,
  }
}

export const DEFAULT_SEARCH_MEMORY = createEmptySearchMemory()

const SEARCH_MODES: SearchMode[] = ["all", "snippets", "collections", "tags"]

function parseSort(value: unknown): SearchSort {
  if (value && typeof value === "object") {
    const sort = value as Partial<SearchSort>
    const direction = sort.direction === "asc" ? "asc" : "desc"
    if (typeof sort.key === "string" && sort.key) {
      return { key: sort.key, direction }
    }
  }
  return createEmptySearchMemory().lastSort
}

export function validateSearchMemory(raw: string | null): SearchMemory {
  if (!raw) return createEmptySearchMemory()
  try {
    const parsed = JSON.parse(raw) as Partial<SearchMemory>
    if (!parsed || typeof parsed !== "object") return createEmptySearchMemory()

    const recentSearches = Array.isArray(parsed.recentSearches)
      ? parsed.recentSearches
          .filter((entry): entry is string => typeof entry === "string")
          .slice(0, MAX_RECENT_SEARCHES)
      : []

    const recentlyOpened = Array.isArray(parsed.recentlyOpened)
      ? parsed.recentlyOpened
          .filter(
            (entry): entry is RecentOpenEntry =>
              !!entry &&
              typeof entry === "object" &&
              typeof entry.id === "string" &&
              typeof entry.title === "string" &&
              typeof entry.route === "string",
          )
          .slice(0, MAX_RECENTLY_OPENED)
      : []

    const lastFilters =
      parsed.lastFilters && typeof parsed.lastFilters === "object"
        ? (parsed.lastFilters as SearchFilters)
        : {}

    const lastMode = SEARCH_MODES.includes(parsed.lastMode as SearchMode)
      ? (parsed.lastMode as SearchMode)
      : "all"

    return {
      recentSearches,
      recentlyOpened,
      lastFilters,
      lastSort: parseSort(parsed.lastSort),
      lastMode,
    }
  } catch {
    return createEmptySearchMemory()
  }
}

export function serializeSearchMemory(memory: SearchMemory): string {
  return JSON.stringify(memory)
}
