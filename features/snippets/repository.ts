import "server-only"

import { prisma } from "@/lib/prisma"
import { PAGINATION_CONFIG } from "@/features/shared/pagination/config"
import { loadPage } from "@/features/shared/pagination/load-page"
import type { Cursor, CursorField, Page } from "@/features/shared/pagination/types"
import type { Prisma } from "@prisma/client"
import type { SnippetSort } from "./types"

export type SnippetFilter = "all" | "favorites" | "archived" | "trash"

const snippetInclude = {
  tags: {
    select: { tag: { select: { id: true, name: true } } },
  },
  collections: {
    select: { collection: { select: { id: true, name: true } } },
  },
} satisfies Prisma.SnippetInclude

export type SnippetWithRelations = Prisma.SnippetGetPayload<{
  include: typeof snippetInclude
}>

type CreateData = {
  title: string
  description: string | null
  content: string
  language: string
  isPublic: boolean
  isFavorite?: boolean
  isArchived?: boolean
  slug?: string | null
  tags?: string[]
}

type UpdateData = Omit<CreateData, "isFavorite" | "isArchived">

function filterWhere(userId: string, filter: SnippetFilter): Prisma.SnippetWhereInput {
  switch (filter) {
    case "favorites":
      return { userId, deletedAt: null, isArchived: false, isFavorite: true }
    case "archived":
      return { userId, deletedAt: null, isArchived: true }
    case "trash":
      return { userId, deletedAt: { not: null } }
    default:
      return { userId, deletedAt: null, isArchived: false }
  }
}

function searchWhere(query: string): Prisma.SnippetWhereInput {
  return {
    OR: [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { language: { contains: query, mode: "insensitive" } },
      {
        tags: {
          some: { tag: { name: { contains: query, mode: "insensitive" } } },
        },
      },
    ],
  }
}

export type SnippetFilterOptions = {
  query?: string
  language?: string
  tag?: string
  visibility?: "public" | "private"
  recentlyUpdated?: boolean
  favoritesOnly?: boolean
  sort?: SnippetSort
}

const RECENTLY_UPDATED_DAYS = 7

function recentWhere(): Prisma.SnippetWhereInput {
  const since = new Date(
    Date.now() - RECENTLY_UPDATED_DAYS * 24 * 60 * 60 * 1000,
  )
  return { updatedAt: { gte: since } }
}

const SORT_ORDER: Record<
  SnippetSort,
  Prisma.SnippetOrderByWithRelationInput[]
> = {
  updated: [{ isFavorite: "desc" }, { updatedAt: "desc" }],
  created: [{ isFavorite: "desc" }, { createdAt: "desc" }],
  oldest: [{ isFavorite: "desc" }, { createdAt: "asc" }],
  az: [{ isFavorite: "desc" }, { title: "asc" }],
  za: [{ isFavorite: "desc" }, { title: "desc" }],
  language: [{ isFavorite: "desc" }, { language: "asc" }],
}

// Server-side list ordering: matches the client's displayed order (pure sort on
// the selected key) with a stable id tiebreaker for keyset pagination.
const PAGE_SORT_ORDER: Record<
  SnippetSort,
  Prisma.SnippetOrderByWithRelationInput[]
> = {
  updated: [{ updatedAt: "desc" }, { id: "desc" }],
  created: [{ createdAt: "desc" }, { id: "desc" }],
  oldest: [{ createdAt: "asc" }, { id: "asc" }],
  az: [{ title: "asc" }, { id: "asc" }],
  za: [{ title: "desc" }, { id: "desc" }],
  language: [{ language: "asc" }, { id: "asc" }],
}

const PAGE_SORT_FIELDS: Record<SnippetSort, CursorField[]> = {
  updated: [
    { key: "updatedAt", column: "updatedAt", direction: "desc" },
    { key: "id", column: "id", direction: "desc" },
  ],
  created: [
    { key: "createdAt", column: "createdAt", direction: "desc" },
    { key: "id", column: "id", direction: "desc" },
  ],
  oldest: [
    { key: "createdAt", column: "createdAt", direction: "asc" },
    { key: "id", column: "id", direction: "asc" },
  ],
  az: [
    { key: "title", column: "title", direction: "asc" },
    { key: "id", column: "id", direction: "asc" },
  ],
  za: [
    { key: "title", column: "title", direction: "desc" },
    { key: "id", column: "id", direction: "desc" },
  ],
  language: [
    { key: "language", column: "language", direction: "asc" },
    { key: "id", column: "id", direction: "asc" },
  ],
}

