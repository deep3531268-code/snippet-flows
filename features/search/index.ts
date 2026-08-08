export {
  GlobalSearchProvider,
  useGlobalSearch,
} from "./state/search-context"
export type { SearchContextValue } from "./state/search-context"
export { GlobalSearchDialog } from "./components/global-search-dialog"
export { createSearchApi, SEARCH_SECTIONS } from "./api/search"
export type { SearchApi } from "./api/search"
export { searchAll } from "./actions"
export type { SearchResults } from "./service"
export { SEARCH_CONFIG } from "./config"
export { normalizeSearchQuery, isSearchableQuery } from "./normalize"
export type {
  SearchFilters,
  SearchItem,
  SearchItemKind,
  SearchMode,
  SearchSection,
  SearchSort,
} from "./types"
export {
  DEFAULT_SEARCH_MEMORY,
  MAX_RECENT_SEARCHES,
  MAX_RECENTLY_OPENED,
  SEARCH_MEMORY_KEY,
  createEmptySearchMemory,
  serializeSearchMemory,
  validateSearchMemory,
} from "./memory/search-memory"
export type { RecentOpenEntry, SearchMemory } from "./memory/search-memory"
