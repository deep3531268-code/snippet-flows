import { Prisma } from "@prisma/client"

import {
  CATEGORIES,
  COLLECTION_DEFS,
  DEMO_USER_ID,
  TAG_POOL,
  resolveAnchorDate,
} from "./constants"
import type { SnippetSeed } from "./dataset"
import { slugify, uuidFromSeed } from "./ids"

const ANCHOR_DATE = resolveAnchorDate()

const DAY_MS = 24 * 60 * 60 * 1000

export function subDays(date: Date, days: number): Date {
  return new Date(date.getTime() - days * DAY_MS)
}

// Deterministic creation/update dates for a snippet at `index`:
// - created over the previous 6 months (180 days)
// - updated over the previous 60 days, always clamped to be >= createdAt
export function snippetDates(index: number) {
  const createdDaysAgo = (index * 53) % 181
  const updatedDaysAgo = (index * 13) % 61
  const createdAt = subDays(ANCHOR_DATE, createdDaysAgo)
  const updatedAt = subDays(ANCHOR_DATE, updatedDaysAgo)
  return {
    createdAt,
    updatedAt: updatedAt > createdAt ? updatedAt : createdAt,
  }
}

// Deterministic metadata matching the dashboard distribution targets:
// - ~20% favorites (index % 5 === 0)
// - ~10% archived (index % 10 === 4)
// - ~15% public   (index % 20 < 3)
// The moduli are chosen so no snippet is simultaneously archived and public
// (or archived and favorited), which keeps the dataset realistic.
export function deriveMetadata(index: number) {
  return {
    isFavorite: index % 5 === 0,
    isArchived: index % 10 === 4,
    isPublic: index % 20 < 3,
  }
}

export type BuiltSnippet = {
  record: Prisma.SnippetCreateManyInput
  collectionLink: Prisma.SnippetsOnCollectionsCreateManyInput
  tagLinks: Prisma.SnippetsOnTagsCreateManyInput[]
}

// Reusable factory: build a single snippet record plus its collection/tag
// links. Ids are derived deterministically, so the same definition always
// produces the same rows and links.
export function buildSnippet(
  definition: SnippetSeed,
  index: number,
): BuiltSnippet {
  const id = uuidFromSeed("snippet", slugify(definition.title))
  const { createdAt, updatedAt } = snippetDates(index)
  const { isFavorite, isArchived, isPublic } = deriveMetadata(index)

  const record: Prisma.SnippetCreateManyInput = {
    id,
    userId: DEMO_USER_ID,
    title: definition.title,
    description: definition.description,
    content: definition.content,
    language: definition.language,
    slug: slugify(definition.title),
    isPublic,
    isFavorite,
    isArchived,
    createdAt,
    updatedAt,
  }

  const collectionLink: Prisma.SnippetsOnCollectionsCreateManyInput = {
    snippetId: id,
    collectionId: uuidFromSeed("collection", definition.collection),
    createdAt: updatedAt,
  }

  const tagLinks: Prisma.SnippetsOnTagsCreateManyInput[] = definition.tags.map(
    (tag) => ({
      snippetId: id,
      tagId: uuidFromSeed("tag", tag),
      createdAt: updatedAt,
    }),
  )

  return { record, collectionLink, tagLinks }
}

export type BuiltDemoSnippets = {
  snippets: Prisma.SnippetCreateManyInput[]
  collectionLinks: Prisma.SnippetsOnCollectionsCreateManyInput[]
  tagLinks: Prisma.SnippetsOnTagsCreateManyInput[]
}

// Compose all snippet rows and their relations from the dataset definitions.
export function buildSnippets(definitions: SnippetSeed[]): BuiltDemoSnippets {
  const snippets: Prisma.SnippetCreateManyInput[] = []
  const collectionLinks: Prisma.SnippetsOnCollectionsCreateManyInput[] = []
  const tagLinks: Prisma.SnippetsOnTagsCreateManyInput[] = []

  definitions.forEach((definition, index) => {
    const built = buildSnippet(definition, index)
    snippets.push(built.record)
    collectionLinks.push(built.collectionLink)
    tagLinks.push(...built.tagLinks)
  })

  return { snippets, collectionLinks, tagLinks }
}

// Build the 4 demo collections. They are created before most snippets so the
// dataset tells a realistic "grows over time" story.
export function buildCollections(): Prisma.CollectionCreateManyInput[] {
  return CATEGORIES.map((category, index) => ({
    id: uuidFromSeed("collection", category),
    userId: DEMO_USER_ID,
    name: category,
    description: COLLECTION_DEFS[category].description,
    createdAt: subDays(ANCHOR_DATE, 190 + index * 30),
    updatedAt: subDays(ANCHOR_DATE, 2 + index * 5),
  }))
}

// Build the shared tag pool (20 tags, all lowercase, no casing duplicates).
export function buildTags(): Prisma.TagCreateManyInput[] {
  const tags: Prisma.TagCreateManyInput[] = []
  CATEGORIES.forEach((category, categoryIndex) => {
    TAG_POOL[category].forEach((name, tagIndex) => {
      tags.push({
        id: uuidFromSeed("tag", name),
        userId: DEMO_USER_ID,
        name,
        createdAt: subDays(ANCHOR_DATE, 220 + categoryIndex * 30 + tagIndex * 13),
      })
    })
  })
  return tags
}
