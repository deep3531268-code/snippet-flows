import type { User } from "@prisma/client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function initials(name: string | null, email: string) {
  const source = name?.trim() || email
  const parts = source.split(/[\s@]+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
  return `${first}${last}`.toUpperCase()
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date)
}

export function AccountSettings({ user }: { user: User }) {
  const displayName = user.name ?? "Unnamed user"

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={displayName} />
          ) : (
            <AvatarFallback>{initials(user.name, user.email)}</AvatarFallback>
          )}
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">{displayName}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <dl className="grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Display name
          </dt>
          <dd className="mt-0.5 text-sm">{user.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Email address
          </dt>
          <dd className="mt-0.5 text-sm">{user.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Member since
          </dt>
          <dd className="mt-0.5 text-sm">{formatDate(user.createdAt)}</dd>
        </div>
      </dl>
    </div>
  )
}
