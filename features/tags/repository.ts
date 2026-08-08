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

const PAGE_SORT_ORDER: Record<TagSort, Prisma.TagOrderByWithRelationInput[]> = {
  updated: [{ createdAt: "desc" }, { id: "desc" }],
  created: [{ createdAt: "desc" }, { id: "desc" }],
  az: [{ name: "asc" }, { id: "asc" }],
  za: [{ name: "desc" }, { id: "desc" }],
  count: [{ snippets: { _count: "desc" } }, { id: "desc" }],
}

const PAGE_SORT_FIELDS: Record<TagSort, CursorField[]> = {
  updated: [
    { key: "createdAt", column: "createdAt", direction: "desc" },
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
  options: TagFilterOptions = {},
): Prisma.TagWhereInput {
  const conditions: Prisma.TagWhereInput[] = [{ userId }]
  if (options.query) conditions.push(searchWhere(options.query))
  return conditions.length === 1 ? conditions[0] : { AND: conditions }
}

export const tagRepository = {
  findMany(userId: string, options: TagFilterOptions = {}) {
    return prisma.tag.findMany({
      where: buildWhere(userId, options),
      include: tagInclude,
      orderBy: SORT_ORDER[options.sort ?? "updated"],
    })
  },

  findPage(
    userId: string,
    options: TagFilterOptions = {},
    cursor: Cursor | null = null,
  ): Promise<Page<TagWithRelations>> {
    const sort = options.sort ?? "updated"
    return loadPage({
      where: buildWhere(userId, options),
      orderBy: PAGE_SORT_ORDER[sort],
      cursorFields: PAGE_SORT_FIELDS[sort],
      cursor,
      pageSize: PAGINATION_CONFIG.tagPageSize,
      findMany: (args) =>
        prisma.tag.findMany({ ...args, include: tagInclude }),
    })
  },

  count(userId: string, options: TagFilterOptions = {}) {
    return prisma.tag.count({
      where: buildWhere(userId, options),
    })
  },

  findNames(userId: string) {
    return prisma.tag.findMany({
      where: { userId },
      select: { name: true },
      orderBy: { name: "asc" },
    })
  },

  findById(userId: string, id: string) {
    return prisma.tag.findFirst({
      where: { id, userId },
      include: tagInclude,
    })
  },

  findByIds(userId: string, ids: string[]) {
    return prisma.tag.findMany({
      where: { id: { in: ids }, userId },
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

  deleteMany(userId: string, ids: string[]) {
    return prisma.tag.deleteMany({
      where: { id: { in: ids }, userId },
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
