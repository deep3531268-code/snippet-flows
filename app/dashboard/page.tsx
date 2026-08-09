import type { Metadata } from "next"

import { DashboardHome } from "@/features/dashboard/pages"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  return <DashboardHome />
}
