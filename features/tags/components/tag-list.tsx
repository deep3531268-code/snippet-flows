"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Tag, Plus, Upload } from "lucide-react"
import { toast } from "sonner"

import { useDebounce, useInfiniteList, useLocalStorage } from "@/features/shared/hooks"
import { DASHBOARD_STORAGE } from "@/features/settings/config"
import { DashboardBadge, DashboardButton, EmptyState } from "@/features/dashboard/ui"
import { InfiniteScrollFooter } from "@/features/shared/components"
import { StaggerContainer, StaggerItem } from "@/features/shared/motion"
import { TagCard } from "./tag-card"
import { TagToolbar } from "./tag-toolbar"
import { TagBulkToolbar } from "./tag-bulk-toolbar"
import { TagDialog } from "./tag-dialog"
import { TagDeleteDialog } from "./tag-delete-dialog"
import { bulkDeleteTags, bulkDuplicateTags, deleteTag, duplicateTag, loadMoreTags } from "../actions"
import {
  DEFAULT_TAG_FILTERS,
  TAG_SORT_OPTIONS,
  hasActiveTagFilters,
  type TagListFilters,
  type TagListSort,
  type TagView,
} from "../query"
import type { TagColor, TagListItem } from "../types"

const serializeFilters = (filters: TagListFilters) => JSON.stringify(filters)

function validateView(raw: string | null): TagView {
  return raw === "grid" || raw === "list" ? raw : "grid"
}

function validateSort(raw: string | null): TagListSort {
  return TAG_SORT_OPTIONS.some((option) => option.value === raw)
    ? (raw as TagListSort)
    : "updated"
}

function validateFilters(raw: string | null): TagListFilters {
  if (!raw) return { ...DEFAULT_TAG_FILTERS }
  try {
    const parsed = JSON.parse(raw) as Partial<TagListFilters>
    return {
      query: typeof parsed.query === "string" ? parsed.query : "",
      color:
        typeof parsed.color === "string" && parsed.color !== "all"
          ? (parsed.color as TagColor)
          : "all",
    }
  } catch {
    return { ...DEFAULT_TAG_FILTERS }
  }
}

