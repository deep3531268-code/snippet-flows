import {
  GridSkeleton,
  SectionHeaderSkeleton,
  Skeleton,
  ToolbarSkeleton,
} from "@/features/shared/components"
import { cn } from "@/lib/utils"

function SnippetCardSkeleton({ className }: { className?: string }) {
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
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Skeleton className="size-8 rounded-[10px]" />
          <Skeleton className="size-8 rounded-[10px]" />
          <Skeleton className="size-8 rounded-[10px]" />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-1.5 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  )
}

function SnippetRowSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 px-2 py-2.5", className)}>
      <Skeleton className="size-4 shrink-0 rounded" />
      <Skeleton className="size-8 shrink-0 rounded-[10px]" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-4 w-48 max-w-full" />
        <Skeleton className="mt-1.5 h-3 w-72 max-w-full" />
      </div>
      <div className="hidden shrink-0 items-center gap-1.5 md:flex">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="hidden h-3 w-16 shrink-0 sm:block" />
      <div className="flex shrink-0 items-center gap-0.5">
        <Skeleton className="size-8 rounded-[10px]" />
        <Skeleton className="size-8 rounded-[10px]" />
        <Skeleton className="size-8 rounded-[10px]" />
      </div>
    </div>
  )
}

function SnippetsFeedSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <SectionHeaderSkeleton />
      <ToolbarSkeleton />
      <GridSkeleton
        count={6}
        card={<SnippetCardSkeleton />}
        label="Loading snippets"
      />
    </div>
  )
}

export { SnippetCardSkeleton, SnippetRowSkeleton, SnippetsFeedSkeleton }
