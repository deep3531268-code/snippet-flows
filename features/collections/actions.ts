"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/features/auth/session"
import {
  addSnippetsToCollectionSchema,
  bulkDeleteCollectionsSchema,
  bulkDuplicateCollectionsSchema,
  collectionIdSchema,
  createCollectionSchema,
  removeSnippetFromCollectionSchema,
  setSnippetCollectionsSchema,
  updateCollectionSchema,
} from "./schemas"
import { collectionService } from "./service"

export type CollectionFormState = {
  error?: string
  fieldErrors?: Record<string, string[] | undefined>
  collectionId?: string
} | null

export type CollectionMutationState = {
  ok?: boolean
  error?: string
} | null

async function requireUserId() {
  const user = await requireUser()
  return user.id
}

function parseId(raw: FormDataEntryValue | null) {
  const parsed = collectionIdSchema.safeParse(String(raw ?? ""))
  return parsed.success ? parsed.data : null
}

function message(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function parseCollectionIds(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .filter((id) => collectionIdSchema.safeParse(id).success)
}

function parseSnippetIds(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
}

function parseCollectionIdList(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .filter((id) => collectionIdSchema.safeParse(id).success)
}

export async function listCollectionOptions() {
  const userId = await requireUserId()
  const collections = await collectionService.listCollections(userId)
  return collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
  }))
}

export async function createCollection(
  _prevState: CollectionFormState,
  formData: FormData,
): Promise<CollectionFormState> {
  const userId = await requireUserId()

  const parsed = createCollectionSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    const collection = await collectionService.createCollection(
      userId,
      parsed.data,
    )
    revalidatePath("/collections")
    return { collectionId: collection.id }
  } catch (error) {
    return { error: message(error, "Failed to create collection") }
  }
}

export async function updateCollection(
  _prevState: CollectionFormState,
  formData: FormData,
): Promise<CollectionFormState> {
  const userId = await requireUserId()

  const parsed = updateCollectionSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    const collection = await collectionService.updateCollection(
      userId,
      parsed.data,
    )
    revalidatePath("/collections")
    return { collectionId: collection.id }
  } catch (error) {
    return { error: message(error, "Failed to update collection") }
  }
}

export async function deleteCollection(
  formData: FormData,
): Promise<CollectionMutationState> {
  const userId = await requireUserId()
  const id = parseId(formData.get("id"))
  if (!id) return { error: "Invalid collection id" }

  try {
    await collectionService.deleteCollection(userId, id)
    revalidatePath("/collections")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to delete collection") }
  }
}

export async function duplicateCollection(
  formData: FormData,
): Promise<CollectionMutationState> {
  const userId = await requireUserId()
  const id = parseId(formData.get("id"))
  if (!id) return { error: "Invalid collection id" }

  try {
    await collectionService.duplicateCollection(userId, id)
    revalidatePath("/collections")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to duplicate collection") }
  }
}

export async function setSnippetCollections(
  formData: FormData,
): Promise<CollectionMutationState> {
  const userId = await requireUserId()

  const parsed = setSnippetCollectionsSchema.safeParse({
    snippetId: String(formData.get("snippetId") ?? ""),
    collectionIds: parseCollectionIds(formData.get("collectionIds")),
  })
  if (!parsed.success) return { error: "Invalid snippet or collection" }

  try {
    await collectionService.setSnippetCollections(
      userId,
      parsed.data.snippetId,
      parsed.data.collectionIds,
    )
    revalidatePath("/dashboard/snippets")
    revalidatePath("/dashboard/collections")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to update collections") }
  }
}

export async function addSnippetsToCollection(
  formData: FormData,
): Promise<CollectionMutationState> {
  const userId = await requireUserId()

  const parsed = addSnippetsToCollectionSchema.safeParse({
    collectionId: String(formData.get("collectionId") ?? ""),
    snippetIds: parseSnippetIds(formData.get("snippetIds")),
  })
  if (!parsed.success) return { error: "Invalid collection or snippet" }

  try {
    await collectionService.addSnippetsToCollection(
      userId,
      parsed.data.collectionId,
      parsed.data.snippetIds,
    )
    revalidatePath("/dashboard/collections")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to add snippets") }
  }
}

export async function removeSnippetFromCollection(
  formData: FormData,
): Promise<CollectionMutationState> {
  const userId = await requireUserId()

  const parsed = removeSnippetFromCollectionSchema.safeParse({
    collectionId: String(formData.get("collectionId") ?? ""),
    snippetId: String(formData.get("snippetId") ?? ""),
  })
  if (!parsed.success) return { error: "Invalid collection or snippet" }

  try {
    await collectionService.removeSnippetFromCollection(
      userId,
      parsed.data.collectionId,
      parsed.data.snippetId,
    )
    revalidatePath("/dashboard/collections")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to remove snippet") }
  }
}

export async function bulkDeleteCollections(
  formData: FormData,
): Promise<CollectionMutationState> {
  const userId = await requireUserId()

  const parsed = bulkDeleteCollectionsSchema.safeParse({
    ids: parseCollectionIdList(formData.get("ids")),
  })
  if (!parsed.success) return { error: "No valid collections selected" }

  try {
    await collectionService.deleteCollections(userId, parsed.data.ids)
    revalidatePath("/dashboard/collections")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to delete collections") }
  }
}

export async function bulkDuplicateCollections(
  formData: FormData,
): Promise<CollectionMutationState> {
  const userId = await requireUserId()

  const parsed = bulkDuplicateCollectionsSchema.safeParse({
    ids: parseCollectionIdList(formData.get("ids")),
  })
  if (!parsed.success) return { error: "No valid collections selected" }

  try {
    await collectionService.duplicateCollections(userId, parsed.data.ids)
    revalidatePath("/dashboard/collections")
    return { ok: true }
  } catch (error) {
    return { error: message(error, "Failed to duplicate collections") }
  }
}
