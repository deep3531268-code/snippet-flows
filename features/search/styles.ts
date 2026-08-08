import { cn } from "@/lib/utils"

export function searchRowClassName(active: boolean): string {
  return cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm outline-none transition-colors",
    "focus-visible:ring-2 focus-visible:ring-ring",
    active
      ? "bg-muted text-foreground shadow-sm ring-1 ring-ring/50"
      : "text-foreground/90 hover:bg-muted/60",
  )
}

export function searchStateRowClassName(): string {
  return cn(
    "flex w-full cursor-default items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground",
  )
}
