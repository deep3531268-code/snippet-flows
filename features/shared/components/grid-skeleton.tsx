import * as React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded-[16px] border border-white/[0.06] bg-[#0f1826]/60 p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Skeleton className="size-4 shrink-0 rounded" />
          <Skeleton className="size-10 shrink-0 rounded-[10px]" />
          <div className="grid min-w-0 gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Skeleton className="size-8 rounded-[10px]" />
          <Skeleton className="size-8 rounded-[10px]" />
          <Skeleton className="size-8 rounded-[10px]" />
        </div>
      </div>
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-3/4" />
      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  )
}

function GridSkeleton({
  count = 6,
  card,
  label = "Loading",
  className,
}: {
  count?: number
  card?: React.ReactNode
  label?: string
  className?: string
}) {
  const cell = card ?? <CardSkeleton />

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-full">
          {cell}
        </div>
      ))}
      <span className="sr-only">{label}…</span>
    </div>
  )
}

export { GridSkeleton, CardSkeleton }
