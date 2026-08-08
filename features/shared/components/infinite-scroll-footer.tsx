"use client"

import * as React from "react"
import { Check, Loader2, RefreshCw } from "lucide-react"

import { DashboardButton } from "@/features/dashboard/ui"

// Compact loading-more / end-of-list / error+retry indicator shared by every
// paginated list. The sentinel element drives the IntersectionObserver hook.
function InfiniteScrollFooter({
  sentinelRef,
  initialLoading,
  loadingMore,
  hasMore,
  error,
  onRetry,
  label = "Loading more",
  endLabel = "You've reached the end",
}: {
  sentinelRef: React.RefCallback<HTMLDivElement>
  initialLoading: boolean
  loadingMore: boolean
  hasMore: boolean
  error: string | null
  onRetry: () => void
  label?: string
  endLabel?: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      {initialLoading || loadingMore ? (
        <div
          role="status"
          className="flex items-center gap-2 text-sm text-[#94a3b8]"
        >
          <Loader2 className="size-4 animate-spin" />
          {initialLoading ? "Loading…" : `${label}…`}
        </div>
      ) : null}
      {!initialLoading && !loadingMore && error ? (
        <div className="flex items-center gap-3 text-sm text-[#fb7185]">
          <span>{error}</span>
          <DashboardButton variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw className="size-3.5" />
            Retry
          </DashboardButton>
        </div>
      ) : null}
      {!initialLoading && !loadingMore && !error && !hasMore ? (
        <div className="flex items-center gap-1.5 text-xs text-[#7d8ba3]">
          <Check className="size-3" />
          {endLabel}
        </div>
      ) : null}
    </div>
  )
}

export { InfiniteScrollFooter }
