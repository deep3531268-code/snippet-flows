import "server-only"

import type { Cursor, CursorValue } from "./types"

export function encodeCursor(values: CursorValue[]): string {
  return Buffer.from(JSON.stringify({ v: values })).toString("base64url")
}

export function decodeCursor(raw: string | null): Cursor | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"))
    if (!parsed || !Array.isArray(parsed.v)) return null
    return { values: parsed.v as CursorValue[] }
  } catch {
    return null
  }
}
