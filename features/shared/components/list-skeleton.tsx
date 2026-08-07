import * as React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

function ListRowSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-2 py-2.5",
        className,
      )}
    >
      <Skeleton className="size-4 shrink-0 rounded" />
      <Skeleton className="size-8 shrink-0 rounded-[10px]" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-4 w-40 max-w-full" />
        <Skeleton className="mt-1.5 h-3 w-64 max-w-full" />
      </div>
      <Skeleton className="hidden h-5 w-14 shrink-0 rounded-full md:block" />
      <Skeleton className="hidden h-3 w-16 shrink-0 sm:block" />
      <div className="flex shrink-0 items-center gap-0.5">
        <Skeleton className="size-8 rounded-[10px]" />
        <Skeleton className="size-8 rounded-[10px]" />
        <Skeleton className="size-8 rounded-[10px]" />
      </div>
    </div>
  )
}

function ListSkeleton({
  rows = 5,
  row,
  label = "Loading",
  className,
}: {
  rows?: number
  row?: React.ReactNode
  label?: string
  className?: string
}) {
  const cell = row ?? <ListRowSkeleton />

  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "flex flex-col gap-0.5 rounded-[16px] border border-white/[0.06] bg-[#0f1826]/60 p-2",
        className,
      )}
    >
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index}>{cell}</div>
      ))}
      <span className="sr-only">{label}…</span>
    </div>
  )
}

export { ListSkeleton, ListRowSkeleton }
