import "server-only"

import {
  snippetRepository,
  type SnippetWithRelations,
} from "@/features/snippets/repository"
import { collectionRepository } from "@/features/collections/repository"
import {
  EDITED_ACTIONS,
  INTERACTED_ACTIONS,
  RECENT_ACTIVITY,
  VIEWED_ACTIONS,
  activityRoute,
  isValidActivityAction,
  type ActivityAction,
  type ActivityTargetType,
} from "./config"
import { recentRepository } from "./repository"
import type {
  ActivityRecord,
  RecentActivityItem,
  RecordActivityInput,
} from "./types"

export type RecentSnippetItem = {
  action: ActivityAction
  targetType: ActivityTargetType
  timestamp: string
  snippet: SnippetWithRelations
  route: string
}

const ACTION_LABELS: Record<ActivityAction, string> = {
  viewed: "Viewed",
  created: "Created",
  updated: "Edited",
  deleted: "Deleted",
  copied: "Copied",
  favorited: "Favorited",
  archived: "Archived",
}

const TARGET_LABELS: Record<ActivityTargetType, string> = {
  snippet: "snippet",
  collection: "collection",
  tag: "tag",
}

export function actionLabel(action: ActivityAction) {
  return ACTION_LABELS[action]
}

export function describeActivity(item: {
  action: ActivityAction
  targetType: ActivityTargetType
  title: string
}) {
  return `${ACTION_LABELS[item.action]} ${TARGET_LABELS[item.targetType]} '${item.title}'`
}

function toItem(activity: {
  id: string
  targetType: string
  action: string
  targetId: string
  title: string
  createdAt: Date
}): RecentActivityItem {
  return {
    id: activity.id,
    targetType: activity.targetType as ActivityTargetType,
    action: activity.action as ActivityAction,
    targetId: activity.targetId,
    title: activity.title,
    createdAt: activity.createdAt.toISOString(),
    route: activityRoute(
      activity.targetType as ActivityTargetType,
      activity.targetId,
    ),
  }
}

async function hydrateSnippets(
  userId: string,
  items: RecentActivityItem[],
): Promise<RecentSnippetItem[]> {
  if (items.length === 0) return []
  const rows = await snippetRepository.findManyByIds(
    userId,
    items.map((item) => item.targetId),
  )
  const byId = new Map(rows.map((row) => [row.id, row]))

  const hydrated: RecentSnippetItem[] = []
  for (const item of items) {
    const snippet = byId.get(item.targetId)
    if (snippet) {
      hydrated.push({
        action: item.action,
        targetType: item.targetType,
        timestamp: item.createdAt,
        snippet,
        route: item.route,
      })
    }
  }
  return hydrated
}

