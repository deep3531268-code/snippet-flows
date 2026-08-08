"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/features/auth/session"
import { recentService } from "@/features/recent/service"
import {
  createSnippetSchema,
  snippetIdSchema,
  updateSnippetSchema,
} from "./schemas"
import { snippetService } from "./service"
import type { SnippetListItem } from "./types"

export type SnippetFormState = {
  error?: string
  fieldErrors?: Record<string, string[] | undefined>
  snippetId?: string
} | null

export type SnippetMutationState = {
  ok?: boolean
  error?: string
} | null

export type SnippetExportState = {
  ok?: boolean
  json?: string
  error?: string
} | null

async function requireUserId() {
  const user = await requireUser()
  return user.id
}

function parseId(raw: FormDataEntryValue | null) {
  const parsed = snippetIdSchema.safeParse(String(raw ?? ""))
  return parsed.success ? parsed.data : null
}

function parseIds(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .filter((id) => snippetIdSchema.safeParse(id).success)
}

function parseTags(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
}

function message(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export async function listSnippetOptions(): Promise<SnippetListItem[]> {
  const userId = await requireUserId()
  const snippets = await snippetService.getSnippetOptions(userId)
  return snippets.map((snippet) => ({
    id: snippet.id,
    title: snippet.title,
    description: snippet.description,
    content: "",
    language: snippet.language,
    isPublic: false,
    slug: null,
    isFavorite: false,
    isArchived: false,
    deletedAt: null,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    tags: [],
    collections: [],
  }))
}

export async function createSnippet(
  _prevState: SnippetFormState,
  formData: FormData,
): Promise<SnippetFormState> {
  const userId = await requireUserId()

  const parsed = createSnippetSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    content: formData.get("content"),
    language: formData.get("language"),
    isPublic: formData.get("isPublic") === "on",
    tags: parseTags(formData.get("tags")),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    const snippet = await snippetService.createSnippet(userId, parsed.data)
    await recentService.record(userId, {
      targetType: "snippet",
      action: "created",
      targetId: snippet.id,
      title: snippet.title,
    })
    revalidatePath("/snippets")
    return { snippetId: snippet.id }
  } catch (error) {
    return { error: message(error, "Failed to create snippet") }
  }
}

export async function updateSnippet(
  _prevState: SnippetFormState,
  formData: FormData,
): Promise<SnippetFormState> {
  const userId = await requireUserId()

  const parsed = updateSnippetSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    content: formData.get("content"),
    language: formData.get("language"),
    isPublic: formData.get("isPublic") === "on",
    tags: parseTags(formData.get("tags")),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    const snippet = await snippetService.updateSnippet(userId, parsed.data)
    await recentService.record(userId, {
      targetType: "snippet",
      action: "updated",
      targetId: snippet.id,
      title: snippet.title,
    })
    revalidatePath("/snippets")
    return { snippetId: snippet.id }
  } catch (error) {
    return { error: message(error, "Failed to update snippet") }
  }
}

export async function deleteSnippet(
  formData: FormData,
): Promise<SnippetMutationState> {
  const userId = await requireUserId()
  const id = parseId(formData.get("id"))
  if (!id) return { error: "Invalid snippet id" }

  try {
    await snippetService.deleteSnippet(userId, id)
    await recentService.recordSnippet(userId, id, "deleted")
    revalidatePath("/snippets")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to delete snippet") }
  }
}

export async function restoreSnippet(
  formData: FormData,
): Promise<SnippetMutationState> {
  const userId = await requireUserId()
  const id = parseId(formData.get("id"))
  if (!id) return { error: "Invalid snippet id" }

  try {
    await snippetService.restoreSnippet(userId, id)
    revalidatePath("/snippets")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to restore snippet") }
  }
}

export async function deleteSnippetForever(
  formData: FormData,
): Promise<SnippetMutationState> {
  const userId = await requireUserId()
  const id = parseId(formData.get("id"))
  if (!id) return { error: "Invalid snippet id" }

  try {
    await snippetService.deleteSnippetForever(userId, id)
    revalidatePath("/snippets")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to delete snippet permanently") }
  }
}

