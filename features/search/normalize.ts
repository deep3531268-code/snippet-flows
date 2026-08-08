import { SEARCH_CONFIG } from "./config"

export function normalizeSearchQuery(raw: unknown): string {
  const text = String(raw ?? "")
  const trimmed = text.trim().replace(/\s+/g, " ").toLowerCase()
  return trimmed.slice(0, SEARCH_CONFIG.maxQueryLength)
}

export function isSearchableQuery(query: string): boolean {
  return normalizeSearchQuery(query).length >= SEARCH_CONFIG.minQueryLength
}
