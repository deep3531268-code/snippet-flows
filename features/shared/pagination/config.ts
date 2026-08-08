// Centralized pagination configuration. No magic numbers in repositories or UI.
export const PAGINATION_CONFIG = {
  snippetPageSize: 25,
  collectionPageSize: 25,
  tagPageSize: 25,
  maxQueryLength: 200,
} as const
