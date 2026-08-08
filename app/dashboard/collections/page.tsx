import { Suspense } from "react"
import type { Metadata } from "next"

import { requireUser } from "@/features/auth/session"
import { CollectionsPage } from "@/features/dashboard/pages/collections-page"
import { collectionService } from "@/features/collections/service"
import { toCollectionListItem } from "@/features/collections/serializer"
import { CollectionList } from "@/features/collections/components/collection-list"
import { CollectionsFeedSkeleton } from "@/features/collections/components/collection-card-skeleton"
import type { CollectionListItem } from "@/features/collections/types"

export const metadata: Metadata = {
  title: "Collections",
}

async function CollectionsFeed() {
  const user = await requireUser()

  let collections: CollectionListItem[] = []
  let nextCursor: string | null = null
  let hasMore = false
  let totalCount = 0
  try {
    const [page, count] = await Promise.all([
      collectionService.listCollectionsPage(user.id),
      collectionService.countCollections(user.id),
    ])
    collections = page.items.map(toCollectionListItem)
    nextCursor = page.nextCursor
    hasMore = page.hasMore
    totalCount = count
  } catch {
    // Render an empty page so the UI stays interactive if the backend is down.
  }

  return (
    <CollectionList
      collections={collections}
      nextCursor={nextCursor}
      hasMore={hasMore}
      totalCount={totalCount}
    />
  )
}

export default async function CollectionsRoute() {
  return (
    <CollectionsPage>
      <Suspense fallback={<CollectionsFeedSkeleton />}>
        <CollectionsFeed />
      </Suspense>
    </CollectionsPage>
  )
}
