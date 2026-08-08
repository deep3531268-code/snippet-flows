"use server"

import { requireUser } from "@/features/auth/session"
import { dashboardService } from "./service"

export async function getDashboardData() {
  const user = await requireUser()
  return dashboardService.getDashboardData(user.id, user.name)
}

export async function getRecentPageData() {
  const user = await requireUser()
  return dashboardService.getRecentPageData(user.id)
}
