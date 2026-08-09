"use server"

import { requireUser } from "@/features/auth/session"
import { PAGINATION_CONFIG } from "@/features/shared/pagination/config"
import { decodeCursor } from "@/features/shared/pagination/cursor"
import {
  emptyPage,
  InvalidCursorError,
} from "@/features/shared/pagination/load-page"
import type { Page } from "@/features/shared/pagination/types"
import type { SnippetFilterOptions } from "@/features/snippets/repository"
import { toSnippetListItem } from "@/features/snippets/serializer"
import { snippetService } from "@/features/snippets/service"
import type { SnippetListItem, SnippetSort } from "@/features/snippets/types"

const EXPLORE_SORTS: SnippetSort[] = [
  "updated",
  "created",
  "oldest",
  "az",
  "za",
  "language",
]

export type ExplorePageArgs = {
  cursor: string | null
  query?: string
  language?: string
  tag?: string
  sort?: SnippetSort
}

export async function loadMoreExploreSnippets(
  args: ExplorePageArgs,
): Promise<Page<SnippetListItem>> {
  await requireUser()

  const cursor = decodeCursor(args.cursor)
  const options: SnippetFilterOptions = {
    query: args.query
      ? args.query.trim().slice(0, PAGINATION_CONFIG.maxQueryLength)
      : undefined,
    language:
      args.language && args.language !== "all" ? args.language : undefined,
    tag: args.tag && args.tag !== "all" ? args.tag : undefined,
    sort: EXPLORE_SORTS.includes(args.sort ?? "updated")
      ? args.sort
      : undefined,
  }

  try {
    const page = await snippetService.listPublicSnippetsPage(options, cursor)
    return { ...page, items: page.items.map(toSnippetListItem) }
  } catch (error) {
    if (error instanceof InvalidCursorError) return emptyPage()
    throw error
  }
}
