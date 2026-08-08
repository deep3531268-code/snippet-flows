// Shared cursor pagination contract. All scoped list/detail queries return a
// Page<T> so the UI only ever receives the current page and loads more on demand.

export type CursorValue = string | number | boolean | null

export type Cursor = {
  values: CursorValue[]
}

export type Page<T> = {
  items: T[]
  nextCursor: string | null
  hasMore: boolean
}

// Ordered keyset descriptor. Each entry aligns with one orderBy term and the
// corresponding cursor value. Either `column` (scalar column on the row) or
// `relationCount` (relation whose count is ordered by, e.g. snippet counts).
export type CursorField = {
  key: string
  direction: "asc" | "desc"
  column?: string
  relationCount?: string
}