function TagList({
  tags,
  nextCursor,
  hasMore,
  totalCount,
}: {
  tags: TagListItem[]
  nextCursor: string | null
  hasMore: boolean
  totalCount?: number
}) {
  const router = useRouter()

  const [view, setView] = useLocalStorage<TagView>(
    DASHBOARD_STORAGE.tagView.key,
    DASHBOARD_STORAGE.tagView.default,
    validateView,
    String,
  )
  const [sort, setSort] = useLocalStorage<TagListSort>(
    DASHBOARD_STORAGE.tagSort.key,
    DASHBOARD_STORAGE.tagSort.default,
    validateSort,
    String,
  )
  const [filters, setFilters] = useLocalStorage<TagListFilters>(
    "tags-filters",
    { ...DEFAULT_TAG_FILTERS },
    validateFilters,
    serializeFilters,
  )
  const [searchInput, setSearchInput] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<TagListItem | null>(null)
  const [deleting, setDeleting] = useState<TagListItem | null>(null)
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

  const loadPage = useCallback(
    (cursor: string | null) =>
      loadMoreTags({ cursor, query: filters.query, sort }),
    [filters.query, sort],
  )

  const resetKey = `${serializeFilters(filters)}|${sort}`
  const reconcileProps = !hasActiveTagFilters(filters) && sort === "updated"

  const {
    items,
    setItems,
    hasMore: liveHasMore,
    initialLoading,
    loadingMore,
    error,
    retry,
    sentinelRef,
  } = useInfiniteList<TagListItem>({
    initialItems: tags,
    initialNextCursor: nextCursor,
    initialHasMore: hasMore,
    loadPage,
    resetKey,
    reconcileProps,
  })

  const selectedItems = useMemo(
    () => items.filter((item) => selected.has(item.id)),
    [items, selected],
  )

  const allVisibleSelected =
    items.length > 0 && items.every((item) => selected.has(item.id))

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

  const patchFilters = (patch: Partial<TagListFilters>) =>
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
      setSelected(new Set(items.map((item) => item.id)))
    }
  }

  const openCreate = useCallback(() => {
    setEditing(null)
    setDialogOpen(true)
  }, [])

  const openEdit = useCallback((tag: TagListItem) => {
    setEditing(tag)
    setDialogOpen(true)
  }, [])

  const requestDelete = useCallback((tag: TagListItem) => {
    setDeleting(tag)
  }, [])

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setEditing(null)
  }

  const handleSave = useCallback(
    (draft: { name: string; color: TagColor }) => {
      const now = new Date().toISOString()
      const item: TagListItem = {
        id: editing?.id ?? crypto.randomUUID(),
        name: draft.name,
        color: draft.color,
        snippetCount: editing?.snippetCount ?? 0,
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
      toast.success(editing ? "Tag updated" : "Tag created")
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
    const result = await deleteTag(formData)
    if (result?.error) {
      setItems((current) =>
        current.some((item) => item.id === target.id)
          ? current
          : [target, ...current],
      )
      toast.error(result.error)
      return
    }
    toast.success("Tag deleted")
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
    const result = await bulkDeleteTags(formData)
    setDeletePending(false)
    if (result?.error) {
      toast.error(result.error)
      router.refresh()
      return
    }
    toast.success(ids.length === 1 ? "Tag deleted" : "Tags deleted")
    router.refresh()
  }

  const handleBulkDuplicate = async () => {
    const targets = selectedItems
    if (targets.length === 0) return

    const now = new Date().toISOString()
    const clones = new Map<string, TagListItem>()
    for (const tag of targets) {
      const clone: TagListItem = {
        ...tag,
        id: crypto.randomUUID(),
        name: `${tag.name} (Copy)`,
        snippetCount: 0,
        createdAt: now,
        updatedAt: now,
      }
      clones.set(tag.id, clone)
    }
    setItems((current) => {
      const list = [...current]
      for (const tag of targets) {
        const index = list.findIndex((item) => item.id === tag.id)
        if (index >= 0) list.splice(index + 1, 0, clones.get(tag.id)!)
      }
      return list
    })
    setBulkPending(true)

    const formData = new FormData()
    formData.set("ids", targets.map((item) => item.id).join(","))
    const result = await bulkDuplicateTags(formData)
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
      targets.length === 1 ? "Tag duplicated" : "Tags duplicated",
    )
    router.refresh()
  }

  const handleDuplicate = useCallback(
    async (tag: TagListItem) => {
      const now = new Date().toISOString()
      const clone: TagListItem = {
        ...tag,
        id: crypto.randomUUID(),
        name: `${tag.name} (Copy)`,
        snippetCount: 0,
        createdAt: now,
        updatedAt: now,
      }
      setItems((current) => {
        const list = [...current]
        const index = list.findIndex((item) => item.id === tag.id)
        list.splice(index >= 0 ? index + 1 : list.length, 0, clone)
        return list
      })

      const formData = new FormData()
      formData.set("id", tag.id)
      const result = await duplicateTag(formData)
      if (result?.error) {
        setItems((current) => current.filter((item) => item.id !== clone.id))
        toast.error(result.error)
        return
      }
      toast.success("Tag duplicated")
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
    selected,
    allVisibleSelected,
    clearSelection,
    toggleSelectAll,
  })

  useEffect(() => {
    stateRef.current = {
      dialogOpen,
      deleting,
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
        if (target?.dataset.tagsSearch !== undefined) return
        event.preventDefault()
        rootRef.current
          ?.querySelector<HTMLInputElement>("[data-tags-search]")
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
            Tags
          </h1>
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-sm text-[#94a3b8]">
              Organize snippets with lightweight labels.
            </p>
            <DashboardBadge variant="secondary">
              {(totalCount ?? items.length)}{" "}
              {(totalCount ?? items.length) === 1 ? "tag" : "tags"}
            </DashboardBadge>
          </div>
        </div>
        <DashboardButton onClick={openCreate}>
          <Plus className="size-4" />
          New Tag
        </DashboardButton>
      </div>

      <TagToolbar
        filters={filters}
        onFiltersChange={patchFilters}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        search={searchInput}
        onSearchChange={setSearchInput}
        selectable={items.length > 0}
        allSelected={allVisibleSelected}
        onToggleSelectAll={toggleSelectAll}
      />

      {selected.size > 0 ? (
        <TagBulkToolbar
          count={selected.size}
          onDuplicate={handleBulkDuplicate}
          onDelete={() => setBulkDelete(true)}
          onClear={clearSelection}
          pending={bulkPending}
        />
      ) : null}

      {initialLoading && items.length === 0 ? null : items.length === 0 ? (
        hasActiveTagFilters(filters) ? (
          <EmptyState
            icon={Tag}
            title="No matching tags"
            description="Try adjusting your search or filters."
            className="min-h-[320px] flex-1"
          />
        ) : (
          <EmptyState
            icon={Tag}
            title="No tags yet"
            description="Organize snippets by creating tags."
            className="min-h-[320px] flex-1"
          >
            <DashboardButton onClick={openCreate}>
              <Tag className="size-4" />
              Create Tag
            </DashboardButton>
            <DashboardButton variant="secondary" onClick={handleImport}>
              <Upload className="size-4" />
              Import Tags
            </DashboardButton>
          </EmptyState>
        )
      ) : view === "grid" ? (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((tag) => (
            <StaggerItem key={tag.id} className="h-full">
              <TagCard
                tag={tag}
                selected={selected.has(tag.id)}
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
          {items.map((tag) => (
            <StaggerItem key={tag.id}>
              <TagCard
                tag={tag}
                selected={selected.has(tag.id)}
                onToggleSelect={toggleSelected}
                onEdit={openEdit}
                onDuplicate={handleDuplicate}
                onDelete={requestDelete}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {items.length > 0 || initialLoading ? (
        <InfiniteScrollFooter
          sentinelRef={sentinelRef}
          initialLoading={initialLoading}
          loadingMore={loadingMore}
          hasMore={liveHasMore}
          error={error}
          onRetry={retry}
        />
      ) : null}

      <TagDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSaved={handleSave}
        tag={editing}
      />

      <TagDeleteDialog
        tag={deleting}
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

export { TagList }
