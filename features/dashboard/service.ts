import { snippetService } from "@/features/snippets/service"
import { dashboardRepository } from "./repository"
import type {
  DashboardActivityEvent,
  DashboardCollectionSummary,
  DashboardData,
  DashboardRecentSnippet,
} from "./types"

const RECENT_SNIPPETS_LIMIT = 5
const RECENT_COLLECTIONS_LIMIT = 4
const RECENT_TAGS_LIMIT = 4
const ACTIVITY_LIMIT = 5
const CREATED_WINDOW_MS = 1000

function isNewlyCreated(createdAt: Date, updatedAt: Date) {
  return updatedAt.getTime() - createdAt.getTime() < CREATED_WINDOW_MS
}

function mapSnippet(snippet: {
  id: string
  title: string
  description: string | null
  content: string
  language: string
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  tags: { tag: { id: string; name: string } }[]
  collections: { collection: { id: string; name: string } }[]
}): DashboardRecentSnippet {
  return {
    id: snippet.id,
    title: snippet.title,
    description: snippet.description,
    content: snippet.content,
    language: snippet.language,
    isFavorite: snippet.isFavorite,
    createdAt: snippet.createdAt.toISOString(),
    updatedAt: snippet.updatedAt.toISOString(),
    tags: snippet.tags.map(({ tag }) => ({ id: tag.id, name: tag.name })),
    collections: snippet.collections.map(({ collection }) => ({
      id: collection.id,
      name: collection.name,
    })),
  }
}

function mapCollection(collection: {
  id: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  _count: { snippets: number }
}): DashboardCollectionSummary {
  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    snippetCount: collection._count.snippets,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
  }
}

function buildActivity(
  snippets: DashboardRecentSnippet[],
  collections: DashboardCollectionSummary[],
  tags: { id: string; name: string; createdAt: Date }[],
): DashboardActivityEvent[] {
  const events: DashboardActivityEvent[] = [
    ...snippets.map((snippet) => ({
      id: `snippet:${snippet.id}`,
      kind: "snippet" as const,
      text: isNewlyCreated(
        new Date(snippet.createdAt),
        new Date(snippet.updatedAt),
      )
        ? `Created snippet '${snippet.title}'`
        : `Updated snippet '${snippet.title}'`,
      timestamp: snippet.updatedAt,
    })),
    ...collections.map((collection) => ({
      id: `collection:${collection.id}`,
      kind: "collection" as const,
      text: isNewlyCreated(
        new Date(collection.createdAt),
        new Date(collection.updatedAt),
      )
        ? `Created collection '${collection.name}'`
        : `Updated collection '${collection.name}'`,
      timestamp: collection.updatedAt,
    })),
    ...tags.map((tag) => ({
      id: `tag:${tag.id}`,
      kind: "tag" as const,
      text: `Created tag '${tag.name}'`,
      timestamp: tag.createdAt.toISOString(),
    })),
  ]

  return events
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
    .slice(0, ACTIVITY_LIMIT)
}

export const dashboardService = {
  async getDashboardData(
    userId: string,
    userName: string | null,
  ): Promise<DashboardData> {
    const [stats, snippets, collections, tags] = await Promise.all([
      snippetService.getDashboardStats(userId),
      dashboardRepository.recentSnippets(userId, RECENT_SNIPPETS_LIMIT),
      dashboardRepository.latestCollections(userId, RECENT_COLLECTIONS_LIMIT),
      dashboardRepository.recentTags(userId, RECENT_TAGS_LIMIT),
    ])

    const recentSnippets = snippets.map(mapSnippet)
    const recentCollections = collections.map(mapCollection)
    const activity = buildActivity(recentSnippets, recentCollections, tags)

    return {
      userName,
      stats: {
        total: stats.total,
        favorites: stats.favorites,
        collections: stats.collections,
        tags: stats.tags,
      },
      recentSnippets,
      recentCollections,
      activity,
    }
  },
}
