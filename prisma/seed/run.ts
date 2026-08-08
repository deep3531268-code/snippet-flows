import { Prisma, PrismaClient } from "@prisma/client"

import {
  DEMO_USER_EMAIL,
  DEMO_USER_ID,
  DEMO_USER_NAME,
  TAG_POOL,
  resolveAnchorDate,
} from "./constants"
import { assertDataset, SNIPPETS } from "./dataset"
import {
  buildCollections,
  buildSnippets,
  buildTags,
  deriveMetadata,
  subDays,
} from "./factories"

const TARGET_METADATA = {
  isFavorite: 20,
  isArchived: 10,
  isPublic: 15,
} as const

// Verify the computed distribution before writing anything, so a regression in
// the derivation logic fails fast and the seed never commits wrong counts.
function assertMetadataDistribution() {
  const counts = { isFavorite: 0, isArchived: 0, isPublic: 0 }
  for (let index = 0; index < SNIPPETS.length; index++) {
    const metadata = deriveMetadata(index)
    counts.isFavorite += metadata.isFavorite ? 1 : 0
    counts.isArchived += metadata.isArchived ? 1 : 0
    counts.isPublic += metadata.isPublic ? 1 : 0
  }
  for (const key of Object.keys(TARGET_METADATA) as Array<
    keyof typeof TARGET_METADATA
  >) {
    if (counts[key] !== TARGET_METADATA[key]) {
      throw new Error(
        `Seed metadata distribution mismatch: expected ${key}=${TARGET_METADATA[key]}, got ${counts[key]}`,
      )
    }
  }
  return counts
}

const TARGET_TAG_COUNT = Object.values(TAG_POOL).flat().length

function buildActivities(
  collections: Prisma.CollectionCreateManyInput[],
  snippets: Prisma.SnippetCreateManyInput[],
): Prisma.ActivityCreateManyInput[] {
  const activities: Prisma.ActivityCreateManyInput[] = []

  for (const collection of collections) {
    activities.push({
      userId: DEMO_USER_ID,
      targetType: "collection",
      action: "created",
      targetId: collection.id!,
      title: collection.name,
      createdAt: collection.createdAt,
    })
  }

  for (const snippet of snippets) {
    const createdAt = snippet.createdAt as Date
    const updatedAt = snippet.updatedAt as Date
    activities.push({
      userId: DEMO_USER_ID,
      targetType: "snippet",
      action: "created",
      targetId: snippet.id!,
      title: snippet.title,
      createdAt,
    })
    if (updatedAt.getTime() > createdAt.getTime()) {
      activities.push({
        userId: DEMO_USER_ID,
        targetType: "snippet",
        action: "updated",
        targetId: snippet.id!,
        title: snippet.title,
        createdAt: updatedAt,
      })
    }
  }

  return activities
}

// Deterministic VIEWED activity so the dashboard "Recently Viewed" section has
// realistic data. Every 7th snippet is never opened; the rest get a primary
// view whose recency is a deterministic permutation across the last 25 days at
// hour granularity (so the five most recent distinct views always hit five
// different snippets at distinct times), and a subset gets extra older views
// for frequency realism. Timestamps are clamped to be >= the snippet's
// createdAt so no view predates the snippet.
function buildViews(
  snippets: Prisma.SnippetCreateManyInput[],
): Prisma.ActivityCreateManyInput[] {
  const anchor = resolveAnchorDate()
  const views: Prisma.ActivityCreateManyInput[] = []

  snippets.forEach((snippet, index) => {
    if (index % 7 === 6) return

    const createdAt = snippet.createdAt as Date
    const clamp = (daysAgo: number) => {
      const viewedAt = subDays(anchor, daysAgo)
      return viewedAt > createdAt ? viewedAt : createdAt
    }

    const base = (createdAt: Date): Prisma.ActivityCreateManyInput => ({
      userId: DEMO_USER_ID,
      targetType: "snippet",
      action: "viewed",
      targetId: snippet.id!,
      title: snippet.title,
      createdAt,
    })

    views.push(base(clamp(((index * 111) % 600) / 24)))

    if (index % 4 === 0) {
      views.push(base(clamp(30 + (index % 4) * 5)))
    }
    if (index % 9 === 0) {
      views.push(base(clamp(60 + (index % 3) * 10)))
    }
  })

  return views
}