export const recentService = {
  record(userId: string, input: RecordActivityInput) {
    if (!isValidActivityAction(input.targetType, input.action)) {
      throw new Error("Invalid activity action")
    }
    return recentRepository.create(userId, input).catch(() => undefined)
  },

  async recordMany(userId: string, entries: RecordActivityInput[]) {
    try {
      const valid = entries.filter((entry) =>
        isValidActivityAction(entry.targetType, entry.action),
      )
      if (valid.length === 0) return

      await recentRepository.createMany(userId, valid)

      if (
        (await recentRepository.count(userId)) >
        RECENT_ACTIVITY.limits.maxActivityPerUser
      ) {
        await recentRepository.trim(
          userId,
          RECENT_ACTIVITY.limits.maxActivityPerUser,
        )
      }
    } catch {
      // Recording activity is best-effort and must never fail the caller.
    }
  },

  async recordSnippet(
    userId: string,
    id: string,
    action: "viewed" | "created" | "updated" | "deleted" | "copied" | "favorited" | "archived",
  ) {
    try {
      const snippet = await snippetRepository.findScalarById(userId, id, {
        id: true,
        title: true,
      })
      if (!snippet) return
      await this.record(userId, {
        targetType: "snippet",
        action,
        targetId: snippet.id,
        title: snippet.title,
      })
    } catch {
      // Recording activity is best-effort and must never fail the caller.
    }
  },

  async recordSnippets(
    userId: string,
    ids: string[],
    action: "viewed" | "created" | "updated" | "deleted" | "copied" | "favorited" | "archived",
  ) {
    try {
      if (ids.length === 0) return
      const snippets = await snippetRepository.findTitlesByIds(userId, ids)
      await this.recordMany(
        userId,
        snippets.map((snippet) => ({
          targetType: "snippet" as const,
          action,
          targetId: snippet.id,
          title: snippet.title,
        })),
      )
    } catch {
      // Recording activity is best-effort and must never fail the caller.
    }
  },

  async recordCollection(
    userId: string,
    id: string,
    action: "viewed" | "created" | "updated" | "deleted",
  ) {
    try {
      const collection = await collectionRepository.findById(userId, id)
      if (!collection) return
      await this.record(userId, {
        targetType: "collection",
        action,
        targetId: collection.id,
        title: collection.name,
      })
    } catch {
      // Recording activity is best-effort and must never fail the caller.
    }
  },

  async recordCollections(
    userId: string,
    ids: string[],
    action: "viewed" | "created" | "updated" | "deleted",
  ) {
    try {
      if (ids.length === 0) return
      const collections = await collectionRepository.findByIds(userId, ids)
      await this.recordMany(
        userId,
        collections.map((collection) => ({
          targetType: "collection" as const,
          action,
          targetId: collection.id,
          title: collection.name,
        })),
      )
    } catch {
      // Recording activity is best-effort and must never fail the caller.
    }
  },

  async getRecentActivity(
    userId: string,
    limit: number = RECENT_ACTIVITY.limits.activityFeed,
  ): Promise<RecentActivityItem[]> {
    const rows = await recentRepository.findActivity(userId, limit)
    return rows.map(toItem)
  },

  async getRecentlyViewed(
    userId: string,
    limit: number = RECENT_ACTIVITY.limits.recentlyViewed,
  ): Promise<RecentActivityItem[]> {
    const rows = await recentRepository.findRecent(
      userId,
      VIEWED_ACTIONS,
      limit,
      true,
    )
    return rows.map(toItem)
  },

  async getRecentlyEdited(
    userId: string,
    limit: number = RECENT_ACTIVITY.limits.recentlyEdited,
  ): Promise<RecentActivityItem[]> {
    const rows = await recentRepository.findRecent(
      userId,
      EDITED_ACTIONS,
      limit,
      true,
    )
    return rows.map(toItem)
  },

  async getContinueWorking(userId: string): Promise<RecentActivityItem | null> {
    const rows = await recentRepository.findRecent(
      userId,
      INTERACTED_ACTIONS,
      RECENT_ACTIVITY.limits.continueWorking,
      true,
    )
    return rows.length > 0 ? toItem(rows[0]) : null
  },

  async getContinueWorkingSnippet(
    userId: string,
  ): Promise<RecentSnippetItem | null> {
    const item = await this.getContinueWorking(userId)
    if (!item) return null
    const hydrated = await hydrateSnippets(userId, [item])
    return hydrated[0] ?? null
  },

  async getRecentSnippets(
    userId: string,
    limit: number = RECENT_ACTIVITY.limits.recentSnippets,
  ): Promise<RecentSnippetItem[]> {
    const [viewed, edited] = await Promise.all([
      this.getRecentlyViewed(userId, limit),
      this.getRecentlyEdited(userId, limit),
    ])

    const latestByTarget = new Map<string, RecentActivityItem>()
    for (const item of [...viewed, ...edited]) {
      const existing = latestByTarget.get(item.targetId)
      if (!existing || Date.parse(item.createdAt) > Date.parse(existing.createdAt)) {
        latestByTarget.set(item.targetId, item)
      }
    }

    const merged = [...latestByTarget.values()]
      .sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      )
      .slice(0, limit)

    return hydrateSnippets(userId, merged)
  },

  async getRecentlyViewedSnippets(
    userId: string,
    limit: number = RECENT_ACTIVITY.limits.recentlyViewed,
  ): Promise<RecentSnippetItem[]> {
    const items = await this.getRecentlyViewed(userId, limit)
    return hydrateSnippets(userId, items)
  },

  async getRecentlyEditedSnippets(
    userId: string,
    limit: number = RECENT_ACTIVITY.limits.recentlyEdited,
  ): Promise<RecentSnippetItem[]> {
    const items = await this.getRecentlyEdited(userId, limit)
    return hydrateSnippets(userId, items)
  },
}

export type { ActivityRecord, RecentActivityItem, RecordActivityInput }
