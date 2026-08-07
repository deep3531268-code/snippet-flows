import "server-only"

import { prisma } from "@/lib/prisma"
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

export const collectionRepository = {
  findMany(userId: string, options: CollectionFilterOptions = {}) {
    const conditions: Prisma.CollectionWhereInput[] = [{ userId }]
    if (options.query) conditions.push(searchWhere(options.query))

    return prisma.collection.findMany({
      where:
        conditions.length === 1 ? conditions[0] : { AND: conditions },
      include: collectionInclude,
      orderBy: SORT_ORDER[options.sort ?? "updated"],
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
