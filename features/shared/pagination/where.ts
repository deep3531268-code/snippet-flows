import "server-only"

import type { Cursor, CursorField, CursorValue } from "./types"

type Comparison = "lt" | "gt" | "equals"

// Builds a single comparison for one cursor field. Supports scalar columns and
// relation-count columns (`snippets: { _count: { ... } }`).
function fieldCondition(
  field: CursorField,
  operation: Comparison,
  value: CursorValue,
): Record<string, unknown> {
  if (field.relationCount) {
    return { [field.relationCount]: { _count: { [operation]: value } } }
  }
  const column = field.column ?? field.key
  if (operation === "equals") return { [column]: value }
  return { [column]: { [operation]: value } }
}

// Keyset/seek predicate for "rows after the given cursor" using the same ordered
// fields as the query's orderBy. For descending order the boundary is `<`, for
// ascending it is `>`, with tie-break equality chaining down the field list.
export function buildCursorWhere(
  fields: CursorField[],
  cursor: Cursor,
): Record<string, unknown> {
  const or: Record<string, unknown>[] = []
  for (let i = 0; i < fields.length; i++) {
    const and: Record<string, unknown>[] = []
    for (let j = 0; j < i; j++) {
      and.push(fieldCondition(fields[j], "equals", cursor.values[j]))
    }
    const operation = fields[i].direction === "desc" ? "lt" : "gt"
    and.push(fieldCondition(fields[i], operation, cursor.values[i]))
    or.push(and.length === 1 ? and[0] : { AND: and })
  }
  return { OR: or }
}
