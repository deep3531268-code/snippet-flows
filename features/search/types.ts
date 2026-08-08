import type { LucideIcon } from "lucide-react"

import type { TagColor } from "@/features/tags/types"

export type SearchMode = "all" | "snippets" | "collections" | "tags"

export type SearchSectionId = "snippets" | "collections" | "tags"

export type SearchItemKind = "snippet" | "collection" | "tag"

export interface SearchItem {
  id: string
  kind: SearchItemKind
  title: string
  description?: string
  route?: string
  snippetCount?: number
  tagColor?: TagColor
  codePreview?: string
}

export interface SearchSection {
  id: SearchSectionId
  title: string
  description: string
  icon: LucideIcon
  results: SearchItem[]
}

export interface SearchFilters {
  starredOnly?: boolean
  languages?: string[]
}

export interface SearchSort {
  key: string
  direction: "asc" | "desc"
}
