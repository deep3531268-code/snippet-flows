import { requireUser } from "@/features/auth/session"
import { AccountSettings } from "@/features/settings/components/account-settings"
import { DashboardSettings } from "@/features/settings/components/dashboard-settings"
import { EditorSettings } from "@/features/settings/components/editor-settings"
import { ExportData } from "@/features/settings/components/export-data"
import { SettingsSection } from "@/features/settings/components/settings-section"
import { ThemeSettings } from "@/features/settings/components/theme-settings"

export const metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  const user = await requireUser()

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
        <SettingsSection
          title="General"
          description="Choose how SnippetFlow looks across all pages."
        >
          <ThemeSettings />
        </SettingsSection>

        <SettingsSection
          title="Editor"
          description="Default behavior for the code editor."
        >
          <EditorSettings />
        </SettingsSection>

        <SettingsSection
          title="Dashboard"
          description="Default view and ordering for your lists."
        >
          <DashboardSettings />
        </SettingsSection>

        <SettingsSection
          title="Account"
          description="Your account is managed by Neon Auth, so profile details are read-only here."
        >
          <AccountSettings user={user} />
        </SettingsSection>

        <SettingsSection
          title="Data"
          description="Download your snippets as a JSON file."
        >
          <ExportData />
        </SettingsSection>
      </div>
    </div>
  )
}
