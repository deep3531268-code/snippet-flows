import "server-only"

import { snippetRepository } from "@/features/snippets/repository"
import { SnippetNotFoundError } from "@/features/snippets/service"
import type { Cursor } from "@/features/shared/pagination/types"
import {
  collectionRepository,
  type CollectionFilterOptions,
  type CollectionWithRelations,
} from "./repository"
import {
  type CreateCollectionInput,
  type UpdateCollectionInput,
} from "./schemas"

export class CollectionNotFoundError extends Error {
  constructor() {
    super("Collection not found")
    this.name = "CollectionNotFoundError"
  }
}

export const collectionService = {
  listCollections(
    userId: string,
    options: CollectionFilterOptions = {},
  ) {
    return collectionRepository.findMany(userId, options)
  },

  listCollectionsPage(
    userId: string,
    options: CollectionFilterOptions = {},
    cursor: Cursor | null = null,
  ) {
    return collectionRepository.findPage(userId, options, cursor)
  },

  countCollections(
    userId: string,
    options: CollectionFilterOptions = {},
  ) {
    return collectionRepository.count(userId, options)
  },

  async getCollection(userId: string, id: string) {
    return collectionRepository.findById(userId, id)
  },

  async createCollection(userId: string, input: CreateCollectionInput) {
    return collectionRepository.create(userId, {
      name: input.name,
      description: input.description ?? null,
    })
  },

  async updateCollection(userId: string, input: UpdateCollectionInput) {
    const existing = await collectionRepository.findById(userId, input.id)
    if (!existing) {
      throw new CollectionNotFoundError()
    }

    return collectionRepository.update(userId, input.id, {
      name: input.name,
      description: input.description ?? null,
    })
  },

  async deleteCollection(userId: string, id: string) {
    return collectionRepository.delete(userId, id)
  },

  async deleteCollections(userId: string, ids: string[]) {
    const collections = await collectionRepository.findByIds(userId, ids)
    await collectionRepository.deleteMany(userId, ids)
    return collections
  },

  async duplicateCollections(userId: string, ids: string[]) {
    const sources = await collectionRepository.findByIds(userId, ids)
    return Promise.all(
      sources.map((source) =>
        collectionRepository.create(userId, {
          name: `${source.name} (copy)`,
          description: source.description,
        }),
      ),
    )
  },

  async duplicateCollection(userId: string, id: string) {
    const source = await collectionRepository.findById(userId, id)
    if (!source) {
      throw new CollectionNotFoundError()
    }

    return collectionRepository.create(userId, {
      name: `${source.name} (copy)`,
      description: source.description,
    })
  },

  async setSnippetCollections(
    userId: string,
    snippetId: string,
    collectionIds: string[],
  ) {
    const snippet = await snippetRepository.findById(userId, snippetId)
    if (!snippet) {
      throw new SnippetNotFoundError()
    }

    const owned = await collectionRepository.findIdsByIds(userId, collectionIds)
    await snippetRepository.setCollections(
      snippetId,
      owned.map((collection) => collection.id),
    )
  },

  async addSnippetsToCollection(
    userId: string,
    collectionId: string,
    snippetIds: string[],
  ) {
    const collection = await collectionRepository.findById(userId, collectionId)
    if (!collection) {
      throw new CollectionNotFoundError()
    }

    const owned = await snippetRepository.findIdsByIds(userId, snippetIds)
    await collectionRepository.attachSnippets(
      collectionId,
      owned.map((snippet) => snippet.id),
    )
  },

  async removeSnippetFromCollection(
    userId: string,
    collectionId: string,
    snippetId: string,
  ) {
    const collection = await collectionRepository.findById(userId, collectionId)
    if (!collection) {
      throw new CollectionNotFoundError()
    }

    await collectionRepository.detachSnippet(collectionId, snippetId)
  },

  async getCollectionSnippets(
    userId: string,
    collectionId: string,
    collection?: CollectionWithRelations,
  ) {
    const owned =
      collection ?? (await collectionRepository.findById(userId, collectionId))
    if (!owned) {
      throw new CollectionNotFoundError()
    }

    return snippetRepository.findByCollection(userId, collectionId)
  },
}

export type { CollectionFilterOptions, CollectionWithRelations }
