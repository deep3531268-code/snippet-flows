"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { EllipsisVertical, Folder, Globe, Lock, Pencil, Plus } from "lucide-react"

import {
  DashboardBadge,
  DashboardButton,
  EmptyState,
  IconButton,
} from "@/features/dashboard/ui"
import { DashboardBack } from "@/features/dashboard/layout"
import { SnippetDialogProvider } from "@/features/snippets/components/snippet-dialog-provider"
import { SnippetList } from "@/features/snippets/components/snippet-list"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RelativeTime } from "@/features/shared/components"
import {
  addSnippetsToCollection,
  deleteCollection,
  duplicateCollection,
} from "@/features/collections/actions"
import { CollectionDialog } from "./collection-dialog"
import { CollectionDeleteDialog } from "./collection-delete-dialog"
import { AddSnippetDialog } from "./add-snippet-dialog"
import { ACCENT_GRADIENTS } from "./collection-card"
import type { CollectionListItem } from "../types"
import type { SnippetListItem } from "@/features/snippets/types"
import { cn } from "@/lib/utils"

function CollectionDetails({
  collection,
  snippets,
  snippetsNextCursor,
  snippetsHasMore,
  allTags,
}: {
  collection: CollectionListItem
  snippets: SnippetListItem[]
  snippetsNextCursor: string | null
  snippetsHasMore: boolean
  allTags: string[]
}) {
  const router = useRouter()

  const [current, setCurrent] = useState<CollectionListItem>(collection)
  const [prevCollection, setPrevCollection] =
    useState<CollectionListItem>(collection)
  if (prevCollection !== collection) {
    setPrevCollection(collection)
    setCurrent(collection)
  }

  const [snippetItems, setSnippetItems] = useState<SnippetListItem[]>(snippets)
  const [prevSnippets, setPrevSnippets] = useState<SnippetListItem[]>(snippets)
  if (prevSnippets !== snippets) {
    setPrevSnippets(snippets)
    setSnippetItems(snippets)
  }

  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [deleting, setDeleting] = useState<CollectionListItem | null>(null)

  const handleSave = (draft: {
    name: string
    description: string
    isPublic: boolean
    accent: CollectionListItem["accent"]
  }) => {
    setCurrent((existing) => ({
      ...existing,
      name: draft.name,
      description: draft.description || null,
      isPublic: draft.isPublic,
      accent: draft.accent,
      updatedAt: new Date().toISOString(),
    }))
    setEditOpen(false)
    toast.success("Collection updated")
    router.refresh()
  }

  const handleDuplicate = async () => {
    const formData = new FormData()
    formData.set("id", current.id)
    const result = await duplicateCollection(formData)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success("Collection duplicated")
    router.refresh()
  }

  const handleDeleteConfirm = async () => {
    if (!deleting) return
    const target = deleting
    setDeleting(null)

    const formData = new FormData()
    formData.set("id", target.id)
    const result = await deleteCollection(formData)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success("Collection deleted")
    router.push("/dashboard/collections")
  }

  const handleAddSnippet = () => {
    setAddOpen(true)
  }

  const handleSnippetsAdded = async (added: SnippetListItem[]) => {
    setSnippetItems((current) => [...added, ...current])
    setCurrent((existing) => ({
      ...existing,
      snippetCount: existing.snippetCount + added.length,
    }))

    const formData = new FormData()
    formData.set("collectionId", current.id)
    formData.set("snippetIds", added.map((snippet) => snippet.id).join(","))
    const result = await addSnippetsToCollection(formData)
    if (result?.error) {
      const addedIds = new Set(added.map((snippet) => snippet.id))
      setSnippetItems((previous) =>
        previous.filter((snippet) => !addedIds.has(snippet.id)),
      )
      setCurrent((existing) => ({
        ...existing,
        snippetCount: Math.max(0, existing.snippetCount - added.length),
      }))
      toast.error(result.error)
      return
    }
    toast.success(added.length === 1 ? "Snippet added" : "Snippets added")
    router.refresh()
  }

  const handleCollectionSnippetsChange = (next: SnippetListItem[]) => {
    setSnippetItems(next)
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardBack fallback="/dashboard/collections" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid min-w-0 gap-2">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full text-white",
                ACCENT_GRADIENTS[current.accent],
              )}
            >
              <Folder className="size-6" />
            </div>
            <h1 className="truncate font-heading text-[32px] font-bold tracking-tight text-[#f3f6fb]">
              {current.name}
            </h1>
          </div>
          {current.description ? (
            <p className="max-w-2xl text-sm text-[#94a3b8]">
              {current.description}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2.5">
            <DashboardBadge
              variant={current.isPublic ? "success" : "secondary"}
              className="w-fit"
            >
              {current.isPublic ? (
                <Globe className="size-3" />
              ) : (
                <Lock className="size-3" />
              )}
              {current.isPublic ? "Public" : "Private"}
            </DashboardBadge>
            <DashboardBadge variant="secondary">
              {current.snippetCount}{" "}
              {current.snippetCount === 1 ? "snippet" : "snippets"}
            </DashboardBadge>
            <span className="text-xs text-[#7d8ba3]">
              Updated{" "}
              <RelativeTime date={current.updatedAt} />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DashboardButton onClick={handleAddSnippet}>
            <Plus className="size-4" />
            Add Snippet
          </DashboardButton>

          <DashboardButton variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Edit
          </DashboardButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                type="button"
                aria-label="Collection actions"
                className="size-9"
              >
                <EllipsisVertical className="size-4" />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 border-white/[0.08] bg-[#141f30] text-[#e8edf5] ring-white/[0.1]"
            >
              <DropdownMenuItem
                onSelect={handleDuplicate}
                className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]"
              >
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem
                onSelect={() => setDeleting(current)}
                className="text-[#fb7185] focus:bg-[#fb7185]/10 focus:text-[#fda4af]"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {snippetItems.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No snippets in this collection"
          description="Add snippets to this collection to keep related code together."
          className="min-h-[320px] flex-1"
        >
          <DashboardButton onClick={handleAddSnippet}>
            <Plus className="size-4" />
            Add Snippet
          </DashboardButton>
        </EmptyState>
      ) : (
        <SnippetList
          snippets={snippetItems}
          nextCursor={snippetsNextCursor}
          hasMore={snippetsHasMore}
          allTags={allTags}
          collectionId={current.id}
          onCollectionSnippetsChange={handleCollectionSnippetsChange}
        />
      )}

      <CollectionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={handleSave}
        collection={current}
      />

      <AddSnippetDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        existingSnippetIds={snippetItems.map((snippet) => snippet.id)}
        onAdded={(added) => {
          void handleSnippetsAdded(added)
        }}
      />

      <CollectionDeleteDialog
        collection={deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

function CollectionDetailsPage({
  children,
}: {
  children?: React.ReactNode
}) {
  return <SnippetDialogProvider>{children}</SnippetDialogProvider>
}

export { CollectionDetails, CollectionDetailsPage }
