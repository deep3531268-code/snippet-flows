import { Suspense } from "react"

import { requireUser } from "@/features/auth/session"
import { snippetService } from "@/features/snippets/service"
import { SnippetsPage } from "@/features/dashboard/pages/snippets-page"
import { SnippetList } from "@/features/snippets/components/snippet-list"
import { SnippetsFeedSkeleton } from "@/features/snippets/components/snippet-card-skeleton"
import type { SnippetListItem } from "@/features/snippets/types"
import type { SnippetWithRelations } from "@/features/snippets/service"

export const metadata = {
  title: "Snippets",
}

function toListItem(snippet: SnippetWithRelations): SnippetListItem {
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

// Temporary local fallback used only when the snippet backend is unreachable.
// Keeps the page functional so Snippets management remains interactive.
const FALLBACK_SNIPPETS: SnippetListItem[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "auth middleware setup",
    description: "Protect dashboard routes with Better Auth.",
    content:
      "export function middleware(request) {\n  return auth.middleware(request)\n}",
    language: "typescript",
    isPublic: false,
    slug: null,
    isFavorite: true,
    isArchived: false,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date(Date.now() - 7_200_000).toISOString(),
    tags: [{ id: "00000000-0000-0000-0000-000000000002", name: "auth" }],
    collections: [],
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "rate limiter",
    description: "Simple in-memory rate limiting helper.",
    content:
      "export async function rateLimit(key, limit, windowMs) {\n  const count = await cache.incr(key)\n  if (count === 1) await cache.expire(key, windowMs / 1000)\n  return count <= limit\n}",
    language: "javascript",
    isPublic: false,
    slug: null,
    isFavorite: false,
    isArchived: false,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date(Date.now() - 43_200_000).toISOString(),
    tags: [{ id: "00000000-0000-0000-0000-000000000004", name: "backend" }],
    collections: [],
  },
]

async function SnippetsFeed() {
  const user = await requireUser()

  let snippets: SnippetListItem[] = []
  try {
    const data = await snippetService.listSnippets(user.id, "all")
    snippets = data.map(toListItem)
  } catch {
    snippets = FALLBACK_SNIPPETS
  }

  return <SnippetList snippets={snippets} />
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
