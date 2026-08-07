import { Suspense } from "react"
import type { Metadata } from "next"

import { requireUser } from "@/features/auth/session"
import { CollectionsPage } from "@/features/dashboard/pages/collections-page"
import {
  collectionService,
  type CollectionWithRelations,
} from "@/features/collections/service"
import { CollectionList } from "@/features/collections/components/collection-list"
import { CollectionsFeedSkeleton } from "@/features/collections/components/collection-card-skeleton"
import type { CollectionListItem } from "@/features/collections/types"

export const metadata: Metadata = {
  title: "Collections",
}

function toListItem(collection: CollectionWithRelations): CollectionListItem {
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

async function CollectionsFeed() {
  const user = await requireUser()

  let collections: CollectionListItem[] = []
  try {
    const data = await collectionService.listCollections(user.id)
    collections = data.map(toListItem)
  } catch {
    collections = []
  }

  return <CollectionList collections={collections} />
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
