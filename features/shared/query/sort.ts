export type SortComparator<T> = (a: T, b: T) => number

export type SortConfig<T> = {
  value: string
  compare: SortComparator<T>
}[]

export function sortItems<T>(
  items: T[],
  config: SortConfig<T>,
  sort: string,
): T[] {
  const active = config.find((option) => option.value === sort) ?? config[0]
  const list = [...items]
  return list.sort(active.compare)
}
