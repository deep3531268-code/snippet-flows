import type { Prisma } from "@prisma/client"

export function containsFilter(query: string): Prisma.StringFilter {
  return { contains: query, mode: "insensitive" }
}

export function matchAny<T extends object>(
  query: string,
  fields: readonly (keyof T)[],
): Array<Partial<T>> {
  const filter = containsFilter(query)
  return fields.map(
    (field) => ({ [field]: filter }) as unknown as Partial<T>,
  )
}
