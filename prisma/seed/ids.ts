import { createHash } from "node:crypto"

// Deterministic UUID v5-style id derived from a namespace and value. Reusing
// the same (namespace, value) pair always yields the same id, which keeps the
// seed idempotent without touching the database.
export function uuidFromSeed(namespace: string, value: string): string {
  const hash = createHash("sha256").update(`${namespace}:${value}`).digest()
  hash[6] = (hash[6] & 0x0f) | 0x50
  hash[8] = (hash[8] & 0x3f) | 0x80
  const bytes = hash.subarray(0, 16)
  const hex = bytes.toString("hex")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
