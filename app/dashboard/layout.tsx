import { requireUser } from "@/features/auth/session"
import { DashboardShell } from "@/features/dashboard/layout"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireUser()

  return <DashboardShell>{children}</DashboardShell>
}
