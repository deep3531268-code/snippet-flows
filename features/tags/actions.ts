"use server"

import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { requireUser } from "@/features/auth/session"
import { recentService } from "@/features/recent/service"
import { decodeCursor } from "@/features/shared/pagination/cursor"
import { PAGINATION_CONFIG } from "@/features/shared/pagination/config"
import type { Page } from "@/features/shared/pagination/types"
import {
  addSnippetsToTagSchema,
  bulkDeleteTagsSchema,
  bulkDuplicateTagsSchema,
  createTagSchema,
  removeSnippetFromTagSchema,
  tagIdSchema,
  updateTagSchema,
} from "./schemas"
import { toTagListItem } from "./serializer"
import { tagService } from "./service"
import type { TagListItem, TagSort } from "./types"

const TAG_SORTS: TagSort[] = ["updated", "created", "az", "za", "count"]

export type TagPageArgs = {
  cursor: string | null
  query?: string
  sort?: TagSort
}

export async function loadMoreTags(
  args: TagPageArgs,
): Promise<Page<TagListItem>> {
  const userId = await requireUserId()
  const cursor = decodeCursor(args.cursor)
  const page = await tagService.listTagsPage(
    userId,
    {
      query: args.query
        ? args.query.trim().slice(0, PAGINATION_CONFIG.maxQueryLength)
        : undefined,
      sort: TAG_SORTS.includes(args.sort ?? "updated") ? args.sort : undefined,
    },
    cursor,
  )
  return { ...page, items: page.items.map(toTagListItem) }
}

export type TagFormState = {
  error?: string
  fieldErrors?: Record<string, string[] | undefined>
  tagId?: string
} | null

export type TagMutationState = {
  ok?: boolean
  error?: string
} | null

async function requireUserId() {
  const user = await requireUser()
  return user.id
}

function parseId(raw: FormDataEntryValue | null) {
  const parsed = tagIdSchema.safeParse(String(raw ?? ""))
  return parsed.success ? parsed.data : null
}

function parseSnippetIds(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
}

function parseTagIdList(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .filter((id) => tagIdSchema.safeParse(id).success)
}

function message(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function isNameTakenError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  )
}

export async function createTag(
  _prevState: TagFormState,
  formData: FormData,
): Promise<TagFormState> {
  const userId = await requireUserId()

  const parsed = createTagSchema.safeParse({
    name: formData.get("name"),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    const tag = await tagService.createTag(userId, parsed.data)
    await recentService.record(userId, {
      targetType: "tag",
      action: "created",
      targetId: tag.id,
      title: tag.name,
    })
    revalidatePath("/dashboard/tags")
    return { tagId: tag.id }
  } catch (error) {
    if (isNameTakenError(error)) {
      return { fieldErrors: { name: ["A tag with this name already exists"] } }
    }
    return { error: message(error, "Failed to create tag") }
  }
}

export async function updateTag(
  _prevState: TagFormState,
  formData: FormData,
): Promise<TagFormState> {
  const userId = await requireUserId()

  const parsed = updateTagSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    const tag = await tagService.updateTag(userId, parsed.data)
    await recentService.record(userId, {
      targetType: "tag",
      action: "updated",
      targetId: tag.id,
      title: tag.name,
    })
    revalidatePath("/dashboard/tags")
    return { tagId: tag.id }
  } catch (error) {
    if (isNameTakenError(error)) {
      return { fieldErrors: { name: ["A tag with this name already exists"] } }
    }
    return { error: message(error, "Failed to update tag") }
  }
}

export async function deleteTag(
  formData: FormData,
): Promise<TagMutationState> {
  const userId = await requireUserId()
  const id = parseId(formData.get("id"))
  if (!id) return { error: "Invalid tag id" }

  try {
    await tagService.deleteTag(userId, id)
    revalidatePath("/dashboard/tags")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to delete tag") }
  }
}

export async function duplicateTag(
  formData: FormData,
): Promise<TagMutationState> {
  const userId = await requireUserId()
  const id = parseId(formData.get("id"))
  if (!id) return { error: "Invalid tag id" }

  try {
    await tagService.duplicateTag(userId, id)
    revalidatePath("/dashboard/tags")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to duplicate tag") }
  }
}

export async function addSnippetsToTag(
  formData: FormData,
): Promise<TagMutationState> {
  const userId = await requireUserId()

  const parsed = addSnippetsToTagSchema.safeParse({
    tagId: String(formData.get("tagId") ?? ""),
    snippetIds: parseSnippetIds(formData.get("snippetIds")),
  })
  if (!parsed.success) return { error: "Invalid tag or snippet" }

  try {
    await tagService.addSnippetsToTag(
      userId,
      parsed.data.tagId,
      parsed.data.snippetIds,
    )
    revalidatePath("/dashboard/tags")
    revalidatePath(`/dashboard/tags/${parsed.data.tagId}`)
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to add snippets") }
  }
}

export async function removeSnippetFromTag(
  formData: FormData,
): Promise<TagMutationState> {
  const userId = await requireUserId()

  const parsed = removeSnippetFromTagSchema.safeParse({
    tagId: String(formData.get("tagId") ?? ""),
    snippetId: String(formData.get("snippetId") ?? ""),
  })
  if (!parsed.success) return { error: "Invalid tag or snippet" }

  try {
    await tagService.removeSnippetFromTag(
      userId,
      parsed.data.tagId,
      parsed.data.snippetId,
    )
    revalidatePath("/dashboard/tags")
    revalidatePath(`/dashboard/tags/${parsed.data.tagId}`)
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to remove snippet") }
  }
}

export async function bulkDeleteTags(
  formData: FormData,
): Promise<TagMutationState> {
  const userId = await requireUserId()

  const parsed = bulkDeleteTagsSchema.safeParse({
    ids: parseTagIdList(formData.get("ids")),
  })
  if (!parsed.success) return { error: "No valid tags selected" }

  try {
    await tagService.deleteTags(userId, parsed.data.ids)
    revalidatePath("/dashboard/tags")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to delete tags") }
  }
}

export async function bulkDuplicateTags(
  formData: FormData,
): Promise<TagMutationState> {
  const userId = await requireUserId()

  const parsed = bulkDuplicateTagsSchema.safeParse({
    ids: parseTagIdList(formData.get("ids")),
  })
  if (!parsed.success) return { error: "No valid tags selected" }

  try {
    await tagService.duplicateTags(userId, parsed.data.ids)
    revalidatePath("/dashboard/tags")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to duplicate tags") }
  }
}
