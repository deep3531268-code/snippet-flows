import { Suspense } from "react"
import type { Metadata } from "next"

import { snippetService } from "@/features/snippets/service"
import { toSnippetListItem } from "@/features/snippets/serializer"
import { ExplorePage } from "@/features/explore/components/explore-page"
import { ExploreFeedSkeleton } from "@/features/explore/components/explore-skeleton"
import type { SnippetListItem } from "@/features/snippets/types"

export const metadata: Metadata = {
  title: "Explore",
}

async function ExploreFeed() {
  let snippets: SnippetListItem[] = []
  let nextCursor: string | null = null
  let hasMore = false
  let totalCount = 0
  let tags: string[] = []
  try {
    const [page, count, publicTags] = await Promise.all([
      snippetService.listPublicSnippetsPage(),
      snippetService.countPublicSnippets(),
      snippetService.getPublicTagNames(),
    ])
    snippets = page.items.map(toSnippetListItem)
    nextCursor = page.nextCursor
    hasMore = page.hasMore
    totalCount = count
    tags = publicTags
  } catch {
    // Render an empty page so the UI stays interactive if the backend is down.
  }

  return (
    <ExplorePage
      snippets={snippets}
      nextCursor={nextCursor}
      hasMore={hasMore}
      totalCount={totalCount}
      tags={tags}
    />
  )
}

export default async function ExploreRoute() {
  return (
    <Suspense fallback={<ExploreFeedSkeleton />}>
      <ExploreFeed />
    </Suspense>
  )
}
