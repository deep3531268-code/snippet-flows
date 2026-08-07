import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

function ToolbarSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("flex flex-wrap items-center gap-3", className)}
    >
      <Skeleton className="h-10 min-w-56 flex-1 basis-64 rounded-[12px]" />
      <Skeleton className="h-10 w-16 rounded-[12px]" />
      <Skeleton className="h-10 w-24 rounded-[12px]" />
      <div className="ml-auto flex items-center gap-1 rounded-[12px] border border-white/[0.06] bg-white/[0.03] p-1">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
    </div>
  )
}

export { ToolbarSkeleton }
