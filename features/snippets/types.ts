export type SnippetFilter = "all" | "favorites" | "archived" | "trash"

export type SnippetVisibility = "public" | "private"

export type SnippetFilters = {
  language?: string
  visibility?: SnippetVisibility
  recentlyUpdated?: boolean
}

export type SnippetSort = "updated" | "created" | "oldest" | "az" | "za" | "language"

export type SnippetExportScope = "all" | "favorites" | "archived"

export type SnippetListItem = {
  id: string
  title: string
  description: string | null
  content: string
  language: string
  isPublic: boolean
  slug: string | null
  isFavorite: boolean
  isArchived: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  tags: { id: string; name: string }[]
  collections: { id: string; name: string }[]
}
