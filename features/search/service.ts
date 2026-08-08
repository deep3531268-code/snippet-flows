import "server-only"

import type { TagColor } from "@/features/tags/types"
import { TAG_COLORS } from "@/features/tags/query"

import { SEARCH_CONFIG } from "./config"
import { normalizeSearchQuery } from "./normalize"
import { searchRepository } from "./repository"
import type { SearchItem } from "./types"

const SNIPPETS_ROUTE = "/dashboard/snippets"

function collectionRoute(id: string) {
  return `/dashboard/collections/${id}`
}

function tagRoute(id: string) {
  return `/dashboard/tags/${id}`
}

function tagColorFor(name: string): TagColor {
  const sum = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return TAG_COLORS[sum % TAG_COLORS.length]
}

function buildCodePreview(content: string, query: string): string | undefined {
  const needle = query.toLowerCase()
  const index = content.toLowerCase().indexOf(needle)
  if (index === -1) return undefined

  const lines = content.split("\n")
  const lineStart = content.slice(0, index).split("\n").length - 1
  const { maxLines, maxLineLength } = SEARCH_CONFIG.preview

  return lines
    .slice(lineStart, lineStart + maxLines)
    .map((line) =>
      line.length > maxLineLength
        ? `${line.slice(0, maxLineLength)}…`
        : line,
    )
    .join("\n")
}

export interface SearchResults {
  snippets: SearchItem[]
  collections: SearchItem[]
  tags: SearchItem[]
}

export const searchService = {
  async search(userId: string, rawQuery: unknown): Promise<SearchResults> {
    const query = normalizeSearchQuery(rawQuery)
    if (query.length < SEARCH_CONFIG.minQueryLength) {
      return { snippets: [], collections: [], tags: [] }
    }

    const [snippets, collections, tags] = await Promise.all([
      searchRepository.findSnippets(userId, query),
      searchRepository.findCollections(userId, query),
      searchRepository.findTags(userId, query),
    ])

    return {
      snippets: snippets.map((snippet) => ({
        id: snippet.id,
        kind: "snippet",
        title: snippet.title,
        description: snippet.description ?? snippet.language,
        codePreview: buildCodePreview(snippet.content, query),
        route: SNIPPETS_ROUTE,
      })),
      collections: collections.map((collection) => ({
        id: collection.id,
        kind: "collection",
        title: collection.name,
        description: collection.description ?? undefined,
        snippetCount: collection._count.snippets,
        route: collectionRoute(collection.id),
      })),
      tags: tags.map((tag) => ({
        id: tag.id,
        kind: "tag",
        title: tag.name,
        snippetCount: tag._count.snippets,
        tagColor: tagColorFor(tag.name),
        route: tagRoute(tag.id),
      })),
    }
  },
}
