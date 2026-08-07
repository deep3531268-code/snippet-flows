import { requireUser } from "@/features/auth/session"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExportData } from "@/features/settings/components/export-data"
import { ThemeSettings } from "@/features/settings/components/theme-settings"

export const metadata = {
  title: "Settings",
}

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

export default async function SettingsPage() {
  const user = await requireUser()
  const displayName = user.name ?? "Unnamed user"

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:py-10">
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <section className="rounded-xl border bg-card p-5">
          <div className="mb-4">
            <h2 className="font-medium">Profile</h2>
            <p className="text-sm text-muted-foreground">
              Your account is managed by Neon Auth, so profile details are
              read-only here.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={displayName} />
              ) : (
                <AvatarFallback>
                  {initials(user.name, user.email)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{displayName}</p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <dl className="mt-5 grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-2">
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
        </section>

        <section className="rounded-xl border bg-card p-5">
          <div className="mb-4">
            <h2 className="font-medium">Theme</h2>
            <p className="text-sm text-muted-foreground">
              Choose how SnippetFlow looks.
            </p>
          </div>
          <ThemeSettings />
        </section>

        <section className="rounded-xl border bg-card p-5">
          <div className="mb-4">
            <h2 className="font-medium">Export data</h2>
            <p className="text-sm text-muted-foreground">
              Download your snippets as a JSON file.
            </p>
          </div>
          <ExportData />
        </section>
      </div>
    </div>
  )
}
