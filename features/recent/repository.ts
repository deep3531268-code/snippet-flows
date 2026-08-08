import "server-only"

import { prisma } from "@/lib/prisma"
import type { ActivityAction } from "./config"
import type { RecordActivityInput } from "./types"

export const recentRepository = {
  create(userId: string, input: RecordActivityInput) {
    return prisma.activity.create({
      data: { userId, ...input },
    })
  },

  createMany(userId: string, entries: RecordActivityInput[]) {
    return prisma.activity.createMany({
      data: entries.map((entry) => ({ userId, ...entry })),
    })
  },

  findActivity(userId: string, limit: number) {
    return prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  },

  findRecent(
    userId: string,
    actions: readonly ActivityAction[],
    limit: number,
    distinctByTarget = false,
  ) {
    return prisma.activity.findMany({
      where: { userId, action: { in: [...actions] } },
      orderBy: { createdAt: "desc" },
      ...(distinctByTarget ? { distinct: ["targetId"] as const } : {}),
      take: limit,
    })
  },

  count(userId: string) {
    return prisma.activity.count({ where: { userId } })
  },

  async trim(userId: string, keep: number) {
    const count = await prisma.activity.count({ where: { userId } })
    if (count <= keep) return

    const excess = count - keep
    const oldest = await prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
      take: excess,
    })
    if (oldest.length === 0) return

    await prisma.activity.deleteMany({
      where: { id: { in: oldest.map((item) => item.id) } },
    })
  },
}
