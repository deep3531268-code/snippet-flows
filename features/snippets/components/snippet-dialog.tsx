"use client"

import * as React from "react"
import { useActionState, useState } from "react"
import { toast } from "sonner"
import { Lock, X } from "lucide-react"

import { DashboardButton, DashboardInput } from "@/features/dashboard/ui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import {
  createSnippet,
  updateSnippet,
  type SnippetFormState,
} from "@/features/snippets/actions"
import type { SnippetListItem } from "@/features/snippets/types"
import { CodeEditor } from "./code-editor"
import { EditorToolbar } from "./editor-toolbar"

export type SnippetDraft = {
  title: string
  description: string
  content: string
  language: string
  tags: string[]
  isPublic: boolean
}

const initialState: SnippetFormState = null

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null
  return (
    <p role="alert" className="text-xs text-[#fb7185]">
      {errors[0]}
    </p>
  )
}

function SnippetForm({
  snippet,
  onSaved,
  onCancel,
  lockedTag,
}: {
  snippet: SnippetListItem | null
  onSaved: (draft: SnippetDraft) => void
  onCancel: () => void
  lockedTag?: string
}) {
  const isEdit = Boolean(snippet)

  const [title, setTitle] = useState(snippet?.title ?? "")
  const [description, setDescription] = useState(snippet?.description ?? "")
  const [language, setLanguage] = useState(snippet?.language ?? "plaintext")
  const [content, setContent] = useState(snippet?.content ?? "")
  const [isPublic, setIsPublic] = useState(snippet?.isPublic ?? false)
  const [tags, setTags] = useState<string[]>(
    snippet?.tags.map((item) => item.name) ??
      (lockedTag ? [lockedTag] : []),
  )
  const [tagInput, setTagInput] = useState("")

  const [state, formAction, pending] = useActionState(
    isEdit ? updateSnippet : createSnippet,
    initialState,
  )

  React.useEffect(() => {
    if (state?.snippetId) {
      onSaved({
        title,
        description: description.trim(),
        content,
        language,
        tags,
        isPublic,
      })
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, isEdit, title, description, content, language, tags, isPublic, onSaved])

  const addTag = (raw: string) => {
    const name = raw.trim().replace(/^#/, "")
    if (!name) return
    setTags((current) =>
      current.some((item) => item.toLowerCase() === name.toLowerCase()) ||
      current.length >= 10
        ? current
        : [...current, name],
    )
    setTagInput("")
  }

  const commitTagInput = () => {
    const parts = tagInput.split(",")
    parts.forEach(addTag)
    if (tagInput.includes(",")) setTagInput("")
  }

  return (
    <form action={formAction} className="grid gap-4">
      {snippet ? <input type="hidden" name="id" value={snippet.id} /> : null}

      <div className="grid gap-1.5">
        <label
          htmlFor="snippet-title"
          className="text-sm font-medium text-[#e8edf5]"
        >
          Title
        </label>
        <DashboardInput
          id="snippet-title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="useToggle hook"
          autoFocus
        />
        <FieldError errors={state?.fieldErrors?.title} />
      </div>

      <div className="grid gap-1.5">
        <label
          htmlFor="snippet-description"
          className="text-sm font-medium text-[#e8edf5]"
        >
          Description
        </label>
        <DashboardInput
          id="snippet-description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What does this snippet do?"
        />
        <FieldError errors={state?.fieldErrors?.description} />
      </div>

      <div className="grid gap-1.5">
        <label
          htmlFor="snippet-tags"
          className="text-sm font-medium text-[#e8edf5]"
        >
          Tags
        </label>
        {tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 rounded-full border border-[#2563eb]/25 bg-[#2563eb]/10 px-2.5 py-1 text-xs font-medium text-[#7cb3ff]"
              >
                {name}
                {lockedTag && name === lockedTag ? (
                  <span className="text-[#5b6b82]" aria-label={`${name} is locked`}>
                    <Lock className="size-3" />
                  </span>
                ) : (
                  <button
                    type="button"
                    aria-label={`Remove tag ${name}`}
                    onClick={() =>
                      setTags((current) =>
                        current.filter((item) => item !== name),
                      )
                    }
                    className="text-[#94a3b8] transition-colors hover:text-white"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : null}
        <DashboardInput
          id="snippet-tags"
          value={tagInput}
          onChange={(event) => setTagInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault()
              commitTagInput()
            }
          }}
          onBlur={commitTagInput}
          placeholder={tags.length === 0 ? "react, hooks" : "Add another tag…"}
          aria-label="Snippet tags"
        />
        <input type="hidden" name="tags" value={tags.join(",")} />
        <p className="text-xs text-[#5b6b82]">
          Press Enter or comma to add a tag. Up to 10 tags.
        </p>
      </div>

      <div className="grid gap-1.5">
        <label
          htmlFor="snippet-language"
          className="text-sm font-medium text-[#e8edf5]"
        >
          Code
        </label>
        <CodeEditor
          value={content}
          onChange={setContent}
          language={language}
          name="content"
          placeholder="Paste your code here…"
          toolbar={(controls) => (
            <EditorToolbar
              language={language}
              onLanguageChange={setLanguage}
              code={content}
              selectId="snippet-language"
              {...controls}
            />
          )}
        />
        <input type="hidden" name="language" value={language} />
        <FieldError errors={state?.fieldErrors?.language} />
        <FieldError errors={state?.fieldErrors?.content} />
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
        <div className="grid gap-0.5">
          <p className="text-sm leading-none font-medium text-[#e8edf5]">
            Public
          </p>
          <p className="text-xs text-[#94a3b8]">
            Anyone with the link can view
          </p>
        </div>
        <Switch
          checked={isPublic}
          onCheckedChange={setIsPublic}
          aria-label="Make snippet public"
        />
        <input
          type="hidden"
          name="isPublic"
          value={isPublic ? "on" : "off"}
        />
      </div>

      {state?.error ? (
        <p role="alert" className="text-sm text-[#fb7185]">
          {state.error}
        </p>
      ) : null}

      <DialogFooter className="gap-2">
        <DashboardButton
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </DashboardButton>
        <DashboardButton type="submit" disabled={pending}>
          {pending
            ? "Saving…"
            : isEdit
              ? "Save changes"
              : "Create snippet"}
        </DashboardButton>
      </DialogFooter>
    </form>
  )
}

function SnippetDialog({
  snippet,
  open,
  onOpenChange,
  onSaved,
  lockedTag,
}: {
  snippet: SnippetListItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (draft: SnippetDraft) => void
  lockedTag?: string
}) {
  const isEdit = Boolean(snippet)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/[0.08] bg-[#0f1826] text-[#e8edf5] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#f3f6fb]">
            {isEdit ? "Edit snippet" : "New snippet"}
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            {isEdit
              ? "Make changes to your snippet."
              : "Store a new snippet in your library."}
          </DialogDescription>
        </DialogHeader>

        <SnippetForm
          key={snippet?.id ?? "create"}
          snippet={snippet}
          onSaved={onSaved}
          onCancel={() => onOpenChange(false)}
          lockedTag={lockedTag}
        />
      </DialogContent>
    </Dialog>
  )
}

export { SnippetDialog }
