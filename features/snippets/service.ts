import "server-only"

import { randomUUID } from "node:crypto"

import {
  snippetRepository,
  type SnippetFilter,
  type SnippetFilterOptions,
  type SnippetWithRelations,
} from "./repository"
import {
  type CreateSnippetInput,
  type UpdateSnippetInput,
} from "./schemas"
import type { SnippetExportScope } from "./types"

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `${base}-${randomUUID().slice(0, 8)}`
}

export class SnippetNotFoundError extends Error {
  constructor() {
    super("Snippet not found")
    this.name = "SnippetNotFoundError"
  }
}

export type SnippetStats = {
  total: number
  favorites: number
  public: number
  archived: number
  trash: number
  collections: number
  tags: number
}

export const snippetService = {
  listSnippets(
    userId: string,
    filter: SnippetFilter = "all",
    options: SnippetFilterOptions = {},
  ) {
    return snippetRepository.findMany(userId, filter, options)
  },

  async getSnippet(userId: string, id: string) {
    return snippetRepository.findById(userId, id)
  },

  getPublicSnippet(slug: string) {
    return snippetRepository.findPublicBySlug(slug)
  },

  async createSnippet(userId: string, input: CreateSnippetInput) {
    return snippetRepository.create(userId, {
      title: input.title,
      description: input.description ?? null,
      content: input.content,
      language: input.language,
      isPublic: input.isPublic,
      slug: input.isPublic ? slugify(input.title) : null,
      tags: input.tags,
    })
  },

  async updateSnippet(userId: string, input: UpdateSnippetInput) {
    const existing = await snippetRepository.findById(userId, input.id)
    if (!existing) {
      throw new SnippetNotFoundError()
    }

    return snippetRepository.update(userId, input.id, {
      title: input.title,
      description: input.description ?? null,
      content: input.content,
      language: input.language,
      isPublic: input.isPublic,
      slug: input.isPublic ? (existing.slug ?? slugify(input.title)) : null,
      tags: input.tags,
    })
  },

  async deleteSnippet(userId: string, id: string) {
    await snippetRepository.softDelete(userId, id)
  },

  async bulkDeleteSnippets(userId: string, ids: string[]) {
    if (ids.length === 0) return
    await snippetRepository.softDeleteMany(userId, ids)
  },

  async bulkSetFavorite(userId: string, ids: string[], isFavorite: boolean) {
    if (ids.length === 0) return
    await snippetRepository.setFavoriteMany(userId, ids, isFavorite)
  },

  async bulkSetArchived(userId: string, ids: string[], isArchived: boolean) {
    if (ids.length === 0) return
    await snippetRepository.setArchivedMany(userId, ids, isArchived)
  },

  async restoreSnippet(userId: string, id: string) {
    await snippetRepository.restore(userId, id)
  },

  async deleteSnippetForever(userId: string, id: string) {
    await snippetRepository.deleteForever(userId, id)
  },

  async duplicateSnippet(userId: string, id: string) {
    const source = await snippetRepository.findById(userId, id)
    if (!source) {
      throw new SnippetNotFoundError()
    }

    return snippetRepository.create(userId, {
      title: `${source.title} (copy)`,
      description: source.description,
      content: source.content,
      language: source.language,
      isPublic: source.isPublic,
      isFavorite: false,
      isArchived: false,
      slug: source.isPublic ? slugify(`${source.title} copy`) : null,
    })
  },

  async toggleFavorite(userId: string, id: string) {
    const snippet = await snippetRepository.findById(userId, id)
    if (!snippet) {
      throw new SnippetNotFoundError()
    }

    return snippetRepository.setFavorite(userId, id, !snippet.isFavorite)
  },

  async toggleArchive(userId: string, id: string) {
    const snippet = await snippetRepository.findById(userId, id)
    if (!snippet) {
      throw new SnippetNotFoundError()
    }

    return snippetRepository.setArchived(userId, id, !snippet.isArchived)
  },

  async setVisibility(userId: string, id: string, isPublic: boolean) {
    const snippet = await snippetRepository.findById(userId, id)
    if (!snippet) {
      throw new SnippetNotFoundError()
    }

    const slug = isPublic ? (snippet.slug ?? slugify(snippet.title)) : null
    return snippetRepository.setPublic(userId, id, { isPublic, slug })
  },

  async getSnippetsExport(userId: string, scope: SnippetExportScope) {
    const snippets = await snippetRepository.findMany(userId, scope)
    return snippets.map((snippet) => ({
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      tags: snippet.tags.map(({ tag }) => tag.name),
      content: snippet.content,
      visibility: snippet.isPublic ? "public" : "private",
      isFavorite: snippet.isFavorite,
      isArchived: snippet.isArchived,
      createdAt: snippet.createdAt.toISOString(),
      updatedAt: snippet.updatedAt.toISOString(),
    }))
  },

  async getDashboardStats(userId: string): Promise<SnippetStats> {
    const [
      total,
      favorites,
      publicCount,
      archived,
      trash,
      collections,
      tags,
    ] = await snippetRepository.stats(userId)

    return { total, favorites, public: publicCount, archived, trash, collections, tags }
  },
}

export type { SnippetFilter, SnippetWithRelations }
