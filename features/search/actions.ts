"use server"

import { requireUser } from "@/features/auth/session"

import { searchService, type SearchResults } from "./service"

export async function searchAll(rawQuery: unknown): Promise<SearchResults> {
  const user = await requireUser()
  return searchService.search(user.id, rawQuery)
}
