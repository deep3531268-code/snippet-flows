"use server"

import { requireUser } from "@/features/auth/session"

import { normalizeSearchQuery } from "./normalize"
import { searchService, type SearchResults } from "./service"

export async function searchAll(rawQuery: unknown): Promise<SearchResults> {
  const user = await requireUser()
  const query = normalizeSearchQuery(rawQuery)
  return searchService.search(user.id, query)
}
