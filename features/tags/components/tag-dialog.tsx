"use client"

import * as React from "react"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import { DashboardButton, DashboardInput } from "@/features/dashboard/ui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  createTag,
  updateTag,
  type TagFormState,
} from "../actions"
import { TAG_COLOR_LABELS, TAG_COLOR_SWATCH, TAG_COLORS } from "../query"
import type { TagColor, TagListItem } from "../types"
import { cn } from "@/lib/utils"

const initialState: TagFormState = null

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null
  return (
    <p role="alert" className="text-xs text-[#fb7185]">
      {errors[0]}
    </p>
  )
}

function TagForm({
  tag,
  onSaved,
  onCancel,
}: {
  tag: TagListItem | null
  onSaved: (draft: { name: string; color: TagColor }) => void
  onCancel: () => void
}) {
  const isEdit = Boolean(tag)

  const [name, setName] = useState(tag?.name ?? "")
  const [color, setColor] = useState<TagColor>(tag?.color ?? "blue")

  const [state, formAction, pending] = useActionState(
    isEdit ? updateTag : createTag,
    initialState,
  )

  const handledState = React.useRef<TagFormState>(null)

  React.useEffect(() => {
    if (!state) return
    if (handledState.current === state) return
    handledState.current = state

    if (state.tagId) {
      onSaved({ name: name.trim(), color })
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state, name, color, onSaved, isEdit])

  return (
    <form action={formAction} className="grid gap-4">
      {tag ? (
        <input type="hidden" name="id" value={tag.id} />
      ) : null}

      <div className="grid gap-1.5">
        <label
          htmlFor="tag-name"
          className="text-sm font-medium text-[#e8edf5]"
        >
          Name
        </label>
        <DashboardInput
          id="tag-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="React"
          autoFocus
        />
        <FieldError errors={state?.fieldErrors?.name} />
      </div>

      <div className="grid gap-1.5">
        <p className="text-sm font-medium text-[#e8edf5]">Color</p>
        <div className="flex flex-wrap items-center gap-2">
          {TAG_COLORS.map((value) => (
            <button
              key={value}
              type="button"
            aria-label={`${TAG_COLOR_LABELS[value]} color`}
            aria-pressed={color === value}
            disabled={pending}
            onClick={() => setColor(value)}
            className={cn(
                "size-7 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cb3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1826] disabled:cursor-not-allowed disabled:opacity-50",
                TAG_COLOR_SWATCH[value],
                color === value
                  ? "scale-110 ring-2 ring-white/80 ring-offset-2 ring-offset-[#0f1826]"
                  : "opacity-70 hover:scale-105 hover:opacity-100",
              )}
            />
          ))}
        </div>
      </div>

      {state?.error ? (
        <p role="alert" className="text-sm text-[#fb7185]">
          {state.error}
        </p>
      ) : null}

      <DialogFooter className="gap-2">
        <DashboardButton type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </DashboardButton>
        <DashboardButton type="submit" disabled={pending || !name.trim()}>
          {pending ? "Saving..." : isEdit ? "Save changes" : "Create tag"}
        </DashboardButton>
      </DialogFooter>
    </form>
  )
}

function TagDialog({
  open,
  onOpenChange,
  onSaved,
  tag,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (draft: { name: string; color: TagColor }) => void
  tag?: TagListItem | null
}) {
  const isEdit = Boolean(tag)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/[0.08] bg-[#0f1826] text-[#e8edf5] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#f3f6fb]">
            {isEdit ? "Edit tag" : "New tag"}
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            {isEdit
              ? "Update the tag details."
              : "Label snippets for fast filtering."}
          </DialogDescription>
        </DialogHeader>

        <TagForm
          key={tag?.id ?? "create"}
          tag={tag}
          onSaved={onSaved}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export { TagDialog }
