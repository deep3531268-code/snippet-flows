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
import { Switch } from "@/components/ui/switch"
import {
  createCollection,
  updateCollection,
  type CollectionFormState,
} from "@/features/collections/actions"
import { COLLECTION_ACCENTS } from "../query"
import type { CollectionAccent, CollectionListItem } from "../types"
import { cn } from "@/lib/utils"

const ACCENT_PICKER: Record<CollectionAccent, string> = {
  blue: "bg-[#2563eb]",
  green: "bg-[#10b981]",
  purple: "bg-[#8b5cf6]",
  orange: "bg-[#f59e0b]",
  pink: "bg-[#ec4899]",
  teal: "bg-[#14b8a6]",
}

const initialState: CollectionFormState = null

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null
  return (
    <p role="alert" className="text-xs text-[#fb7185]">
      {errors[0]}
    </p>
  )
}

function CollectionForm({
  collection,
  onSaved,
  onCancel,
}: {
  collection: CollectionListItem | null
  onSaved: (draft: {
    name: string
    description: string
    isPublic: boolean
    accent: CollectionAccent
  }) => void
  onCancel: () => void
}) {
  const isEdit = Boolean(collection)

  const [name, setName] = useState(collection?.name ?? "")
  const [description, setDescription] = useState(collection?.description ?? "")
  const [isPublic, setIsPublic] = useState(collection?.isPublic ?? false)
  const [accent, setAccent] = useState<CollectionAccent>(
    collection?.accent ?? "blue",
  )

  const [state, formAction, pending] = useActionState(
    isEdit ? updateCollection : createCollection,
    initialState,
  )

  const handledState = React.useRef<CollectionFormState>(null)

  React.useEffect(() => {
    if (!state) return
    if (handledState.current === state) return
    handledState.current = state

    if (state.collectionId) {
      onSaved({
        name,
        description: description.trim(),
        isPublic,
        accent,
      })
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state, name, description, isPublic, accent, onSaved, isEdit])

  return (
    <form action={formAction} className="grid gap-4">
      {collection ? (
        <input type="hidden" name="id" value={collection.id} />
      ) : null}

      <div className="grid gap-1.5">
        <label
          htmlFor="collection-name"
          className="text-sm font-medium text-[#e8edf5]"
        >
          Name
        </label>
        <DashboardInput
          id="collection-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Design system"
          autoFocus
        />
        <FieldError errors={state?.fieldErrors?.name} />
      </div>

      <div className="grid gap-1.5">
        <label
          htmlFor="collection-description"
          className="text-sm font-medium text-[#e8edf5]"
        >
          Description
        </label>
        <DashboardInput
          id="collection-description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What does this collection hold?"
        />
        <FieldError errors={state?.fieldErrors?.description} />
      </div>

      <div className="grid gap-1.5">
        <p className="text-sm font-medium text-[#e8edf5]">Color</p>
        <div className="flex flex-wrap items-center gap-2">
          {COLLECTION_ACCENTS.map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} accent`}
              aria-pressed={accent === value}
              onClick={() => setAccent(value)}
              className={cn(
                "size-7 rounded-full transition-all",
                ACCENT_PICKER[value],
                accent === value
                  ? "scale-110 ring-2 ring-white/80 ring-offset-2 ring-offset-[#0f1826]"
                  : "opacity-70 hover:scale-105 hover:opacity-100",
              )}
            />
          ))}
        </div>
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
          aria-label="Make collection public"
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
        <DashboardButton type="submit" disabled={pending || !name.trim()}>
          {pending
            ? "Saving…"
            : isEdit
              ? "Save changes"
              : "Create collection"}
        </DashboardButton>
      </DialogFooter>
    </form>
  )
}

function CollectionDialog({
  open,
  onOpenChange,
  onSaved,
  collection,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (draft: {
    name: string
    description: string
    isPublic: boolean
    accent: CollectionAccent
  }) => void
  collection?: CollectionListItem | null
}) {
  const isEdit = Boolean(collection)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/[0.08] bg-[#0f1826] text-[#e8edf5] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#f3f6fb]">
            {isEdit ? "Edit collection" : "New collection"}
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            {isEdit
              ? "Update the collection details."
              : "Group related snippets together for fast access."}
          </DialogDescription>
        </DialogHeader>

        <CollectionForm
          key={collection?.id ?? "create"}
          collection={collection}
          onSaved={onSaved}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export { CollectionDialog }
