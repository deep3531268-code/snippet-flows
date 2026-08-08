import { Code2, Folder, Tag } from "lucide-react"

import { searchAll } from "../actions"
import type { SearchMode, SearchSection } from "../types"

export const SEARCH_SECTIONS: SearchSection[] = [
  {
    id: "snippets",
    title: "Snippets",
    description: "Code snippets you saved",
    icon: Code2,
    results: [],
  },
  {
    id: "collections",
    title: "Collections",
    description: "Collections you created",
    icon: Folder,
    results: [],
  },
  {
    id: "tags",
    title: "Tags",
    description: "Tags used across your snippets",
    icon: Tag,
    results: [],
  },
]

export const SEARCH_MODES: ReadonlyArray<{ value: SearchMode; label: string }> = [
  { value: "all", label: "All" },
  ...SEARCH_SECTIONS.map((section) => ({
    value: section.id as SearchMode,
    label: section.title,
  })),
]

export interface SearchApi {
  sections: SearchSection[]
  search(query: string): Promise<SearchSection[]>
}

export function createSearchApi(
  sections: SearchSection[] = SEARCH_SECTIONS,
): SearchApi {
  return {
    sections,
    async search(query) {
      const results = await searchAll(query)
      return sections.map((section) => ({
        ...section,
        results: results[section.id],
      }))
    },
  }
}
