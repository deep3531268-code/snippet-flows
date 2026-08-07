import { cn } from "@/lib/utils"

export function WorkspaceSection({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("grid gap-3", className)}>
      <div className="grid gap-0.5">
        <h2 className="font-heading text-sm font-medium tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
