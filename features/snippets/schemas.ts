import { z } from "zod"

import { SNIPPET_LANGUAGES } from "./languages"

const snippetIdSchema = z.string().uuid("Invalid snippet id")

const snippetFields = {
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer")
    .transform((value) => (value === "" ? null : value))
    .nullable(),
  content: z
    .string()
    .min(1, "Code content is required")
    .max(100_000, "Code content must be 100,000 characters or fewer"),
  language: z.enum(SNIPPET_LANGUAGES, { message: "Choose a language" }),
  isPublic: z.boolean(),
  tags: z
    .array(z.string().trim().min(1).max(50, "Tags are 50 characters or fewer"))
    .max(10, "Add at most 10 tags")
    .default([]),
} as const

export const createSnippetSchema = z.object(snippetFields)

export const updateSnippetSchema = z.object({
  id: snippetIdSchema,
  ...snippetFields,
})

export type CreateSnippetInput = z.infer<typeof createSnippetSchema>
export type UpdateSnippetInput = z.infer<typeof updateSnippetSchema>

export { snippetIdSchema }
