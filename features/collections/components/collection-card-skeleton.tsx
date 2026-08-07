import {
  GridSkeleton,
  SectionHeaderSkeleton,
  Skeleton,
  ToolbarSkeleton,
} from "@/features/shared/components"
import { cn } from "@/lib/utils"

function CollectionCardSkeleton({ className }: { className?: string }) {
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
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
            <Skeleton className="size-6 rounded" />
          </div>
          <div className="grid min-w-0 gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="size-8 shrink-0 rounded-[10px]" />
      </div>
      <div className="grid gap-1.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

function CollectionsFeedSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <SectionHeaderSkeleton />
      <ToolbarSkeleton />
      <GridSkeleton
        count={6}
        card={<CollectionCardSkeleton />}
        label="Loading collections"
      />
    </div>
  )
}

export { CollectionCardSkeleton, CollectionsFeedSkeleton }
