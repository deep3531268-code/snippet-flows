import { SEARCH_CONFIG } from "./config"
import { normalizeSearchQuery } from "./normalize"

export interface RankableSearchResult {
  title: string
  description?: string | null
  content?: string | null
  updatedAt?: Date | string | null
  createdAt?: Date | string | null
}

export type SearchTitleMatchTier =
  | "exactTitle"
  | "startsWithTitle"
  | "wordBoundaryTitle"
  | "containsTitle"

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function hasWordBoundary(text: string, query: string): boolean {
  const pattern = new RegExp(
    `(^|[^\\p{L}\\p{N}])${escapeRegExp(query)}($|[^\\p{L}\\p{N}])`,
    "u",
  )
  return pattern.test(text)
}

function getTitleMatchTier(
  query: string,
  title: string,
): SearchTitleMatchTier | null {
  const normalizedTitle = normalizeSearchQuery(title)
  if (!normalizedTitle) return null
  if (normalizedTitle === query) return "exactTitle"
  if (normalizedTitle.startsWith(query)) return "startsWithTitle"
  if (hasWordBoundary(normalizedTitle, query)) return "wordBoundaryTitle"
  if (normalizedTitle.includes(query)) return "containsTitle"
  return null
}

export function scoreSearchResult(
  query: string,
  result: RankableSearchResult,
): number {
  const normalized = normalizeSearchQuery(query)
  if (!normalized) return 0

  const { weights } = SEARCH_CONFIG.ranking

  const titleTier = getTitleMatchTier(normalized, result.title)
  if (titleTier) return weights[titleTier]

  if (
    result.description &&
    normalizeSearchQuery(result.description).includes(normalized)
  ) {
    return weights.descriptionMatch
  }

  if (
    result.content &&
    normalizeSearchQuery(result.content).includes(normalized)
  ) {
    return weights.contentMatch
  }

  return 0
}

function timeValue(value: Date | string | null | undefined): number {
  if (value == null) return 0
  const time = typeof value === "string" ? Date.parse(value) : value.getTime()
  return Number.isFinite(time) ? time : 0
}

function compareRecency(a: RankableSearchResult, b: RankableSearchResult): number {
  const updated = timeValue(b.updatedAt) - timeValue(a.updatedAt)
  if (updated !== 0) return updated
  return timeValue(b.createdAt) - timeValue(a.createdAt)
}

export function rankByRelevance<T>(
  query: string,
  results: T[],
  toDoc: (result: T) => RankableSearchResult,
): T[] {
  const scored = results.map((item) => {
    const doc = toDoc(item)
    return { item, doc, score: scoreSearchResult(query, doc) }
  })
  return scored
    .sort((a, b) => b.score - a.score || compareRecency(a.doc, b.doc))
    .map((entry) => entry.item)
}
