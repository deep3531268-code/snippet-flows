import { Suspense } from "react"
import type { Metadata } from "next"

import { requireUser } from "@/features/auth/session"
import { TagsPage } from "@/features/tags"
import { tagService } from "@/features/tags/service"
import { toTagListItem } from "@/features/tags/serializer"
import { TagList } from "@/features/tags/components/tag-list"
import { TagsFeedSkeleton } from "@/features/tags/components/tag-card-skeleton"
import type { TagListItem } from "@/features/tags/types"

export const metadata: Metadata = {
  title: "Tags",
}

async function TagsFeed() {
  const user = await requireUser()

  let tags: TagListItem[] = []
  let nextCursor: string | null = null
  let hasMore = false
  let totalCount = 0
  try {
    const [page, count] = await Promise.all([
      tagService.listTagsPage(user.id),
      tagService.countTags(user.id),
    ])
    tags = page.items.map(toTagListItem)
    nextCursor = page.nextCursor
    hasMore = page.hasMore
    totalCount = count
  } catch {
    // Render an empty page so the UI stays interactive if the backend is down.
  }

  return (
    <TagList
      tags={tags}
      nextCursor={nextCursor}
      hasMore={hasMore}
      totalCount={totalCount}
    />
  )
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
