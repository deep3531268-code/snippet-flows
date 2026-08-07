export type HighlightPart = { value: string; match: boolean }

export function highlightParts(text: string, query: string): HighlightPart[] {
  const needle = query.trim().toLowerCase()
  if (!needle || !text) return [{ value: text, match: false }]

  const parts: HighlightPart[] = []
  const lower = text.toLowerCase()
  let index = 0

  while (index < text.length) {
    const at = lower.indexOf(needle, index)
    if (at === -1) {
      parts.push({ value: text.slice(index), match: false })
      break
    }
    if (at > index) {
      parts.push({ value: text.slice(index, at), match: false })
    }
    parts.push({ value: text.slice(at, at + needle.length), match: true })
    index = at + needle.length
  }

  return parts
}
