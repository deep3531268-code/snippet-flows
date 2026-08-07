import * as React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

function SectionHeaderSkeleton({
  title,
  action,
  className,
}: {
  title?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        className,
      )}
    >
      <div className="grid min-w-0 gap-2">
        <Skeleton className="h-8 w-48 sm:h-9" />
        <div className="flex flex-wrap items-center gap-2.5">
          <Skeleton className="h-4 w-56 max-w-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
      {action ?? <Skeleton className="h-9 w-32 rounded-[12px]" />}
    </div>
  )
}

export { SectionHeaderSkeleton }
