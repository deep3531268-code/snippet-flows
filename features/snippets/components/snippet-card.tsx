"use client"

import * as React from "react"
import { memo } from "react"
import { toast } from "sonner"
import {
  Check,
  Copy,
  EllipsisVertical,
  FolderMinus,
  FolderPlus,
  Pencil,
  Star,
  Trash2,
  Unlink,
} from "lucide-react"

import {
  DashboardBadge,
  DashboardCard,
  IconButton,
} from "@/features/dashboard/ui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCopy } from "./code-editor"
import { Highlight } from "./highlight"
import { LanguageIcon, languageLabel } from "./language-icon"
import { timeAgo } from "./utils"
import type { SnippetListItem } from "@/features/snippets/types"
import { cn } from "@/lib/utils"

function CardActions({
  snippet,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onAddToCollection,
  onRemoveFromCollection,
  onRemoveFromTag,
  pending = false,
}: {
  snippet: SnippetListItem
  onEdit: (snippet: SnippetListItem) => void
  onDuplicate: (snippet: SnippetListItem) => void
  onDelete: (snippet: SnippetListItem) => void
  onToggleFavorite: (snippet: SnippetListItem) => void
  onAddToCollection: (snippet: SnippetListItem) => void
  onRemoveFromCollection?: (snippet: SnippetListItem) => void
  onRemoveFromTag?: (snippet: SnippetListItem) => void
  pending?: boolean
}) {
  const { copied, copy } = useCopy(2000)

  const handleCopy = () => {
    void copy(snippet.content)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <IconButton
        type="button"
        aria-label={
          snippet.isFavorite ? "Remove from favorites" : "Add to favorites"
        }
        aria-pressed={snippet.isFavorite}
        disabled={pending}
        onClick={() => onToggleFavorite(snippet)}
        className="size-8"
      >
        <Star
          className={cn(
            "size-4 transition-colors",
            snippet.isFavorite
              ? "fill-[#fbbf24] text-[#fbbf24]"
              : "text-[#94a3b8]",
          )}
        />
      </IconButton>

      <IconButton
        type="button"
        aria-label="Copy snippet code"
        aria-pressed={copied}
        onClick={handleCopy}
        className="size-8"
      >
        {copied ? (
          <Check className="size-4 text-[#4ade80]" />
        ) : (
          <Copy className="size-4" />
        )}
      </IconButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton type="button" aria-label="Snippet actions" className="size-8">
            <EllipsisVertical className="size-4" />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 border-white/[0.08] bg-[#141f30] text-[#e8edf5] ring-white/[0.1]"
        >
          <DropdownMenuItem
            onSelect={() => onEdit(snippet)}
            className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]"
          >
            <Pencil /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={pending}
            onSelect={() => onDuplicate(snippet)}
            className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]"
          >
            <Copy /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={pending}
            onSelect={() => onAddToCollection(snippet)}
            className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]"
          >
            <FolderPlus /> Add to Collection
          </DropdownMenuItem>
          {onRemoveFromCollection ? (
            <DropdownMenuItem
              disabled={pending}
              onSelect={() => onRemoveFromCollection(snippet)}
              className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]"
            >
              <FolderMinus /> Remove from Collection
            </DropdownMenuItem>
          ) : null}
          {onRemoveFromTag ? (
            <DropdownMenuItem
              disabled={pending}
              onSelect={() => onRemoveFromTag(snippet)}
              className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]"
            >
              <Unlink /> Remove from Tag
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator className="bg-white/[0.06]" />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => onDelete(snippet)}
            className="text-[#fb7185] data-[variant=destructive]:focus:bg-[#fb7185]/10 data-[variant=destructive]:focus:text-[#fb7185]"
          >
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function SnippetCard({
  snippet,
  selected,
  selectable = true,
  query,
  pending,
  onToggleSelect,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onAddToCollection,
  onRemoveFromCollection,
  onRemoveFromTag,
  className,
}: {
  snippet: SnippetListItem
  selected: boolean
  selectable?: boolean
  query: string
  pending: boolean
  onToggleSelect: (id: string) => void
  onEdit: (snippet: SnippetListItem) => void
  onDuplicate: (snippet: SnippetListItem) => void
  onDelete: (snippet: SnippetListItem) => void
  onToggleFavorite: (snippet: SnippetListItem) => void
  onAddToCollection: (snippet: SnippetListItem) => void
  onRemoveFromCollection?: (snippet: SnippetListItem) => void
  onRemoveFromTag?: (snippet: SnippetListItem) => void
  className?: string
}) {
  return (
    <DashboardCard
      interactive
      className={cn("group flex h-full flex-col gap-4 p-5", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {selectable ? (
            <input
              type="checkbox"
              aria-label={`Select ${snippet.title}`}
              checked={selected}
              onChange={() => onToggleSelect(snippet.id)}
              className="size-4 shrink-0 cursor-pointer appearance-none rounded border border-white/[0.15] bg-white/[0.03] transition-colors checked:border-[#2563eb] checked:bg-[#2563eb]"
            />
          ) : null}
          <LanguageIcon language={snippet.language} />
          <div className="grid min-w-0 gap-0.5">
            <h3
              className="truncate text-sm font-semibold text-[#f3f6fb]"
              title={snippet.title}
            >
              <Highlight text={snippet.title} query={query} />
            </h3>
            <p className="truncate text-xs text-[#94a3b8]">
              {languageLabel(snippet.language)}
            </p>
          </div>
        </div>

        <CardActions
          snippet={snippet}
          pending={pending}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          onAddToCollection={onAddToCollection}
          onRemoveFromCollection={onRemoveFromCollection}
          onRemoveFromTag={onRemoveFromTag}
        />
      </div>

      {snippet.description ? (
        <p className="line-clamp-2 text-sm text-[#94a3b8]">
          <Highlight text={snippet.description} query={query} />
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {snippet.tags.length > 0 ? (
          snippet.tags.map((tag) => (
            <DashboardBadge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </DashboardBadge>
          ))
        ) : (
          <span className="text-xs text-[#5b6b82]">No tags</span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-[#7d8ba3]">
        <span>Updated {timeAgo(snippet.updatedAt)}</span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              "size-1.5 rounded-full",
              snippet.isFavorite ? "bg-[#fbbf24]" : "bg-[#4ade80]",
            )}
          />
          {snippet.isFavorite ? "Favorite" : "Private"}
        </span>
      </div>
    </DashboardCard>
  )
}

const MemoizedCard = memo(SnippetCard)

export { MemoizedCard as SnippetCard, CardActions }