function buildWhere(
  userId: string,
  filter: SnippetFilter,
  options: SnippetFilterOptions = {},
  scope?: Prisma.SnippetWhereInput,
): Prisma.SnippetWhereInput {
  const conditions: Prisma.SnippetWhereInput[] = [filterWhere(userId, filter)]
  if (options.query) conditions.push(searchWhere(options.query))
  if (options.language) conditions.push({ language: options.language })
  if (options.visibility) {
    conditions.push({ isPublic: options.visibility === "public" })
  }
  if (options.recentlyUpdated) conditions.push(recentWhere())
  if (options.tag) {
    conditions.push({ tags: { some: { tag: { name: options.tag } } } })
  }
  if (options.favoritesOnly) conditions.push({ isFavorite: true })
  if (scope) conditions.push(scope)

  return conditions.length === 1 ? conditions[0] : { AND: conditions }
}

async function resolveTags(userId: string, names: string[]) {
  const unique = [...new Set(names.map((name) => name.trim()).filter(Boolean))]
  if (unique.length === 0) return []
  const tags = await Promise.all(
    unique.map((name) =>
      prisma.tag.upsert({
        where: { userId_name: { userId, name } },
        update: {},
        create: { userId, name },
      }),
    ),
  )
  return tags.map((tag) => tag.id)
}

function connectTags(
  tagIds: string[],
): Prisma.SnippetsOnTagsUncheckedCreateWithoutSnippetInput[] {
  return tagIds.map((tagId) => ({ tagId }))
}

