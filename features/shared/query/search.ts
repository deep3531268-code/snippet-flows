export function searchItems<T>(
  items: T[],
  query: string,
  getText: (item: T) => string,
): T[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return items
  return items.filter((item) =>
    getText(item).toLowerCase().includes(needle),
  )
}
