import { Suspense } from "react"

import { requireUser } from "@/features/auth/session"
import { snippetService } from "@/features/snippets/service"
import { toSnippetListItem } from "@/features/snippets/serializer"
import { tagService } from "@/features/tags/service"
import { SnippetsPage } from "@/features/dashboard/pages/snippets-page"
import { SnippetList } from "@/features/snippets/components/snippet-list"
import { SnippetsFeedSkeleton } from "@/features/snippets/components/snippet-card-skeleton"
import type { SnippetListItem } from "@/features/snippets/types"

export const metadata = {
  title: "Snippets",
}

async function SnippetsFeed() {
  const user = await requireUser()

  let snippets: SnippetListItem[] = []
  let nextCursor: string | null = null
  let hasMore = false
  let totalCount = 0
  let favoritesCount = 0
  let allTags: string[] = []
  try {
    const [page, total, favorites, tags] = await Promise.all([
      snippetService.listSnippetsPage(user.id, "all"),
      snippetService.countSnippets(user.id, "all"),
      snippetService.countSnippets(user.id, "favorites"),
      tagService.getTagNames(user.id),
    ])
    snippets = page.items.map(toSnippetListItem)
    nextCursor = page.nextCursor
    hasMore = page.hasMore
    totalCount = total
    favoritesCount = favorites
    allTags = tags
  } catch {
    // Render an empty page so the UI stays interactive if the backend is down.
  }

  return (
    <SnippetList
      snippets={snippets}
      nextCursor={nextCursor}
      hasMore={hasMore}
      totalCount={totalCount}
      favoritesCount={favoritesCount}
      allTags={allTags}
    />
  )
}

export default async function SnippetsRoute() {
  return (
    <SnippetsPage>
      <Suspense fallback={<SnippetsFeedSkeleton />}>
        <SnippetsFeed />
      </Suspense>
    </SnippetsPage>
  )
}
