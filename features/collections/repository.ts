import "server-only"

import { prisma } from "@/lib/prisma"
import { PAGINATION_CONFIG } from "@/features/shared/pagination/config"
import { loadPage } from "@/features/shared/pagination/load-page"
import type {
  Cursor,
  CursorField,
  Page,
} from "@/features/shared/pagination/types"
import type { Prisma } from "@prisma/client"
import type { CollectionSort } from "./types"

const collectionInclude = {
  _count: {
    select: { snippets: true },
  },
} satisfies Prisma.CollectionInclude

export type CollectionWithRelations = Prisma.CollectionGetPayload<{
  include: typeof collectionInclude
}>

type CreateData = {
  name: string
  description: string | null
}

type UpdateData = Partial<CreateData>

function searchWhere(query: string): Prisma.CollectionWhereInput {
  return {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ],
  }
}

export type CollectionFilterOptions = {
  query?: string
  sort?: CollectionSort
}

const SORT_ORDER: Record<CollectionSort, Prisma.CollectionOrderByWithRelationInput[]> =
  {
    updated: [{ updatedAt: "desc" }],
    created: [{ createdAt: "desc" }],
    az: [{ name: "asc" }],
    za: [{ name: "desc" }],
    count: [{ snippets: { _count: "desc" } }],
  }

const PAGE_SORT_ORDER: Record<
  CollectionSort,
  Prisma.CollectionOrderByWithRelationInput[]
> = {
  updated: [{ updatedAt: "desc" }, { id: "desc" }],
  created: [{ createdAt: "desc" }, { id: "desc" }],
  az: [{ name: "asc" }, { id: "asc" }],
  za: [{ name: "desc" }, { id: "desc" }],
  count: [{ snippets: { _count: "desc" } }, { id: "desc" }],
}

const PAGE_SORT_FIELDS: Record<CollectionSort, CursorField[]> = {
  updated: [
    { key: "updatedAt", column: "updatedAt", direction: "desc" },
    { key: "id", column: "id", direction: "desc" },
  ],
  created: [
    { key: "createdAt", column: "createdAt", direction: "desc" },
    { key: "id", column: "id", direction: "desc" },
  ],
  az: [
    { key: "name", column: "name", direction: "asc" },
    { key: "id", column: "id", direction: "asc" },
  ],
  za: [
    { key: "name", column: "name", direction: "desc" },
    { key: "id", column: "id", direction: "desc" },
  ],
  count: [
    { key: "count", relationCount: "snippets", direction: "desc" },
    { key: "id", column: "id", direction: "desc" },
  ],
}

function buildWhere(
  userId: string,
  options: CollectionFilterOptions = {},
): Prisma.CollectionWhereInput {
  const conditions: Prisma.CollectionWhereInput[] = [{ userId }]
  if (options.query) conditions.push(searchWhere(options.query))
  return conditions.length === 1 ? conditions[0] : { AND: conditions }
}

export const collectionRepository = {
  findMany(userId: string, options: CollectionFilterOptions = {}) {
    return prisma.collection.findMany({
      where: buildWhere(userId, options),
      include: collectionInclude,
      orderBy: SORT_ORDER[options.sort ?? "updated"],
    })
  },

  findPage(
    userId: string,
    options: CollectionFilterOptions = {},
    cursor: Cursor | null = null,
  ): Promise<Page<CollectionWithRelations>> {
    const sort = options.sort ?? "updated"
    return loadPage({
      where: buildWhere(userId, options),
      orderBy: PAGE_SORT_ORDER[sort],
      cursorFields: PAGE_SORT_FIELDS[sort],
      cursor,
      pageSize: PAGINATION_CONFIG.collectionPageSize,
      findMany: (args) =>
        prisma.collection.findMany({ ...args, include: collectionInclude }),
    })
  },

  count(userId: string, options: CollectionFilterOptions = {}) {
    return prisma.collection.count({
      where: buildWhere(userId, options),
    })
  },

  findById(userId: string, id: string) {
    return prisma.collection.findFirst({
      where: { id, userId },
      include: collectionInclude,
    })
  },

  findByIds(userId: string, ids: string[]) {
    return prisma.collection.findMany({
      where: { id: { in: ids }, userId },
    })
  },

  create(userId: string, data: CreateData) {
    return prisma.collection.create({
      data: { ...data, userId },
    })
  },

  update(userId: string, id: string, data: UpdateData) {
    return prisma.collection.update({
      where: { id, userId },
      data,
    })
  },

  delete(userId: string, id: string) {
    return prisma.collection.delete({
      where: { id, userId },
    })
  },

  deleteMany(userId: string, ids: string[]) {
    return prisma.collection.deleteMany({
      where: { id: { in: ids }, userId },
    })
  },

  findIdsByIds(userId: string, ids: string[]) {
    return prisma.collection.findMany({
      where: { id: { in: ids }, userId },
      select: { id: true },
    })
  },

  attachSnippets(collectionId: string, snippetIds: string[]) {
    return prisma.snippetsOnCollections.createMany({
      data: snippetIds.map((snippetId) => ({ collectionId, snippetId })),
      skipDuplicates: true,
    })
  },

  detachSnippet(collectionId: string, snippetId: string) {
    return prisma.snippetsOnCollections.deleteMany({
      where: { collectionId, snippetId },
    })
  },
}