export const snippetRepository = {
  findMany(
    userId: string,
    filter: SnippetFilter,
    options: SnippetFilterOptions = {},
  ) {
    return prisma.snippet.findMany({
      where: buildWhere(userId, filter, options),
      include: snippetInclude,
      orderBy: SORT_ORDER[options.sort ?? "updated"],
    })
  },

  findPage(
    userId: string,
    filter: SnippetFilter,
    options: SnippetFilterOptions = {},
    cursor: Cursor | null = null,
    scope?: Prisma.SnippetWhereInput,
  ): Promise<Page<SnippetWithRelations>> {
    const sort = options.sort ?? "updated"
    return loadPage({
      where: buildWhere(userId, filter, options, scope),
      orderBy: PAGE_SORT_ORDER[sort],
      cursorFields: PAGE_SORT_FIELDS[sort],
      cursor,
      pageSize: PAGINATION_CONFIG.snippetPageSize,
      findMany: (args) =>
        prisma.snippet.findMany({ ...args, include: snippetInclude }),
    })
  },

  findByCollectionPage(
    userId: string,
    collectionId: string,
    options: SnippetFilterOptions = {},
    cursor: Cursor | null = null,
  ) {
    return this.findPage(userId, "all", options, cursor, {
      collections: {
        some: { collectionId, collection: { userId } },
      },
    })
  },

  findByTagPage(
    userId: string,
    tagId: string,
    options: SnippetFilterOptions = {},
    cursor: Cursor | null = null,
  ) {
    return this.findPage(userId, "all", options, cursor, {
      tags: {
        some: { tagId, tag: { userId } },
      },
    })
  },

  count(
    userId: string,
    filter: SnippetFilter,
    options: SnippetFilterOptions = {},
  ) {
    return prisma.snippet.count({
      where: buildWhere(userId, filter, options),
    })
  },

  findById(userId: string, id: string) {
    return prisma.snippet.findFirst({
      where: { id, userId },
      include: snippetInclude,
    })
  },

  findManyByIds(userId: string, ids: string[]) {
    return prisma.snippet.findMany({
      where: { id: { in: ids }, userId },
      include: snippetInclude,
    })
  },

  findPublicBySlug(slug: string) {
    return prisma.snippet.findFirst({
      where: { slug, isPublic: true, deletedAt: null },
      include: snippetInclude,
    })
  },

  async create(userId: string, data: CreateData) {
    const { tags, ...rest } = data
    const tagIds = tags ? await resolveTags(userId, tags) : []
    return prisma.snippet.create({
      data: {
        ...rest,
        userId,
        ...(tagIds.length > 0
          ? { tags: { create: connectTags(tagIds) } }
          : {}),
      },
    })
  },

  async update(userId: string, id: string, data: UpdateData) {
    const { tags, ...rest } = data
    const tagIds = tags ? await resolveTags(userId, tags) : []
    return prisma.snippet.update({
      where: { id, userId },
      data: {
        ...rest,
        ...(tags
          ? { tags: { deleteMany: {}, create: connectTags(tagIds) } }
          : {}),
      },
    })
  },

  softDelete(userId: string, id: string) {
    return prisma.snippet.update({
      where: { id, userId },
      data: { deletedAt: new Date() },
    })
  },

  softDeleteMany(userId: string, ids: string[]) {
    return prisma.snippet.updateMany({
      where: { id: { in: ids }, userId },
      data: { deletedAt: new Date() },
    })
  },

  restore(userId: string, id: string) {
    return prisma.snippet.update({
      where: { id, userId },
      data: { deletedAt: null },
    })
  },

  deleteForever(userId: string, id: string) {
    return prisma.snippet.delete({
      where: { id, userId },
    })
  },

  setFavorite(userId: string, id: string, isFavorite: boolean) {
    return prisma.snippet.update({
      where: { id, userId },
      data: { isFavorite },
    })
  },

  setFavoriteMany(userId: string, ids: string[], isFavorite: boolean) {
    return prisma.snippet.updateMany({
      where: { id: { in: ids }, userId, deletedAt: null },
      data: { isFavorite },
    })
  },

  setArchivedMany(userId: string, ids: string[], isArchived: boolean) {
    return prisma.snippet.updateMany({
      where: { id: { in: ids }, userId, deletedAt: null },
      data: { isArchived },
    })
  },

  setArchived(userId: string, id: string, isArchived: boolean) {
    return prisma.snippet.update({
      where: { id, userId },
      data: { isArchived },
    })
  },

  setPublic(
    userId: string,
    id: string,
    data: { isPublic: boolean; slug: string | null },
  ) {
    return prisma.snippet.update({
      where: { id, userId },
      data,
    })
  },

  setCollections(snippetId: string, collectionIds: string[]) {
    return prisma.$transaction([
      prisma.snippetsOnCollections.deleteMany({ where: { snippetId } }),
      prisma.snippetsOnCollections.createMany({
        data: collectionIds.map((collectionId) => ({ snippetId, collectionId })),
        skipDuplicates: true,
      }),
    ])
  },

  findByCollection(userId: string, collectionId: string) {
    return prisma.snippet.findMany({
      where: {
        userId,
        deletedAt: null,
        isArchived: false,
        collections: { some: { collectionId } },
      },
      include: snippetInclude,
      orderBy: [{ isFavorite: "desc" }, { updatedAt: "desc" }],
    })
  },

  findByTag(userId: string, tagId: string) {
    return prisma.snippet.findMany({
      where: {
        userId,
        deletedAt: null,
        isArchived: false,
        tags: { some: { tagId } },
      },
      include: snippetInclude,
      orderBy: [{ isFavorite: "desc" }, { updatedAt: "desc" }],
    })
  },

  findIdsByIds(userId: string, ids: string[]) {
    return prisma.snippet.findMany({
      where: { id: { in: ids }, userId },
      select: { id: true },
    })
  },

  findOptions(userId: string) {
    return prisma.snippet.findMany({
      where: { userId, deletedAt: null, isArchived: false },
      select: {
        id: true,
        title: true,
        description: true,
        language: true,
      },
      orderBy: { updatedAt: "desc" },
    })
  },

  stats(userId: string) {
    return Promise.all([
      prisma.snippet.count({ where: { userId, deletedAt: null, isArchived: false } }),
      prisma.snippet.count({
        where: { userId, deletedAt: null, isArchived: false, isFavorite: true },
      }),
      prisma.snippet.count({
        where: { userId, deletedAt: null, isArchived: false, isPublic: true },
      }),
      prisma.snippet.count({ where: { userId, deletedAt: null, isArchived: true } }),
      prisma.snippet.count({ where: { userId, deletedAt: { not: null } } }),
      prisma.collection.count({ where: { userId } }),
      prisma.tag.count({ where: { userId } }),
    ])
  },
}
