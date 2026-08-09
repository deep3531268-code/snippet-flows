export type ExploreFilters = {
  query: string
  language: string
  tag: string
}

export const DEFAULT_EXPLORE_FILTERS: ExploreFilters = {
  query: "",
  language: "all",
  tag: "all",
}

export function hasActiveExploreFilters(filters: ExploreFilters) {
  return Boolean(
    filters.query.trim() ||
      filters.language !== "all" ||
      filters.tag !== "all",
  )
}
