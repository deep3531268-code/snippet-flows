import type { Metadata } from "next"

import { requireUser } from "@/features/auth/session"
import { DashboardHome } from "@/features/dashboard/pages"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  await requireUser()

  return <DashboardHome />
}
