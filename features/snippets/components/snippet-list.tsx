"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  FileCode2,
  Plus,
  RotateCcw,
  SearchX,
  Star,
  Upload,
} from "lucide-react"

import { useDebounce, useLocalStorage } from "@/features/shared/hooks"
import {
  DashboardBadge,
  DashboardButton,
  DashboardCard,
  EmptyState,
} from "@/features/dashboard/ui"
import { StaggerContainer, StaggerItem } from "@/features/shared/motion"
import {
  bulkArchiveSnippets,
  bulkDeleteSnippets,
  bulkFavoriteSnippets,
  deleteSnippet,
  duplicateSnippet,
  toggleSnippetFavorite,
} from "@/features/snippets/actions"
import {
  removeSnippetFromCollection,
  setSnippetCollections,
} from "@/features/collections/actions"
import { removeSnippetFromTag } from "@/features/tags/actions"
import {
  DEFAULT_FILTERS,
  filterAndSortSnippets,
  getSnippetTags,
  SORT_OPTIONS,
  type SnippetListFilters,
  type SnippetListSort,
  type SnippetView,
} from "@/features/snippets/query"
import type { SnippetListItem } from "@/features/snippets/types"
import { DeleteDialog } from "./delete-dialog"
import {
  SnippetDialog,
  type SnippetDraft,
} from "./snippet-dialog"
import { useSnippetCreateContext } from "./snippet-dialog-provider"
import { CollectionPickerDialog } from "./collection-picker-dialog"
import { SnippetCard } from "./snippet-card"
import { SnippetRow } from "./snippet-row"
import { SnippetToolbar } from "./snippet-toolbar"
import { BulkToolbar } from "./bulk-toolbar"

const serializeFilters = (filters: SnippetListFilters) =>
  JSON.stringify(filters)

function validateView(raw: string | null): SnippetView {
  return raw === "grid" || raw === "list" ? raw : "grid"
}

function validateSort(raw: string | null): SnippetListSort {
  return SORT_OPTIONS.some((option) => option.value === raw)
    ? (raw as SnippetListSort)
    : "updated"
}

function validateFilters(raw: string | null): SnippetListFilters {
  if (!raw) return { ...DEFAULT_FILTERS }
  try {
    const parsed = JSON.parse(raw) as Partial<SnippetListFilters>
    return {
      query: typeof parsed.query === "string" ? parsed.query : "",
      language: typeof parsed.language === "string" ? parsed.language : "all",
      tag: typeof parsed.tag === "string" ? parsed.tag : "all",
      favoritesOnly: Boolean(parsed.favoritesOnly),
      visibility:
        parsed.visibility === "public" || parsed.visibility === "private"
          ? parsed.visibility
          : "all",
    }
  } catch {
    return { ...DEFAULT_FILTERS }
  }
}