export async function duplicateSnippet(
  formData: FormData,
): Promise<SnippetMutationState> {
  const userId = await requireUserId()
  const id = parseId(formData.get("id"))
  if (!id) return { error: "Invalid snippet id" }

  try {
    const snippet = await snippetService.duplicateSnippet(userId, id)
    if (snippet) {
      await recentService.record(userId, {
        targetType: "snippet",
        action: "created",
        targetId: snippet.id,
        title: snippet.title,
      })
    }
    revalidatePath("/snippets")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to duplicate snippet") }
  }
}

export async function toggleSnippetFavorite(
  formData: FormData,
): Promise<SnippetMutationState> {
  const userId = await requireUserId()
  const id = parseId(formData.get("id"))
  if (!id) return { error: "Invalid snippet id" }

  try {
    const snippet = await snippetService.toggleFavorite(userId, id)
    if (snippet?.isFavorite) {
      await recentService.record(userId, {
        targetType: "snippet",
        action: "favorited",
        targetId: snippet.id,
        title: snippet.title,
      })
    }
    revalidatePath("/snippets")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to update snippet") }
  }
}

export async function toggleSnippetArchive(
  formData: FormData,
): Promise<SnippetMutationState> {
  const userId = await requireUserId()
  const id = parseId(formData.get("id"))
  if (!id) return { error: "Invalid snippet id" }

  try {
    const snippet = await snippetService.toggleArchive(userId, id)
    if (snippet?.isArchived) {
      await recentService.record(userId, {
        targetType: "snippet",
        action: "archived",
        targetId: snippet.id,
        title: snippet.title,
      })
    }
    revalidatePath("/snippets")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to update snippet") }
  }
}

export async function bulkFavoriteSnippets(
  formData: FormData,
): Promise<SnippetMutationState> {
  const userId = await requireUserId()
  const ids = parseIds(formData.get("ids"))
  if (ids.length === 0) return { error: "No valid snippets selected" }
  const isFavorite = formData.get("favorite") === "true"

  try {
    await snippetService.bulkSetFavorite(userId, ids, isFavorite)
    if (isFavorite) {
      await recentService.recordSnippets(userId, ids, "favorited")
    }
    revalidatePath("/snippets")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to update snippets") }
  }
}

export async function bulkArchiveSnippets(
  formData: FormData,
): Promise<SnippetMutationState> {
  const userId = await requireUserId()
  const ids = parseIds(formData.get("ids"))
  if (ids.length === 0) return { error: "No valid snippets selected" }

  try {
    await snippetService.bulkSetArchived(userId, ids, true)
    await recentService.recordSnippets(userId, ids, "archived")
    revalidatePath("/snippets")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to archive snippets") }
  }
}

export async function bulkDeleteSnippets(
  formData: FormData,
): Promise<SnippetMutationState> {
  const userId = await requireUserId()
  const ids = parseIds(formData.get("ids"))
  if (ids.length === 0) return { error: "No valid snippets selected" }

  try {
    await snippetService.bulkDeleteSnippets(userId, ids)
    await recentService.recordSnippets(userId, ids, "deleted")
    revalidatePath("/snippets")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to delete snippets") }
  }
}

export async function toggleSnippetVisibility(
  formData: FormData,
): Promise<SnippetMutationState> {
  const userId = await requireUserId()
  const id = parseId(formData.get("id"))
  if (!id) return { error: "Invalid snippet id" }
  const isPublic =
    formData.get("isPublic") === "on" || formData.get("isPublic") === "true"

  try {
    await snippetService.setVisibility(userId, id, isPublic)
    revalidatePath("/snippets")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to update sharing") }
  }
}

export async function exportSnippets(
  formData: FormData,
): Promise<SnippetExportState> {
  const userId = await requireUserId()
  const scope = formData.get("scope")
  if (scope !== "all" && scope !== "favorites" && scope !== "archived") {
    return { error: "Invalid export scope" }
  }

  try {
    const data = await snippetService.getSnippetsExport(userId, scope)
    return { ok: true, json: JSON.stringify(data, null, 2) }
  } catch (error) {
    return { error: message(error, "Failed to export snippets") }
  }
}
