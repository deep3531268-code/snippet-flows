import "server-only"

import type { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

import { SEARCH_CONFIG } from "./config"
import { matchAny } from "./predicates"
import { rankByRelevance } from "./ranking"

const SNIPPET_SEARCH_FIELDS: readonly (keyof Prisma.SnippetWhereInput)[] = [
  "title",
  "description",
  "content",
  "language",
]

const COLLECTION_SEARCH_FIELDS: readonly (keyof Prisma.CollectionWhereInput)[] = [
  "name",
  "description",
]

const TAG_SEARCH_FIELDS: readonly (keyof Prisma.TagWhereInput)[] = ["name"]

function snippetWhere(
  userId: string,
  query: string,
): Prisma.SnippetWhereInput {
  return {
    userId,
    deletedAt: null,
    isArchived: false,
    OR: matchAny(query, SNIPPET_SEARCH_FIELDS),
  }
}

function collectionWhere(
  userId: string,
  query: string,
): Prisma.CollectionWhereInput {
  return {
    userId,
    OR: matchAny(query, COLLECTION_SEARCH_FIELDS),
  }
}

function tagWhere(userId: string, query: string): Prisma.TagWhereInput {
  return {
    userId,
    OR: matchAny(query, TAG_SEARCH_FIELDS),
  }
}

const snippetSelect = {
  id: true,
  title: true,
  description: true,
  language: true,
  content: true,
  updatedAt: true,
  createdAt: true,
} as const

const collectionSelect = {
  id: true,
  name: true,
  description: true,
  _count: { select: { snippets: true } },
  updatedAt: true,
  createdAt: true,
} as const

const tagSelect = {
  id: true,
  name: true,
  _count: { select: { snippets: true } },
  createdAt: true,
} as const

export const searchRepository = {
  async findSnippets(userId: string, query: string) {
    const rows = await prisma.snippet.findMany({
      where: snippetWhere(userId, query),
      select: snippetSelect,
      orderBy: { updatedAt: "desc" },
      take: SEARCH_CONFIG.limits.snippets,
    })
    return rankByRelevance(query, rows, (snippet) => ({
      title: snippet.title,
      description: snippet.description,
      content: snippet.content,
      updatedAt: snippet.updatedAt,
      createdAt: snippet.createdAt,
    }))
  },

  async findCollections(userId: string, query: string) {
    const rows = await prisma.collection.findMany({
      where: collectionWhere(userId, query),
      select: collectionSelect,
      orderBy: { updatedAt: "desc" },
      take: SEARCH_CONFIG.limits.collections,
    })
    return rankByRelevance(query, rows, (collection) => ({
      title: collection.name,
      description: collection.description,
      updatedAt: collection.updatedAt,
      createdAt: collection.createdAt,
    }))
  },

  async findTags(userId: string, query: string) {
    const rows = await prisma.tag.findMany({
      where: tagWhere(userId, query),
      select: tagSelect,
      orderBy: { createdAt: "desc" },
      take: SEARCH_CONFIG.limits.tags,
    })
    return rankByRelevance(query, rows, (tag) => ({
      title: tag.name,
      createdAt: tag.createdAt,
    }))
  },
}
