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
import {
  collectionService,
  type CollectionWithRelations,
} from "@/features/collections/service"
import type { CollectionListItem } from "@/features/collections/types"
import type { SnippetListItem } from "@/features/snippets/types"
import type { SnippetWithRelations } from "@/features/snippets/service"

export const metadata: Metadata = {
  title: "Collection",
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

function toSnippetListItem(snippet: SnippetWithRelations): SnippetListItem {
  return {
    id: snippet.id,
    title: snippet.title,
    description: snippet.description,
    content: snippet.content,
    language: snippet.language,
    isPublic: snippet.isPublic,
    slug: snippet.slug,
    isFavorite: snippet.isFavorite,
    isArchived: snippet.isArchived,
    deletedAt: snippet.deletedAt?.toISOString() ?? null,
    createdAt: snippet.createdAt.toISOString(),
    updatedAt: snippet.updatedAt.toISOString(),
    tags: snippet.tags.map(({ tag }) => ({ id: tag.id, name: tag.name })),
    collections: snippet.collections.map(({ collection }) => ({
      id: collection.id,
      name: collection.name,
    })),
  }
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

  const snippets = await collectionService.getCollectionSnippets(
    user.id,
    collection.id,
    collection,
  )

  return (
    <CollectionDetails
      collection={toListItem(collection)}
      snippets={snippets.map(toSnippetListItem)}
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
