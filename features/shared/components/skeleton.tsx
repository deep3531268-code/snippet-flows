import * as React from "react"

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      data-slot="skeleton"
      className={cn(
        "animate-shimmer rounded-[10px] bg-white/[0.06]",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
