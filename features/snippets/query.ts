import {
  filterItems,
  searchItems,
  sortItems,
  type SortConfig,
} from "@/features/shared/query"
import type { SnippetListItem, SnippetSort } from "./types"

export type SnippetView = "grid" | "list"

export type SnippetListSort = SnippetSort | "language"

export type SnippetListFilters = {
  query: string
  language: string
  tag: string
  favoritesOnly: boolean
  visibility: "all" | "public" | "private"
}

export const DEFAULT_FILTERS: SnippetListFilters = {
  query: "",
  language: "all",
  tag: "all",
  favoritesOnly: false,
  visibility: "all",
}

export const SORT_OPTIONS: { value: SnippetListSort; label: string }[] = [
  { value: "updated", label: "Recently updated" },
  { value: "created", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "Title A–Z" },
  { value: "za", label: "Title Z–A" },
  { value: "language", label: "Language" },
]

const byDate = (value: string) => +new Date(value)

const SNIPPET_SORT_CONFIG: SortConfig<SnippetListItem> = [
  {
    value: "updated",
    compare: (a, b) => byDate(b.updatedAt) - byDate(a.updatedAt),
  },
  {
    value: "created",
    compare: (a, b) => byDate(b.createdAt) - byDate(a.createdAt),
  },
  {
    value: "oldest",
    compare: (a, b) => byDate(a.createdAt) - byDate(b.createdAt),
  },
  { value: "az", compare: (a, b) => a.title.localeCompare(b.title) },
  { value: "za", compare: (a, b) => b.title.localeCompare(a.title) },
  { value: "language", compare: (a, b) => a.language.localeCompare(b.language) },
]

export function getSnippetTags(snippets: SnippetListItem[]) {
  const set = new Set<string>()
  for (const snippet of snippets) {
    for (const item of snippet.tags) set.add(item.name)
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

export function filterSnippets(
  snippets: SnippetListItem[],
  filters: SnippetListFilters,
) {
  const filtered = filterItems(snippets, [
    (snippet) => {
      if (filters.favoritesOnly && !snippet.isFavorite) return false
      if (filters.language !== "all" && snippet.language !== filters.language) {
        return false
      }
      if (filters.visibility === "public" && !snippet.isPublic) return false
      if (filters.visibility === "private" && snippet.isPublic) return false
      if (
        filters.tag !== "all" &&
        !snippet.tags.some((item) => item.name === filters.tag)
      ) {
        return false
      }
      return true
    },
  ])
  return searchItems(filtered, filters.query, (snippet) =>
    [
      snippet.title,
      snippet.description ?? "",
      snippet.content,
      snippet.language,
      ...snippet.tags.map((item) => item.name),
    ].join(" "),
  )
}

export function sortSnippets(
  snippets: SnippetListItem[],
  sort: SnippetListSort,
) {
  return sortItems(snippets, SNIPPET_SORT_CONFIG, sort)
}

export function filterAndSortSnippets(
  snippets: SnippetListItem[],
  filters: SnippetListFilters,
  sort: SnippetListSort,
) {
  return sortSnippets(filterSnippets(snippets, filters), sort)
}

export function hasActiveFilters(filters: SnippetListFilters) {
  return Boolean(
    filters.query.trim() ||
      filters.language !== "all" ||
      filters.tag !== "all" ||
      filters.favoritesOnly ||
      filters.visibility !== "all",
  )
}
