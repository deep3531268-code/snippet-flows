import { durations, easings, springs } from "@/lib/design/tokens"

export { durations, easings, springs }

export const motionDurations = {
  instant: durations.instant / 1000,
  fast: durations.fast / 1000,
  base: durations.base / 1000,
  slow: durations.slow / 1000,
  page: durations.page / 1000,
} as const

export const motionEasings = easings
