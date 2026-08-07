export function filterItems<T>(
  items: T[],
  predicates: Array<(item: T) => boolean>,
): T[] {
  return items.filter((item) => predicates.every((predicate) => predicate(item)))
}
