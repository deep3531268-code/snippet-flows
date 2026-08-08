import type {
  ActivityAction,
  ActivityTargetType,
} from "./config"

export type RecordActivityInput = {
  targetType: ActivityTargetType
  action: ActivityAction
  targetId: string
  title: string
}

export type ActivityRecord = {
  id: string
  targetType: ActivityTargetType
  action: ActivityAction
  targetId: string
  title: string
  createdAt: string
}

export type RecentActivityItem = ActivityRecord & {
  route: string
}
