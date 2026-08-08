import { snippetService } from "@/features/snippets/service"
import {
  actionLabel,
  describeActivity,
  recentService,
  type RecentActivityItem,
} from "@/features/recent/service"
import { dashboardRepository } from "./repository"
import type {
  DashboardActivityEvent,
  DashboardCollectionSummary,
  DashboardContinueWorking,
  DashboardData,
  DashboardRecentSnippet,
} from "./types"

const RECENT_COLLECTIONS_LIMIT = 4
const ACTIVITY_LIMIT = 5

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

function mapActivity(item: RecentActivityItem): DashboardActivityEvent {
  return {
    id: item.id,
    kind: item.targetType,
    text: describeActivity(item),
    timestamp: item.createdAt,
    route: item.route,
  }
}

function emptyContinueWorking(): DashboardContinueWorking {
  return { snippet: null, action: null, timestamp: null, route: null }
}

export const dashboardService = {
  async getDashboardData(
    userId: string,
    userName: string | null,
  ): Promise<DashboardData> {
    const [stats, recentSnippets, recentCollections, activity, continueWorking] =
      await Promise.all([
        snippetService.getDashboardStats(userId),
        recentService.getRecentSnippets(userId),
        dashboardRepository.latestCollections(userId, RECENT_COLLECTIONS_LIMIT),
        recentService.getRecentActivity(userId, ACTIVITY_LIMIT),
        recentService.getContinueWorkingSnippet(userId),
      ])

    return {
      userName,
      stats: {
        total: stats.total,
        favorites: stats.favorites,
        collections: stats.collections,
        tags: stats.tags,
      },
      recentSnippets: recentSnippets.map((item) => mapSnippet(item.snippet)),
      recentCollections: recentCollections.map(mapCollection),
      activity: activity.map(mapActivity),
      continueWorking: continueWorking
        ? {
            snippet: mapSnippet(continueWorking.snippet),
            action: actionLabel(continueWorking.action),
            timestamp: continueWorking.timestamp,
            route: continueWorking.route,
          }
        : emptyContinueWorking(),
    }
  },

  async getRecentPageData(userId: string) {
    const [viewed, edited] = await Promise.all([
      recentService.getRecentlyViewedSnippets(userId),
      recentService.getRecentlyEditedSnippets(userId),
    ])

    return {
      viewed: viewed.map((item) => mapSnippet(item.snippet)),
      edited: edited.map((item) => mapSnippet(item.snippet)),
    }
  },
}
