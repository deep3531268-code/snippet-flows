export {
  RECENT_ACTIVITY,
  VIEWED_ACTIONS,
  EDITED_ACTIONS,
  INTERACTED_ACTIONS,
  activityRoute,
  isValidActivityAction,
  type ActivityAction,
  type ActivityTargetType,
} from "./config"
export type {
  ActivityRecord,
  RecentActivityItem,
  RecordActivityInput,
} from "./types"
export {
  recentService,
  actionLabel,
  describeActivity,
  type RecentSnippetItem,
} from "./service"
export {
  recordCollectionViewed,
  recordSnippetCopied,
  recordSnippetViewed,
} from "./actions"
export { useRecentActivity } from "./use-recent-activity"
