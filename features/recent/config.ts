export const RECENT_ACTIVITY = {
  targetTypes: ["snippet", "collection", "tag"] as const,

  actions: {
    snippet: [
      "viewed",
      "created",
      "updated",
      "deleted",
      "copied",
      "favorited",
      "archived",
    ] as const,
    collection: ["viewed", "created", "updated", "deleted"] as const,
    tag: ["created", "updated"] as const,
  },

  limits: {
    activityFeed: 20,
    continueWorking: 1,
    recentlyViewed: 5,
    recentlyEdited: 5,
    recentSnippets: 5,
    maxActivityPerUser: 500,
  },

  routes: {
    snippet: () => "/dashboard/snippets",
    collection: (id: string) => `/dashboard/collections/${id}`,
    tag: (id: string) => `/dashboard/tags/${id}`,
  },
} as const

export type ActivityTargetType =
  (typeof RECENT_ACTIVITY.targetTypes)[number]

export type ActivityAction =
  | (typeof RECENT_ACTIVITY.actions.snippet)[number]
  | (typeof RECENT_ACTIVITY.actions.collection)[number]
  | (typeof RECENT_ACTIVITY.actions.tag)[number]

export const RECENT_ACTIVITIES: Record<ActivityTargetType, readonly ActivityAction[]> =
  RECENT_ACTIVITY.actions

export const VIEWED_ACTIONS: readonly ActivityAction[] = ["viewed"]

export const EDITED_ACTIONS: readonly ActivityAction[] = ["created", "updated"]

export const INTERACTED_ACTIONS: readonly ActivityAction[] = [
  "viewed",
  "created",
  "updated",
  "copied",
]

export function isValidActivityAction(
  targetType: string,
  action: string,
): action is ActivityAction {
  const allowed = RECENT_ACTIVITIES[targetType as ActivityTargetType]
  if (!allowed) return false
  return (allowed as readonly string[]).includes(action)
}

export function activityRoute(
  targetType: ActivityTargetType,
  targetId: string,
) {
  return RECENT_ACTIVITY.routes[targetType](targetId)
}
