import { z } from "zod"

import { OPERATION_LIMITS } from "@/features/shared/config"

const tagIdSchema = z.string().uuid("Invalid tag id")

const tagFields = {
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or fewer"),
} as const

export const createTagSchema = z.object(tagFields)

export const updateTagSchema = z.object({
  id: tagIdSchema,
  ...tagFields,
})

export const deleteTagSchema = z.object({
  id: tagIdSchema,
})

export const duplicateTagSchema = z.object({
  id: tagIdSchema,
})

export const bulkDeleteTagsSchema = z.object({
  ids: z.array(tagIdSchema).min(1, "No tags selected").max(OPERATION_LIMITS.maxBulkIds),
})

export const bulkDuplicateTagsSchema = z.object({
  ids: z.array(tagIdSchema).min(1, "No tags selected").max(OPERATION_LIMITS.maxBulkIds),
})

const snippetIdSchema = z.string().uuid("Invalid snippet id")

export const addSnippetsToTagSchema = z.object({
  tagId: tagIdSchema,
  snippetIds: z.array(snippetIdSchema).max(OPERATION_LIMITS.maxBulkIds),
})

export const removeSnippetFromTagSchema = z.object({
  tagId: tagIdSchema,
  snippetId: snippetIdSchema,
})

export type CreateTagInput = z.infer<typeof createTagSchema>
export type UpdateTagInput = z.infer<typeof updateTagSchema>
export type DeleteTagInput = z.infer<typeof deleteTagSchema>
export type DuplicateTagInput = z.infer<typeof duplicateTagSchema>
export type BulkDeleteTagsInput = z.infer<typeof bulkDeleteTagsSchema>
export type BulkDuplicateTagsInput = z.infer<typeof bulkDuplicateTagsSchema>
export type AddSnippetsToTagInput = z.infer<typeof addSnippetsToTagSchema>
export type RemoveSnippetFromTagInput = z.infer<
  typeof removeSnippetFromTagSchema
>

export { tagIdSchema }
