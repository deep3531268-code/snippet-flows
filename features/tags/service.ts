import "server-only"

import { snippetRepository } from "@/features/snippets/repository"
import {
  tagRepository,
  type TagFilterOptions,
  type TagWithRelations,
} from "./repository"
import {
  type CreateTagInput,
  type UpdateTagInput,
} from "./schemas"

export class TagNotFoundError extends Error {
  constructor() {
    super("Tag not found")
    this.name = "TagNotFoundError"
  }
}

export const tagService = {
  listTags(userId: string, options: TagFilterOptions = {}) {
    return tagRepository.findMany(userId, options)
  },

  async getTag(userId: string, id: string) {
    return tagRepository.findById(userId, id)
  },

  async createTag(userId: string, input: CreateTagInput) {
    return tagRepository.create(userId, {
      name: input.name,
    })
  },

  async updateTag(userId: string, input: UpdateTagInput) {
    const existing = await tagRepository.findById(userId, input.id)
    if (!existing) {
      throw new TagNotFoundError()
    }

    return tagRepository.update(userId, input.id, {
      name: input.name,
    })
  },

  async deleteTag(userId: string, id: string) {
    await tagRepository.delete(userId, id)
  },

  async deleteTags(userId: string, ids: string[]) {
    for (const id of ids) {
      await tagRepository.delete(userId, id)
    }
  },

  async duplicateTag(userId: string, id: string) {
    const source = await tagRepository.findById(userId, id)
    if (!source) {
      throw new TagNotFoundError()
    }

    return tagRepository.create(userId, {
      name: `${source.name} (copy)`,
    })
  },

  async duplicateTags(userId: string, ids: string[]) {
    const created = []
    for (const id of ids) {
      const source = await tagRepository.findById(userId, id)
      if (!source) {
        continue
      }
      created.push(
        await tagRepository.create(userId, {
          name: `${source.name} (copy)`,
        }),
      )
    }
    return created
  },

  async addSnippetsToTag(
    userId: string,
    tagId: string,
    snippetIds: string[],
  ) {
    const tag = await tagRepository.findById(userId, tagId)
    if (!tag) {
      throw new TagNotFoundError()
    }

    const owned = await snippetRepository.findIdsByIds(userId, snippetIds)
    await tagRepository.attachSnippets(
      tagId,
      owned.map((snippet) => snippet.id),
    )
  },

  async removeSnippetFromTag(
    userId: string,
    tagId: string,
    snippetId: string,
  ) {
    const tag = await tagRepository.findById(userId, tagId)
    if (!tag) {
      throw new TagNotFoundError()
    }

    await tagRepository.detachSnippet(tagId, snippetId)
  },

  async getTagSnippets(userId: string, tagId: string) {
    const tag = await tagRepository.findById(userId, tagId)
    if (!tag) {
      throw new TagNotFoundError()
    }

    return snippetRepository.findByTag(userId, tagId)
  },
}

export type { TagFilterOptions, TagWithRelations }
