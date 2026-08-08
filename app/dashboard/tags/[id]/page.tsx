import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { requireUser } from "@/features/auth/session"
import {
  TagDetails,
  TagDetailsPage,
} from "@/features/tags/components/tag-details-page"
import { TagDetailsSkeleton } from "@/features/tags/components/tag-details-skeleton"
import {
  tagService,
  type TagWithRelations,
} from "@/features/tags/service"
import type { TagListItem } from "@/features/tags/types"
import type { SnippetListItem } from "@/features/snippets/types"
import type { SnippetWithRelations } from "@/features/snippets/service"

export const metadata: Metadata = {
  title: "Tag",
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

async function TagDetailsFeed({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireUser()

  const tag = await tagService.getTag(user.id, id)

  if (!tag) {
    notFound()
  }

  const snippets = await tagService.getTagSnippets(user.id, tag.id, tag)

  return (
    <TagDetails
      tag={toListItem(tag)}
      snippets={snippets.map(toSnippetListItem)}
    />
  )
}

export default async function TagDetailsRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <TagDetailsPage>
      <Suspense fallback={<TagDetailsSkeleton />}>
        <TagDetailsFeed params={params} />
      </Suspense>
    </TagDetailsPage>
  )
}
