import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { requireUser } from "@/features/auth/session"
import {
  TagDetails,
  TagDetailsPage,
} from "@/features/tags/components/tag-details-page"
import { TagDetailsSkeleton } from "@/features/tags/components/tag-details-skeleton"
import { tagService } from "@/features/tags/service"
import { toTagListItem } from "@/features/tags/serializer"
import { snippetService } from "@/features/snippets/service"
import { toSnippetListItem } from "@/features/snippets/serializer"
import type { SnippetListItem } from "@/features/snippets/types"

export const metadata: Metadata = {
  title: "Tag",
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

  const [page, allTags] = await Promise.all([
    snippetService.getTagSnippetsPage(user.id, tag.id),
    tagService.getTagNames(user.id),
  ])

  const snippets: SnippetListItem[] = page.items.map(toSnippetListItem)

  return (
    <TagDetails
      tag={toTagListItem(tag)}
      snippets={snippets}
      snippetsNextCursor={page.nextCursor}
      snippetsHasMore={page.hasMore}
      allTags={allTags}
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
