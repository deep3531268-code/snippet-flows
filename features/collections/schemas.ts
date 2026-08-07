import { z } from "zod"

const collectionIdSchema = z.string().uuid("Invalid collection id")

const snippetIdSchema = z.string().uuid("Invalid snippet id")

const collectionFields = {
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer")
    .transform((value) => (value === "" ? null : value))
    .nullable(),
} as const

export const createCollectionSchema = z.object(collectionFields)

export const updateCollectionSchema = z.object({
  id: collectionIdSchema,
  ...collectionFields,
})

export const deleteCollectionSchema = z.object({
  id: collectionIdSchema,
})

export const duplicateCollectionSchema = z.object({
  id: collectionIdSchema,
})

export const setSnippetCollectionsSchema = z.object({
  snippetId: snippetIdSchema,
  collectionIds: z.array(collectionIdSchema),
})

export const addSnippetsToCollectionSchema = z.object({
  collectionId: collectionIdSchema,
  snippetIds: z.array(snippetIdSchema),
})

export const removeSnippetFromCollectionSchema = z.object({
  collectionId: collectionIdSchema,
  snippetId: snippetIdSchema,
})

export const bulkDeleteCollectionsSchema = z.object({
  ids: z.array(collectionIdSchema).min(1, "Select at least one collection"),
})

export const bulkDuplicateCollectionsSchema = z.object({
  ids: z.array(collectionIdSchema).min(1, "Select at least one collection"),
})

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>
export type DeleteCollectionInput = z.infer<typeof deleteCollectionSchema>
export type DuplicateCollectionInput = z.infer<typeof duplicateCollectionSchema>
export type SetSnippetCollectionsInput = z.infer<
  typeof setSnippetCollectionsSchema
>
export type AddSnippetsToCollectionInput = z.infer<
  typeof addSnippetsToCollectionSchema
>
export type RemoveSnippetFromCollectionInput = z.infer<
  typeof removeSnippetFromCollectionSchema
>
export type BulkDeleteCollectionsInput = z.infer<
  typeof bulkDeleteCollectionsSchema
>
export type BulkDuplicateCollectionsInput = z.infer<
  typeof bulkDuplicateCollectionsSchema
>

export { collectionIdSchema }
