import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { requireUser } from "@/features/auth/session"
import { recentService } from "@/features/recent/service"
import {
  CollectionDetails,
  CollectionDetailsPage,
} from "@/features/collections/components/collection-details-page"
import { CollectionDetailsSkeleton } from "@/features/collections/components/collection-details-skeleton"
import { collectionService } from "@/features/collections/service"
import { toCollectionListItem } from "@/features/collections/serializer"
import { snippetService } from "@/features/snippets/service"
import { toSnippetListItem } from "@/features/snippets/serializer"
import { tagService } from "@/features/tags/service"
import type { SnippetListItem } from "@/features/snippets/types"

export const metadata: Metadata = {
  title: "Collection",
}

async function CollectionDetailsFeed({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireUser()

  const collection = await collectionService.getCollection(user.id, id)

  if (!collection) {
    notFound()
  }

  await recentService.record(user.id, {
    targetType: "collection",
    action: "viewed",
    targetId: collection.id,
    title: collection.name,
  })

  const [page, allTags] = await Promise.all([
    snippetService.getCollectionSnippetsPage(user.id, collection.id),
    tagService.getTagNames(user.id),
  ])

  const snippets: SnippetListItem[] = page.items.map(toSnippetListItem)

  return (
    <CollectionDetails
      collection={toCollectionListItem(collection)}
      snippets={snippets}
      snippetsNextCursor={page.nextCursor}
      snippetsHasMore={page.hasMore}
      allTags={allTags}
    />
  )
}

export default async function CollectionDetailsRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <CollectionDetailsPage>
      <Suspense fallback={<CollectionDetailsSkeleton />}>
        <CollectionDetailsFeed params={params} />
      </Suspense>
    </CollectionDetailsPage>
  )
}
