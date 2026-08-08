import "server-only"

import type { CollectionWithRelations } from "./repository"
import type { CollectionListItem } from "./types"

export function toCollectionListItem(
  collection: CollectionWithRelations,
): CollectionListItem {
  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isPublic: false,
    accent: "blue",
    snippetCount: collection._count.snippets,
    tags: [],
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
  }
}
