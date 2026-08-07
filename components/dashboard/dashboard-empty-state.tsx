import type { LucideIcon } from "lucide-react"

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex animate-fade-in flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed bg-card/50 px-6 py-10 text-center motion-reduce:animate-none">
      <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
        <Icon className="size-4" aria-hidden />
      </div>
      <div className="grid gap-0.5">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {children}
        </div>
      ) : null}
    </div>
  )
}
