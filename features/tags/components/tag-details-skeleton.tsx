import {
  GridSkeleton,
  Skeleton,
  ToolbarSkeleton,
} from "@/features/shared/components"
import { SnippetCardSkeleton } from "@/features/snippets/components/snippet-card-skeleton"

function TagDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-4 w-24 rounded" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid min-w-0 gap-2">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
              <Skeleton className="size-6 rounded" />
            </div>
            <Skeleton className="h-8 w-48 sm:h-9" />
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-[12px]" />
          <Skeleton className="h-9 w-20 rounded-[12px]" />
          <Skeleton className="size-9 rounded-[12px]" />
        </div>
      </div>

      <ToolbarSkeleton />

      <GridSkeleton
        count={6}
        card={<SnippetCardSkeleton />}
        label="Loading snippets"
      />
    </div>
  )
}

export { TagDetailsSkeleton }
