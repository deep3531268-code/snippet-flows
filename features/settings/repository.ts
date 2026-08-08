import "server-only"

import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const settingsRepository = {
  async findByUserId(userId: string): Promise<Record<string, unknown>> {
    const row = await prisma.userSettings.findUnique({
      where: { userId },
      select: { data: true },
    })
    if (!row || typeof row.data !== "object" || row.data === null) return {}
    return row.data as Record<string, unknown>
  },

  upsert(userId: string, data: Record<string, unknown>) {
    return prisma.userSettings.upsert({
      where: { userId },
      update: { data: data as Prisma.InputJsonValue },
      create: { userId, data: data as Prisma.InputJsonValue },
    })
  },
}
