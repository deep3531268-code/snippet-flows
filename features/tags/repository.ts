import "server-only"

import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import type { TagSort } from "./types"

const tagInclude = {
  _count: {
    select: { snippets: true },
  },
} satisfies Prisma.TagInclude

export type TagWithRelations = Prisma.TagGetPayload<{
  include: typeof tagInclude
}>

type CreateData = {
  name: string
}

type UpdateData = Partial<CreateData>

function searchWhere(query: string): Prisma.TagWhereInput {
  return {
    name: { contains: query, mode: "insensitive" },
  }
}

export type TagFilterOptions = {
  query?: string
  sort?: TagSort
}

const SORT_ORDER: Record<TagSort, Prisma.TagOrderByWithRelationInput[]> = {
  updated: [{ createdAt: "desc" }],
  created: [{ createdAt: "desc" }],
  az: [{ name: "asc" }],
  za: [{ name: "desc" }],
  count: [{ snippets: { _count: "desc" } }],
}

export const tagRepository = {
  findMany(userId: string, options: TagFilterOptions = {}) {
    const conditions: Prisma.TagWhereInput[] = [{ userId }]
    if (options.query) conditions.push(searchWhere(options.query))

    return prisma.tag.findMany({
      where:
        conditions.length === 1 ? conditions[0] : { AND: conditions },
      include: tagInclude,
      orderBy: SORT_ORDER[options.sort ?? "updated"],
    })
  },

  findById(userId: string, id: string) {
    return prisma.tag.findFirst({
      where: { id, userId },
      include: tagInclude,
    })
  },

  create(userId: string, data: CreateData) {
    return prisma.tag.create({
      data: { ...data, userId },
    })
  },

  update(userId: string, id: string, data: UpdateData) {
    return prisma.tag.update({
      where: { id, userId },
      data,
    })
  },

  delete(userId: string, id: string) {
    return prisma.tag.delete({
      where: { id, userId },
    })
  },

  attachSnippets(tagId: string, snippetIds: string[]) {
    return prisma.snippetsOnTags.createMany({
      data: snippetIds.map((snippetId) => ({ tagId, snippetId })),
      skipDuplicates: true,
    })
  },

  detachSnippet(tagId: string, snippetId: string) {
    return prisma.snippetsOnTags.deleteMany({
      where: { tagId, snippetId },
    })
  },
}
