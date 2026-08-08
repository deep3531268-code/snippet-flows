import "server-only"

import type { TagWithRelations } from "./repository"
import type { TagListItem } from "./types"

export function toTagListItem(tag: TagWithRelations): TagListItem {
  return {
    id: tag.id,
    name: tag.name,
    color: "blue",
    snippetCount: tag._count.snippets,
    createdAt: tag.createdAt.toISOString(),
    updatedAt: tag.createdAt.toISOString(),
  }
}
