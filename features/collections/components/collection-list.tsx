"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Folder, FolderPlus, Plus, Upload } from "lucide-react"
import { toast } from "sonner"

import { useDebounce, useLocalStorage } from "@/features/shared/hooks"
import {
  DashboardBadge,
  DashboardButton,
  EmptyState,
} from "@/features/dashboard/ui"
import { StaggerContainer, StaggerItem } from "@/features/shared/motion"
import { CollectionCard } from "./collection-card"
import { CollectionToolbar } from "./collection-toolbar"
import { CollectionBulkToolbar } from "./collection-bulk-toolbar"
import { CollectionDialog } from "./collection-dialog"
import { CollectionDeleteDialog } from "./collection-delete-dialog"
import {
  COLLECTION_SORT_OPTIONS,
  DEFAULT_COLLECTION_FILTERS,
  filterAndSortCollections,
  type CollectionListFilters,
  type CollectionListSort,
  type CollectionView,
} from "../query"
import type { CollectionListItem } from "../types"

const serializeFilters = (filters: CollectionListFilters) =>
  JSON.stringify(filters)

function validateView(raw: string | null): CollectionView {
  return raw === "grid" || raw === "list" ? raw : "grid"
}

function validateSort(raw: string | null): CollectionListSort {
  return COLLECTION_SORT_OPTIONS.some((option) => option.value === raw)
    ? (raw as CollectionListSort)
    : "updated"
}

function validateFilters(raw: string | null): CollectionListFilters {
  if (!raw) return { ...DEFAULT_COLLECTION_FILTERS }
  try {
    const parsed = JSON.parse(raw) as Partial<CollectionListFilters>
    return {
      query: typeof parsed.query === "string" ? parsed.query : "",
      visibility:
        parsed.visibility === "public" || parsed.visibility === "private"
          ? parsed.visibility
          : "all",
    }
  } catch {
    return { ...DEFAULT_COLLECTION_FILTERS }
  }
}