function SnippetList({
  snippets,
  collectionId,
  onCollectionSnippetsChange,
  tagId,
  onTagSnippetsChange,
  lockedTag,
}: {
  snippets: SnippetListItem[]
  collectionId?: string
  onCollectionSnippetsChange?: (
    snippets: SnippetListItem[],
    snippetCount: number,
  ) => void
  tagId?: string
  onTagSnippetsChange?: (
    snippets: SnippetListItem[],
    snippetCount: number,
  ) => void
  lockedTag?: string
}) {
  const router = useRouter()
  const isCollectionView = Boolean(collectionId)
  const isTagView = Boolean(tagId)
  const isContextView = isCollectionView || isTagView

  const [items, setItems] = useState<SnippetListItem[]>(snippets)
  const [prevSnippets, setPrevSnippets] = useState<SnippetListItem[]>(snippets)
  if (prevSnippets !== snippets) {
    setPrevSnippets(snippets)
    setItems(snippets)
  }

  const [view, setView] = useLocalStorage<SnippetView>(
    "snippets-view",
    "grid",
    validateView,
    String,
  )
  const [sort, setSort] = useLocalStorage<SnippetListSort>(
    "snippets-sort",
    "updated",
    validateSort,
    String,
  )
  const [filters, setFilters] = useLocalStorage<SnippetListFilters>(
    "snippets-filters",
    { ...DEFAULT_FILTERS },
    validateFilters,
    serializeFilters,
  )
  const [searchInput, setSearchInput] = useState("")

  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [bulkPending, setBulkPending] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<SnippetListItem | null>(null)
  const [deleting, setDeleting] = useState<SnippetListItem | null>(null)
  const [bulkDelete, setBulkDelete] = useState(false)
  const [deletePending, setDeletePending] = useState(false)
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set())
  const [collectionTarget, setCollectionTarget] =
    useState<SnippetListItem | null>(null)

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

  const tags = useMemo(() => getSnippetTags(items), [items])
  const visible = useMemo(
    () => filterAndSortSnippets(items, filters, sort),
    [items, filters, sort],
  )
  const favoritesCount = useMemo(
    () => items.filter((item) => item.isFavorite).length,
    [items],
  )
  const selectedItems = useMemo(
    () => items.filter((item) => selected.has(item.id)),
    [items, selected],
  )
  const allVisibleSelected =
    visible.length > 0 && visible.every((item) => selected.has(item.id))
  const allFavorited =
    selectedItems.length > 0 && selectedItems.every((item) => item.isFavorite)
  const hasOtherFilters = Boolean(
    filters.query.trim() ||
      filters.language !== "all" ||
      filters.tag !== "all" ||
      filters.visibility !== "all",
  )

  const patchFilters = (patch: Partial<SnippetListFilters>) =>
    setFilters((current) => ({ ...current, ...patch }))

  const clearFilters = () => {
    setSearchInput("")
    setFilters({ ...DEFAULT_FILTERS })
  }

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

  const { setOpenCreate } = useSnippetCreateContext()

  useEffect(() => {
    setOpenCreate(() => openCreate)
  }, [openCreate, setOpenCreate])

  const openEdit = useCallback((snippet: SnippetListItem) => {
    setEditing(snippet)
    setDialogOpen(true)
  }, [])

  const requestDelete = useCallback((snippet: SnippetListItem) => {
    setDeleting(snippet)
  }, [])

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setEditing(null)
  }

  const handleSave = useCallback(
    (draft: SnippetDraft) => {
      const now = new Date().toISOString()
      const item: SnippetListItem = {
        id: editing?.id ?? crypto.randomUUID(),
        title: draft.title,
        description: draft.description || null,
        content: draft.content,
        language: draft.language,
        isPublic: draft.isPublic,
        slug: editing?.slug ?? null,
        isFavorite: editing?.isFavorite ?? false,
        isArchived: editing?.isArchived ?? false,
        deletedAt: null,
        createdAt: editing?.createdAt ?? now,
        updatedAt: now,
        tags: draft.tags.map((name, index) => {
          const existing = editing?.tags.find((item) => item.name === name)
          return { id: existing?.id ?? `tag-${index}`, name }
        }),
        collections: editing?.collections ?? [],
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
      toast.success(editing ? "Snippet updated" : "Snippet created")
      router.refresh()
    },
    [editing, router],
  )

  const handleDeleteConfirm = async () => {
    if (!deleting) return
    const target = deleting
    setDeletePending(true)
    setItems((current) => current.filter((item) => item.id !== target.id))
    setSelected((current) => {
      if (!current.has(target.id)) return current
      const next = new Set(current)
      next.delete(target.id)
      return next
    })
    setDeleting(null)

    const formData = new FormData()
    formData.set("id", target.id)
    const result = await deleteSnippet(formData)
    setDeletePending(false)
    if (result?.error) {
      setItems((current) =>
        current.some((item) => item.id === target.id)
          ? current
          : [target, ...current],
      )
      toast.error(result.error)
      return
    }
    toast.success("Snippet moved to trash")
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
    const result = await bulkDeleteSnippets(formData)
    setDeletePending(false)
    if (result?.error) {
      toast.error(result.error)
      router.refresh()
      return
    }
    toast.success(
      ids.length === 1 ? "Snippet moved to trash" : "Snippets moved to trash",
    )
    router.refresh()
  }

  const handleDuplicate = useCallback(async (snippet: SnippetListItem) => {
    setPendingIds((current) => {
      const next = new Set(current)
      next.add(snippet.id)
      return next
    })

    const clone: SnippetListItem = {
      ...snippet,
      id: crypto.randomUUID(),
      title: `${snippet.title} (Copy)`,
      isFavorite: false,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: snippet.tags.map((item) => ({ id: item.id, name: item.name })),
    }
    setItems((current) => {
      const list = [...current]
      const index = list.findIndex((item) => item.id === snippet.id)
      list.splice(index >= 0 ? index + 1 : list.length, 0, clone)
      return list
    })

    const formData = new FormData()
    formData.set("id", snippet.id)
    const result = await duplicateSnippet(formData)
    setPendingIds((current) => {
      const next = new Set(current)
      next.delete(snippet.id)
      return next
    })
    if (result?.error) {
      setItems((current) => current.filter((item) => item.id !== clone.id))
      toast.error(result.error)
      return
    }
    toast.success("Snippet duplicated")
    router.refresh()
  }, [])

  const handleToggleFavorite = useCallback((snippet: SnippetListItem) => {
    const next = !snippet.isFavorite
    setPendingIds((current) => {
      const nextIds = new Set(current)
      nextIds.add(snippet.id)
      return nextIds
    })
    setItems((current) =>
      current.map((item) =>
        item.id === snippet.id ? { ...item, isFavorite: next } : item,
      ),
    )
    const formData = new FormData()
    formData.set("id", snippet.id)
    toggleSnippetFavorite(formData).then((result) => {
      setPendingIds((current) => {
        const nextIds = new Set(current)
        nextIds.delete(snippet.id)
        return nextIds
      })
      if (result?.error) {
        setItems((current) =>
          current.map((item) =>
            item.id === snippet.id
              ? { ...item, isFavorite: snippet.isFavorite }
              : item,
          ),
        )
        toast.error(result.error)
        return
      }
      toast.success(next ? "Added to favorites" : "Removed from favorites")
    })
  }, [])

  const handleCollectionsSaved = useCallback(
    async (
      snippet: SnippetListItem,
      collections: { id: string; name: string }[],
    ) => {
      const previous = items
      const stillInCollection =
        !collectionId ||
        collections.some((collection) => collection.id === collectionId)
      const next = stillInCollection
        ? previous.map((item) =>
            item.id === snippet.id ? { ...item, collections } : item,
          )
        : previous.filter((item) => item.id !== snippet.id)
      setItems(next)
      onCollectionSnippetsChange?.(next, next.length)

      const formData = new FormData()
      formData.set("snippetId", snippet.id)
      formData.set("collectionIds", collections.map((c) => c.id).join(","))
      const result = await setSnippetCollections(formData)
      if (result?.error) {
        setItems(previous)
        onCollectionSnippetsChange?.(previous, previous.length)
        toast.error(result.error)
        return
      }
      toast.success("Collections updated")
      router.refresh()
    },
    [collectionId, items, onCollectionSnippetsChange, router],
  )

  const handleRemoveFromCollection = useCallback(
    async (snippet: SnippetListItem) => {
      if (!collectionId) return
      const previous = items
      const next = previous.filter((item) => item.id !== snippet.id)
      setItems(next)
      onCollectionSnippetsChange?.(next, next.length)

      const formData = new FormData()
      formData.set("collectionId", collectionId)
      formData.set("snippetId", snippet.id)
      const result = await removeSnippetFromCollection(formData)
      if (result?.error) {
        setItems(previous)
        onCollectionSnippetsChange?.(previous, previous.length)
        toast.error(result.error)
        return
      }
      toast.success("Removed from collection")
      router.refresh()
    },
    [collectionId, items, onCollectionSnippetsChange, router],
  )

  const handleRemoveFromTag = useCallback(
    async (snippet: SnippetListItem) => {
      if (!tagId) return
      const previous = items
      const next = previous.filter((item) => item.id !== snippet.id)
      setItems(next)
      onTagSnippetsChange?.(next, next.length)

      const formData = new FormData()
      formData.set("tagId", tagId)
      formData.set("snippetId", snippet.id)
      const result = await removeSnippetFromTag(formData)
      if (result?.error) {
        setItems(previous)
        onTagSnippetsChange?.(previous, previous.length)
        toast.error(result.error)
        return
      }
      toast.success("Removed from tag")
      router.refresh()
    },
    [tagId, items, onTagSnippetsChange, router],
  )

  const handleBulkFavorite = async () => {
    const ids = selectedItems.map((item) => item.id)
    if (ids.length === 0) return
    const next = !allFavorited

    setItems((current) =>
      current.map((item) =>
        selected.has(item.id) ? { ...item, isFavorite: next } : item,
      ),
    )
    setBulkPending(true)
    const formData = new FormData()
    formData.set("ids", ids.join(","))
    formData.set("favorite", String(next))
    const result = await bulkFavoriteSnippets(formData)
    setBulkPending(false)
    if (result?.error) {
      setItems((current) =>
        current.map((item) =>
          selected.has(item.id) ? { ...item, isFavorite: !next } : item,
        ),
      )
      toast.error(result.error)
      return
    }
    toast.success(next ? "Added to favorites" : "Removed from favorites")
    router.refresh()
  }

  const handleBulkArchive = async () => {
    const ids = [...selected]
    if (ids.length === 0) return

    setItems((current) => current.filter((item) => !selected.has(item.id)))
    setSelected(new Set())
    setBulkPending(true)
    const formData = new FormData()
    formData.set("ids", ids.join(","))
    const result = await bulkArchiveSnippets(formData)
    setBulkPending(false)
    if (result?.error) {
      toast.error(result.error)
      router.refresh()
      return
    }
    toast.success(
      ids.length === 1 ? "Snippet archived" : "Snippets archived",
    )
    router.refresh()
  }

  const handleImport = () => {
    toast.info("Import snippets is coming in a later milestone")
  }

  const stateRef = useRef({
    dialogOpen,
    deleting,
    bulkDelete,
    selected,
    visible,
    allVisibleSelected,
    clearSelection,
    toggleSelectAll,
    isCollectionView,
    isTagView,
  })

  useEffect(() => {
    stateRef.current = {
      dialogOpen,
      deleting,
      bulkDelete,
      selected,
      visible,
      allVisibleSelected,
      clearSelection,
      toggleSelectAll,
      isCollectionView,
      isTagView,
    }
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const state = stateRef.current
      const target = event.target as HTMLElement | null
      const inField = target?.closest("input, textarea, select") != null

      if (event.key === "Escape") {
        if (state.dialogOpen || state.deleting || state.bulkDelete) return
        if (state.selected.size > 0) {
          event.preventDefault()
          state.clearSelection()
        }
        return
      }

      const mod = event.metaKey || event.ctrlKey
      if (!mod) return
      const key = event.key.toLowerCase()
      if (state.isCollectionView) return
      if (key === "n") {
        event.preventDefault()
        setEditing(null)
        setDialogOpen(true)
      } else if (key === "f") {
        if (target?.dataset.snippetsSearch !== undefined) return
        event.preventDefault()
        rootRef.current
          ?.querySelector<HTMLInputElement>("[data-snippets-search]")
          ?.focus()
      } else if (key === "a") {
        if (inField) return
        event.preventDefault()
        state.toggleSelectAll()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const renderEmptyState = () => {
    if (items.length === 0) {
      if (isContextView) return null
      return (
        <EmptyState
          icon={FileCode2}
          title="No snippets yet"
          description="Create your first snippet to get started."
          className="min-h-[320px] flex-1"
        >
          <DashboardButton onClick={openCreate}>
            <Plus className="size-4" />
            Create Snippet
          </DashboardButton>
          <DashboardButton variant="secondary" onClick={handleImport}>
            <Upload className="size-4" />
            Import Snippets
          </DashboardButton>
        </EmptyState>
      )
    }

    if (visible.length === 0) {
      if (filters.favoritesOnly && !hasOtherFilters) {
        return (
          <EmptyState
            icon={Star}
            title="No favorite snippets"
            description="Star snippets you use often and they'll show up here."
            className="min-h-[320px] flex-1"
          >
            <DashboardButton
              variant="secondary"
              onClick={() => patchFilters({ favoritesOnly: false })}
            >
              Browse Snippets
            </DashboardButton>
          </EmptyState>
        )
      }
      return (
        <EmptyState
          icon={SearchX}
          title="No snippets found"
          description="Try adjusting your search or filters."
          className="min-h-[320px] flex-1"
        >
          <DashboardButton variant="secondary" onClick={clearFilters}>
            <RotateCcw className="size-4" />
            Clear Filters
          </DashboardButton>
        </EmptyState>
      )
    }

    const cardProps = (snippet: SnippetListItem) => ({
      snippet,
      query: filters.query,
      selected: selected.has(snippet.id),
      selectable: !isContextView,
      onToggleSelect: () => toggleSelected(snippet.id),
      onEdit: openEdit,
      onDuplicate: handleDuplicate,
      onDelete: requestDelete,
      onToggleFavorite: handleToggleFavorite,
      onAddToCollection: (target: SnippetListItem) =>
        setCollectionTarget(target),
      onRemoveFromCollection: isCollectionView
        ? handleRemoveFromCollection
        : undefined,
      onRemoveFromTag: isTagView ? handleRemoveFromTag : undefined,
      pending: pendingIds.has(snippet.id),
    })

    if (view === "grid") {
      return (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((snippet) => (
            <StaggerItem key={snippet.id} className="h-full">
              <SnippetCard {...cardProps(snippet)} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )
    }

    return (
      <DashboardCard className="flex flex-col gap-0.5 p-2">
        <StaggerContainer className="flex flex-col gap-0.5">
          {visible.map((snippet) => (
            <StaggerItem key={snippet.id}>
              <SnippetRow {...cardProps(snippet)} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </DashboardCard>
    )
  }

  return (
    <div ref={rootRef} className="flex flex-col gap-8">
      {!isContextView ? (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-2">
            <h1 className="font-heading text-[32px] font-bold tracking-tight text-[#f3f6fb]">
              Snippets
            </h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="text-sm text-[#94a3b8]">
                Store, organize, and share your code snippets.
              </p>
              <DashboardBadge variant="secondary">
                {items.length} {items.length === 1 ? "snippet" : "snippets"}
              </DashboardBadge>
              <DashboardBadge variant="warning">
                <Star className="size-3 fill-[#fbbf24] text-[#fbbf24]" />
                {favoritesCount}
              </DashboardBadge>
            </div>
          </div>
          <DashboardButton onClick={openCreate}>
            <Plus className="size-4" />
            New Snippet
          </DashboardButton>
        </div>
      ) : null}

      <SnippetToolbar
        filters={filters}
        onFiltersChange={patchFilters}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        tags={tags}
        search={searchInput}
        onSearchChange={setSearchInput}
        selectable={visible.length > 0 && !isContextView}
        allSelected={allVisibleSelected}
        onToggleSelectAll={toggleSelectAll}
      />

      {!isContextView && selected.size > 0 ? (
        <BulkToolbar
          count={selected.size}
          allFavorited={allFavorited}
          onFavorite={handleBulkFavorite}
          onArchive={handleBulkArchive}
          onDelete={() => setBulkDelete(true)}
          onExport={() =>
            toast.info("Export is coming in a later milestone")
          }
          onClear={clearSelection}
          pending={bulkPending}
        />
      ) : null}

      {renderEmptyState()}

      <SnippetDialog
        snippet={editing}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSaved={handleSave}
        lockedTag={isTagView ? lockedTag : undefined}
      />

      <DeleteDialog
        snippet={deleting}
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

      <CollectionPickerDialog
        snippet={collectionTarget}
        onOpenChange={(open) => {
          if (!open) setCollectionTarget(null)
        }}
        onSaved={(collections) => {
          if (collectionTarget) {
            void handleCollectionsSaved(collectionTarget, collections)
          }
        }}
      />
    </div>
  )
}

export { SnippetList }
