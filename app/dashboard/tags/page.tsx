import { Suspense } from "react"
import type { Metadata } from "next"

import { requireUser } from "@/features/auth/session"
import { TagsPage } from "@/features/tags"
import { TagList } from "@/features/tags/components/tag-list"
import { TagsFeedSkeleton } from "@/features/tags/components/tag-card-skeleton"
import {
  tagService,
  type TagWithRelations,
} from "@/features/tags/service"
import type { TagListItem } from "@/features/tags/types"

export const metadata: Metadata = {
  title: "Tags",
}

function toListItem(tag: TagWithRelations): TagListItem {
  return {
    id: tag.id,
    name: tag.name,
    color: "blue",
    snippetCount: tag._count.snippets,
    createdAt: tag.createdAt.toISOString(),
    updatedAt: tag.createdAt.toISOString(),
  }
}

async function TagsFeed() {
  const user = await requireUser()

  let tags: TagListItem[] = []
  try {
    const data = await tagService.listTags(user.id)
    tags = data.map(toListItem)
  } catch {
    tags = []
  }

  return <TagList tags={tags} />
}

export default async function TagsRoute() {
  return (
    <TagsPage>
      <Suspense fallback={<TagsFeedSkeleton />}>
        <TagsFeed />
      </Suspense>
    </TagsPage>
  )
}
