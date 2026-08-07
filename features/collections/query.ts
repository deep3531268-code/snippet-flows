import {
  filterItems,
  searchItems,
  sortItems,
  type SortConfig,
} from "@/features/shared/query"
import type { CollectionAccent, CollectionListItem } from "./types"

export type CollectionView = "grid" | "list"

export type CollectionListSort =
  | "updated"
  | "created"
  | "az"
  | "za"
  | "count"

export type CollectionListFilters = {
  query: string
  visibility: "all" | "public" | "private"
}

export const DEFAULT_COLLECTION_FILTERS: CollectionListFilters = {
  query: "",
  visibility: "all",
}

export const COLLECTION_SORT_OPTIONS: {
  value: CollectionListSort
  label: string
}[] = [
  { value: "updated", label: "Recently updated" },
  { value: "created", label: "Recently created" },
  { value: "az", label: "Name A–Z" },
  { value: "za", label: "Name Z–A" },
  { value: "count", label: "Snippet count" },
]

export const COLLECTION_ACCENTS: CollectionAccent[] = [
  "blue",
  "green",
  "purple",
  "orange",
  "pink",
  "teal",
]

export function collectionSortLabel(sort: CollectionListSort): string {
  return (
    COLLECTION_SORT_OPTIONS.find((option) => option.value === sort)?.label ??
    COLLECTION_SORT_OPTIONS[0].label
  )
}

const byDate = (value: string) => +new Date(value)

const COLLECTION_SORT_CONFIG: SortConfig<CollectionListItem> = [
  {
    value: "updated",
    compare: (a, b) => byDate(b.updatedAt) - byDate(a.updatedAt),
  },
  {
    value: "created",
    compare: (a, b) => byDate(b.createdAt) - byDate(a.createdAt),
  },
  { value: "az", compare: (a, b) => a.name.localeCompare(b.name) },
  { value: "za", compare: (a, b) => b.name.localeCompare(a.name) },
  {
    value: "count",
    compare: (a, b) =>
      b.snippetCount - a.snippetCount || a.name.localeCompare(b.name),
  },
]

export function filterCollections(
  items: CollectionListItem[],
  filters: CollectionListFilters,
): CollectionListItem[] {
  const filtered = filterItems(items, [
    (collection) => {
      if (filters.visibility === "public" && !collection.isPublic) return false
      if (filters.visibility === "private" && collection.isPublic) return false
      return true
    },
  ])
  return searchItems(filtered, filters.query, (collection) =>
    [
      collection.name,
      collection.description ?? "",
      ...collection.tags.map((tag) => tag.name),
    ].join(" "),
  )
}

export function sortCollections(
  items: CollectionListItem[],
  sort: CollectionListSort,
): CollectionListItem[] {
  return sortItems(items, COLLECTION_SORT_CONFIG, sort)
}

export function filterAndSortCollections(
  items: CollectionListItem[],
  filters: CollectionListFilters,
  sort: CollectionListSort,
): CollectionListItem[] {
  return sortCollections(filterCollections(items, filters), sort)
}

export function hasActiveFilters(filters: CollectionListFilters) {
  return Boolean(filters.query.trim() || filters.visibility !== "all")
}