async function verifyDemoData(prisma: PrismaClient) {
  const [userCount, collectionCount, tagCount, snippetCount] = await Promise.all([
    prisma.user.count({ where: { id: DEMO_USER_ID } }),
    prisma.collection.count({ where: { userId: DEMO_USER_ID } }),
    prisma.tag.count({ where: { userId: DEMO_USER_ID } }),
    prisma.snippet.count({ where: { userId: DEMO_USER_ID } }),
  ])

  const perCollection = await prisma.snippetsOnCollections.groupBy({
    by: ["collectionId"],
    where: { collection: { userId: DEMO_USER_ID } },
    _count: true,
  })
  const perSnippetTags = await prisma.snippetsOnTags.groupBy({
    by: ["snippetId"],
    where: { snippet: { userId: DEMO_USER_ID } },
    _count: true,
  })

  // Mirror the recent service's `getRecentlyViewed` query so a regression in the
  // VIEWED seed data fails fast instead of leaving the dashboard section empty.
  const recentViewed = await prisma.activity.findMany({
    where: {
      userId: DEMO_USER_ID,
      targetType: "snippet",
      action: "viewed",
    },
    orderBy: { createdAt: "desc" },
    distinct: ["targetId"],
    take: 5,
  })

  const checks: Array<[string, boolean]> = [
    ["exactly 1 demo user", userCount === 1],
    ["exactly 4 collections", collectionCount === 4],
    ["exactly 100 snippets", snippetCount === 100],
    ["shared tag pool", tagCount === TARGET_TAG_COUNT],
    [
      "every collection has exactly 25 snippets",
      perCollection.length === 4 &&
        perCollection.every((row) => row._count === 25),
    ],
    [
      "every snippet has 2-4 tags",
      perSnippetTags.length === 100 &&
        perSnippetTags.every((row) => row._count >= 2 && row._count <= 4),
    ],
    [
      "recently viewed returns 5 distinct snippets",
      recentViewed.length === 5 &&
        new Set(recentViewed.map((row) => row.targetId)).size === 5,
    ],
  ]

  for (const [label, passed] of checks) {
    if (!passed) {
      throw new Error(`Seed validation failed: ${label}`)
    }
  }

  return {
    userCount,
    collectionCount,
    tagCount,
    snippetCount,
    recentlyViewedCount: recentViewed.length,
  }
}

export async function runSeed(): Promise<void> {
  const anchor = resolveAnchorDate()
  assertDataset(SNIPPETS)
  const metadata = assertMetadataDistribution()

  const prisma = new PrismaClient()

  try {
    await prisma.user.upsert({
      where: { id: DEMO_USER_ID },
      update: { email: DEMO_USER_EMAIL, name: DEMO_USER_NAME },
      create: {
        id: DEMO_USER_ID,
        email: DEMO_USER_EMAIL,
        name: DEMO_USER_NAME,
      },
    })

    const collections = buildCollections()
    const tags = buildTags()
    const { snippets, collectionLinks, tagLinks } = buildSnippets(SNIPPETS)
    const activities = [
      ...buildActivities(collections, snippets),
      ...buildViews(snippets),
    ]

    // Replace the demo dataset atomically. Deleting the demo user's rows (and
    // cascading their join rows) then bulk-inserting keeps the seed idempotent
    // and never duplicates existing data on re-runs.
    await prisma.$transaction(
      async (tx) => {
        await tx.activity.deleteMany({ where: { userId: DEMO_USER_ID } })
        await tx.collection.deleteMany({ where: { userId: DEMO_USER_ID } })
        await tx.tag.deleteMany({ where: { userId: DEMO_USER_ID } })
        await tx.snippet.deleteMany({ where: { userId: DEMO_USER_ID } })

        await tx.collection.createMany({ data: collections })
        await tx.tag.createMany({ data: tags })
        await tx.snippet.createMany({ data: snippets })
        await tx.snippetsOnCollections.createMany({ data: collectionLinks })
        await tx.snippetsOnTags.createMany({ data: tagLinks })
        await tx.activity.createMany({ data: activities })
      },
      { timeout: 60_000 },
    )

    const counts = await verifyDemoData(prisma)
    const activityCount = await prisma.activity.count({
      where: { userId: DEMO_USER_ID },
    })
    const collectionNames = collections.map((collection) => collection.name)

    console.log("Seeded demo dataset (idempotent, deterministic):")
    console.log(`  user        ${counts.userCount}  (${DEMO_USER_ID})`)
    console.log(
      `  collections ${counts.collectionCount}  (${collectionNames.join(", ")})`,
    )
    console.log(`  tags        ${counts.tagCount} shared pool`)
    console.log(
      `  snippets    ${counts.snippetCount}  (${metadata.isPublic} public, ${metadata.isFavorite} favorites, ${metadata.isArchived} archived)`,
    )
    console.log(`  activities  ${activityCount}`)
    console.log(
      `  recently viewed ${counts.recentlyViewedCount} distinct snippets`,
    )
    console.log(`  anchors     ${anchor.toISOString()}`)
  } finally {
    await prisma.$disconnect()
  }
}
