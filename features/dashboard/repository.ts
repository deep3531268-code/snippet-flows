import "server-only"

import { prisma } from "@/lib/prisma"

export const dashboardRepository = {
  recentSnippets(userId: string, limit = 5) {
    return prisma.snippet.findMany({
      where: { userId, deletedAt: null, isArchived: false },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        language: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: { tag: { select: { id: true, name: true } } },
          take: 3,
        },
        collections: {
          select: { collection: { select: { id: true, name: true } } },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
    })
  },

  latestCollections(userId: string, limit = 4) {
    return prisma.collection.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { snippets: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
    })
  },

  recentTags(userId: string, limit = 4) {
    return prisma.tag.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  },
}
