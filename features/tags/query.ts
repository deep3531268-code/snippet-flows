import {
  filterItems,
  searchItems,
  sortItems,
  type SortConfig,
} from "@/features/shared/query"
import type { TagColor, TagListItem, TagSort } from "./types"

export type TagView = "grid" | "list"

export type TagListSort = TagSort

export type TagListFilters = {
  query: string
  color: "all" | TagColor
}

export const DEFAULT_TAG_FILTERS: TagListFilters = {
  query: "",
  color: "all",
}

export const TAG_SORT_OPTIONS: { value: TagListSort; label: string }[] = [
  { value: "updated", label: "Recently updated" },
  { value: "created", label: "Recently created" },
  { value: "az", label: "Name A–Z" },
  { value: "za", label: "Name Z–A" },
  { value: "count", label: "Snippet count" },
]

export const TAG_COLORS: TagColor[] = [
  "blue",
  "green",
  "purple",
  "orange",
  "pink",
  "teal",
]

export const TAG_COLOR_LABELS: Record<TagColor, string> = {
  blue: "Blue",
  green: "Green",
  purple: "Purple",
  orange: "Orange",
  pink: "Pink",
  teal: "Teal",
}

export const TAG_COLOR_SWATCH: Record<TagColor, string> = {
  blue: "bg-[#2563eb]",
  green: "bg-[#10b981]",
  purple: "bg-[#8b5cf6]",
  orange: "bg-[#f59e0b]",
  pink: "bg-[#ec4899]",
  teal: "bg-[#14b8a6]",
}

export const TAG_GRADIENTS: Record<TagColor, string> = {
  blue: "bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] shadow-[0_8px_24px_-8px_rgba(37,99,235,0.6)]",
  green: "bg-gradient-to-br from-[#10b981] to-[#059669] shadow-[0_8px_24px_-8px_rgba(16,185,129,0.55)]",
  purple: "bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]",
  orange: "bg-gradient-to-br from-[#f59e0b] to-[#d97706] shadow-[0_8px_24px_-8px_rgba(245,158,11,0.5)]",
  pink: "bg-gradient-to-br from-[#ec4899] to-[#db2777] shadow-[0_8px_24px_-8px_rgba(236,72,153,0.5)]",
  teal: "bg-gradient-to-br from-[#14b8a6] to-[#0d9488] shadow-[0_8px_24px_-8px_rgba(20,184,166,0.5)]",
}

export const TAG_GLOW: Record<TagColor, string> = {
  blue: "group-hover:shadow-[0_12px_32px_-10px_rgba(37,99,235,0.65)]",
  green: "group-hover:shadow-[0_12px_32px_-10px_rgba(16,185,129,0.6)]",
  purple: "group-hover:shadow-[0_12px_32px_-10px_rgba(139,92,246,0.6)]",
  orange: "group-hover:shadow-[0_12px_32px_-10px_rgba(245,158,11,0.55)]",
  pink: "group-hover:shadow-[0_12px_32px_-10px_rgba(236,72,153,0.55)]",
  teal: "group-hover:shadow-[0_12px_32px_-10px_rgba(20,184,166,0.55)]",
}

export function tagSortLabel(sort: TagListSort): string {
  return (
    TAG_SORT_OPTIONS.find((option) => option.value === sort)?.label ??
    TAG_SORT_OPTIONS[0].label
  )
}

const byDate = (value: string) => +new Date(value)

const TAG_SORT_CONFIG: SortConfig<TagListItem> = [
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

export function filterTags(
  items: TagListItem[],
  filters: TagListFilters,
): TagListItem[] {
  const filtered = filterItems(items, [
    (tag) => filters.color === "all" || tag.color === filters.color,
  ])
  return searchItems(filtered, filters.query, (tag) =>
    [tag.name, tag.color].join(" "),
  )
}

export function sortTags(
  items: TagListItem[],
  sort: TagListSort,
): TagListItem[] {
  return sortItems(items, TAG_SORT_CONFIG, sort)
}

export function filterAndSortTags(
  items: TagListItem[],
  filters: TagListFilters,
  sort: TagListSort,
): TagListItem[] {
  return sortTags(filterTags(items, filters), sort)
}

export function hasActiveTagFilters(filters: TagListFilters) {
  return Boolean(filters.query.trim() || filters.color !== "all")
}
