import "server-only"

import type { Cursor, CursorField, CursorValue, Page } from "./types"
import { encodeCursor } from "./cursor"
import { buildCursorWhere } from "./where"

export class InvalidCursorError extends Error {
  constructor() {
    super("Invalid pagination cursor")
    this.name = "InvalidCursorError"
  }
}

type LoadPageArgs<T, W, O> = {
  where: W
  orderBy: O
  cursorFields: CursorField[]
  cursor: Cursor | null
  pageSize: number
  findMany: (args: { where: W; orderBy: O; take: number }) => Promise<T[]>
}

function extractValue(
  row: Record<string, unknown>,
  field: CursorField,
): CursorValue {
  if (field.relationCount) {
    const count = (row._count as Record<string, unknown> | undefined)?.[
      field.relationCount
    ]
    return typeof count === "number" ? count : 0
  }
  const value = row[field.column ?? field.key]
  if (value instanceof Date) return value.toISOString()
  return value as CursorValue
}

// Bounded keyset loader: fetches pageSize + 1 rows, derives hasMore, and encodes
// the next cursor from the last row's sort values.
export async function loadPage<T, W, O>(
  args: LoadPageArgs<T, W, O>,
): Promise<Page<T>> {
  if (args.cursor && args.cursor.values.length !== args.cursorFields.length) {
    throw new InvalidCursorError()
  }

  const cursorWhere = args.cursor
    ? (buildCursorWhere(args.cursorFields, args.cursor) as W)
    : null
  const where = cursorWhere
    ? ({ AND: [args.where, cursorWhere] } as W)
    : args.where

  const rows = await args.findMany({
    where,
    orderBy: args.orderBy,
    take: args.pageSize + 1,
  })

  const hasMore = rows.length > args.pageSize
  const items = hasMore ? rows.slice(0, args.pageSize) : rows
  const last = items[items.length - 1]
  const nextCursor =
    hasMore && last
      ? encodeCursor(
          args.cursorFields.map((field) =>
            extractValue(last as Record<string, unknown>, field),
          ),
        )
      : null

  return { items, nextCursor, hasMore }
}
