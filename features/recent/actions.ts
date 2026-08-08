"use server"

import { requireUser } from "@/features/auth/session"
import { snippetIdSchema } from "@/features/snippets/schemas"
import { collectionIdSchema } from "@/features/collections/schemas"
import { snippetService } from "@/features/snippets/service"
import { collectionService } from "@/features/collections/service"
import { recentService } from "./service"

type RecordResult = {
  ok?: boolean
  error?: string
}

async function requireUserId() {
  const user = await requireUser()
  return user.id
}

export async function recordSnippetViewed(id: string): Promise<RecordResult> {
  const userId = await requireUserId()
  if (!snippetIdSchema.safeParse(id).success) {
    return { error: "Invalid snippet id" }
  }

  const snippet = await snippetService.getSnippet(userId, id)
  if (!snippet) return { ok: true }

  await recentService.record(userId, {
    targetType: "snippet",
    action: "viewed",
    targetId: snippet.id,
    title: snippet.title,
  })
  return { ok: true }
}

export async function recordSnippetCopied(id: string): Promise<RecordResult> {
  const userId = await requireUserId()
  if (!snippetIdSchema.safeParse(id).success) {
    return { error: "Invalid snippet id" }
  }

  const snippet = await snippetService.getSnippet(userId, id)
  if (!snippet) return { ok: true }

  await recentService.record(userId, {
    targetType: "snippet",
    action: "copied",
    targetId: snippet.id,
    title: snippet.title,
  })
  return { ok: true }
}

export async function recordCollectionViewed(
  id: string,
): Promise<RecordResult> {
  const userId = await requireUserId()
  if (!collectionIdSchema.safeParse(id).success) {
    return { error: "Invalid collection id" }
  }

  const collection = await collectionService.getCollection(userId, id)
  if (!collection) return { ok: true }

  await recentService.record(userId, {
    targetType: "collection",
    action: "viewed",
    targetId: collection.id,
    title: collection.name,
  })
  return { ok: true }
}