function CollectionList({
  collections,
}: {
  collections: CollectionListItem[]
}) {
  const router = useRouter()

  const [items, setItems] = useState<CollectionListItem[]>(collections)
  const [prevCollections, setPrevCollections] = useState<CollectionListItem[]>(
    collections,
  )
  if (prevCollections !== collections) {
    setPrevCollections(collections)
    setItems(collections)
  }

  const [view, setView] = useLocalStorage<CollectionView>(
    "collections-view",
    "grid",
    validateView,
    String,
  )
  const [sort, setSort] = useLocalStorage<CollectionListSort>(
    "collections-sort",
    "updated",
    validateSort,
    String,
  )
  const [filters, setFilters] = useLocalStorage<CollectionListFilters>(
    "collections-filters",
    { ...DEFAULT_COLLECTION_FILTERS },
    validateFilters,
    serializeFilters,
  )
  const [searchInput, setSearchInput] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CollectionListItem | null>(null)
  const [deleting, setDeleting] = useState<CollectionListItem | null>(null)
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [bulkPending, setBulkPending] = useState(false)
  const [bulkDelete, setBulkDelete] = useState(false)
  const [deletePending, setDeletePending] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(searchInput, 300)

  useEffect(() => {
    setFilters((current) =>
      current.query === debouncedQuery
        ? current
        : { ...current, query: debouncedQuery },
    )
  }, [debouncedQuery])

  useEffect(() => {
    setSearchInput(filters.query)
  }, [filters.query])

  const visible = useMemo(
    () => filterAndSortCollections(items, filters, sort),
    [items, filters, sort],
  )

  const selectedItems = useMemo(
    () => items.filter((item) => selected.has(item.id)),
    [items, selected],
  )
  const allVisibleSelected =
    visible.length > 0 && visible.every((item) => selected.has(item.id))

  useEffect(() => {
    const ids = new Set(items.map((item) => item.id))
    setSelected((current) => {
      let changed = false
      const next = new Set<string>()
      for (const id of current) {
        if (ids.has(id)) next.add(id)
        else changed = true
      }
      return changed ? next : current
    })
  }, [items])

  const patchFilters = (patch: Partial<CollectionListFilters>) =>
    setFilters((current) => ({ ...current, ...patch }))

  const clearSelection = () => setSelected(new Set())

  const toggleSelected = useCallback((id: string) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(visible.map((item) => item.id)))
    }
  }

  const openCreate = useCallback(() => {
    setEditing(null)
    setDialogOpen(true)
  }, [])

  const openEdit = useCallback((collection: CollectionListItem) => {
    setEditing(collection)
    setDialogOpen(true)
  }, [])

  const requestDelete = useCallback((collection: CollectionListItem) => {
    setDeleting(collection)
  }, [])

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setEditing(null)
  }

  const handleSave = useCallback(
    (draft: {
      name: string
      description: string
      isPublic: boolean
      accent: CollectionListItem["accent"]
    }) => {
      const now = new Date().toISOString()
      const item: CollectionListItem = {
        id: editing?.id ?? crypto.randomUUID(),
        name: draft.name,
        description: draft.description || null,
        isPublic: draft.isPublic,
        accent: draft.accent,
        snippetCount: editing?.snippetCount ?? 0,
        tags: editing?.tags ?? [],
        createdAt: editing?.createdAt ?? now,
        updatedAt: now,
      }

      setItems((current) => {
        const exists = current.some((existing) => existing.id === item.id)
        return exists
          ? current.map((existing) =>
              existing.id === item.id ? item : existing,
            )
          : [item, ...current]
      })
      setDialogOpen(false)
      setEditing(null)
      toast.success(editing ? "Collection updated" : "Collection created")
      router.refresh()
    },
    [editing, router],
  )

  const handleDeleteConfirm = async () => {
    if (!deleting) return
    const target = deleting
    setItems((current) => current.filter((item) => item.id !== target.id))
    setDeleting(null)

    const formData = new FormData()
    formData.set("id", target.id)
    const result = await deleteCollection(formData)
    if (result?.error) {
      setItems((current) =>
        current.some((item) => item.id === target.id)
          ? current
          : [target, ...current],
      )
      toast.error(result.error)
      return
    }
    toast.success("Collection deleted")
    router.refresh()
  }

  const handleBulkDeleteConfirm = async () => {
    const ids = [...selected]
    if (ids.length === 0) {
      setBulkDelete(false)
      return
    }
    setDeletePending(true)
    setItems((current) =>
      current.filter((item) => !selected.has(item.id)),
    )
    setSelected(new Set())
    setBulkDelete(false)

    const formData = new FormData()
    formData.set("ids", ids.join(","))
    const result = await bulkDeleteCollections(formData)
    setDeletePending(false)
    if (result?.error) {
      toast.error(result.error)
      router.refresh()
      return
    }
    toast.success(
      ids.length === 1 ? "Collection deleted" : "Collections deleted",
    )
    router.refresh()
  }

  const handleBulkDuplicate = async () => {
    const targets = selectedItems
    if (targets.length === 0) return

    const now = new Date().toISOString()
    const clones = new Map<string, CollectionListItem>()
    for (const collection of targets) {
      const clone: CollectionListItem = {
        ...collection,
        id: crypto.randomUUID(),
        name: `${collection.name} (Copy)`,
        snippetCount: 0,
        createdAt: now,
        updatedAt: now,
        tags: collection.tags.map((tag) => ({ id: tag.id, name: tag.name })),
      }
      clones.set(collection.id, clone)
    }
    setItems((current) => {
      const list = [...current]
      for (const collection of targets) {
        const index = list.findIndex((item) => item.id === collection.id)
        if (index >= 0) list.splice(index + 1, 0, clones.get(collection.id)!)
      }
      return list
    })
    setBulkPending(true)

    const formData = new FormData()
    formData.set("ids", targets.map((item) => item.id).join(","))
    const result = await bulkDuplicateCollections(formData)
    setBulkPending(false)
    if (result?.error) {
      const cloneIds = new Set([...clones.values()].map((clone) => clone.id))
      setItems((current) =>
        current.filter((item) => !cloneIds.has(item.id)),
      )
      toast.error(result.error)
      return
    }
    toast.success(
      targets.length === 1
        ? "Collection duplicated"
        : "Collections duplicated",
    )
    router.refresh()
  }

  const handleDuplicate = useCallback(
    async (collection: CollectionListItem) => {
      const now = new Date().toISOString()
      const clone: CollectionListItem = {
        ...collection,
        id: crypto.randomUUID(),
        name: `${collection.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
        tags: collection.tags.map((tag) => ({ id: tag.id, name: tag.name })),
      }
      setItems((current) => {
        const list = [...current]
        const index = list.findIndex((item) => item.id === collection.id)
        list.splice(index >= 0 ? index + 1 : list.length, 0, clone)
        return list
      })

      const formData = new FormData()
      formData.set("id", collection.id)
      const result = await duplicateCollection(formData)
      if (result?.error) {
        setItems((current) => current.filter((item) => item.id !== clone.id))
        toast.error(result.error)
        return
      }
      toast.success("Collection duplicated")
      router.refresh()
    },
    [router],
  )

  const handleImport = () => {
    toast.info("Import will be available in a future update.")
  }

  const stateRef = useRef({
    dialogOpen,
    deleting,
    editing,
    selected,
    allVisibleSelected,
    clearSelection,
    toggleSelectAll,
  })

  useEffect(() => {
    stateRef.current = {
      dialogOpen,
      deleting,
      editing,
      selected,
      allVisibleSelected,
      clearSelection,
      toggleSelectAll,
    }
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const state = stateRef.current
      const target = event.target as HTMLElement | null
      const inField = target?.closest("input, textarea, select") != null

      if (event.key === "Escape") {
        if (state.dialogOpen || state.deleting) return
        if (state.selected.size > 0) {
          event.preventDefault()
          state.clearSelection()
        }
        return
      }

      const mod = event.metaKey || event.ctrlKey
      if (!mod) return
      const key = event.key.toLowerCase()
      if (key === "n") {
        if (inField) return
        event.preventDefault()
        openCreate()
      } else if (key === "f") {
        if (target?.dataset.collectionsSearch !== undefined) return
        event.preventDefault()
        rootRef.current
          ?.querySelector<HTMLInputElement>("[data-collections-search]")
          ?.focus()
      } else if (key === "a") {
        if (inField) return
        event.preventDefault()
        state.toggleSelectAll()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [openCreate])

  return (
    <div ref={rootRef} className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="font-heading text-[32px] font-bold tracking-tight text-[#f3f6fb]">
            Collections
          </h1>
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-sm text-[#94a3b8]">
              Manage and organize your snippet collections.
            </p>
            <DashboardBadge variant="secondary">
              {items.length} {items.length === 1 ? "collection" : "collections"}
            </DashboardBadge>
          </div>
        </div>
        <DashboardButton onClick={openCreate}>
          <Plus className="size-4" />
          New Collection
        </DashboardButton>
      </div>

      <CollectionToolbar
        filters={filters}
        onFiltersChange={patchFilters}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        search={searchInput}
        onSearchChange={setSearchInput}
        selectable={visible.length > 0}
        allSelected={allVisibleSelected}
        onToggleSelectAll={toggleSelectAll}
      />

      {selected.size > 0 ? (
        <CollectionBulkToolbar
          count={selected.size}
          onDuplicate={handleBulkDuplicate}
          onDelete={() => setBulkDelete(true)}
          onClear={clearSelection}
          pending={bulkPending}
        />
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No collections yet"
          description="Organize snippets by creating collections."
          className="min-h-[320px] flex-1"
        >
          <DashboardButton onClick={openCreate}>
            <FolderPlus className="size-4" />
            Create Collection
          </DashboardButton>
          <DashboardButton variant="secondary" onClick={handleImport}>
            <Upload className="size-4" />
            Import Collections
          </DashboardButton>
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No matching collections"
          description="Try adjusting your search or filters."
          className="min-h-[320px] flex-1"
        />
      ) : view === "grid" ? (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((collection) => (
            <StaggerItem key={collection.id} className="h-full">
              <CollectionCard
                collection={collection}
                selected={selected.has(collection.id)}
                onToggleSelect={toggleSelected}
                onEdit={openEdit}
                onDuplicate={handleDuplicate}
                onDelete={requestDelete}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <StaggerContainer className="flex flex-col gap-2">
          {visible.map((collection) => (
            <StaggerItem key={collection.id}>
              <CollectionCard
                collection={collection}
                selected={selected.has(collection.id)}
                onToggleSelect={toggleSelected}
                onEdit={openEdit}
                onDuplicate={handleDuplicate}
                onDelete={requestDelete}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      <CollectionDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSaved={handleSave}
        collection={editing}
      />

      <CollectionDeleteDialog
        collection={deleting}
        count={bulkDelete ? selected.size : undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null)
            setBulkDelete(false)
          }
        }}
        onConfirm={bulkDelete ? handleBulkDeleteConfirm : handleDeleteConfirm}
        pending={deletePending}
      />
    </div>
  )
}

export { CollectionList }
