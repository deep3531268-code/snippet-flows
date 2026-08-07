"use client"

import * as React from "react"
import { memo } from "react"

import { DashboardBadge } from "@/features/dashboard/ui"
import { CardActions } from "./snippet-card"
import { Highlight } from "./highlight"
import { LanguageIcon, languageLabel } from "./language-icon"
import { timeAgo } from "./utils"
import type { SnippetListItem } from "@/features/snippets/types"

function SnippetRow({
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
}) {
  return (
    <div className="flex items-center gap-3 px-2 py-2.5 transition-colors hover:bg-white/[0.03]">
      {selectable ? (
        <input
          type="checkbox"
          aria-label={`Select ${snippet.title}`}
          checked={selected}
          onChange={() => onToggleSelect(snippet.id)}
          className="size-4 shrink-0 cursor-pointer appearance-none rounded border border-white/[0.15] bg-white/[0.03] transition-colors checked:border-[#2563eb] checked:bg-[#2563eb]"
        />
      ) : null}

      <LanguageIcon language={snippet.language} size="sm" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-[#f3f6fb]">
            <Highlight text={snippet.title} query={query} />
          </h3>
          {snippet.isFavorite ? (
            <span
              aria-label="Favorite"
              className="size-1.5 shrink-0 rounded-full bg-[#fbbf24]"
            />
          ) : null}
        </div>
        <p className="truncate text-xs text-[#94a3b8]">
          {languageLabel(snippet.language)}
          {snippet.description ? (
            <>
              {" · "}
              <Highlight text={snippet.description} query={query} />
            </>
          ) : null}
        </p>
      </div>

      {snippet.tags.length > 0 ? (
        <div className="hidden shrink-0 items-center gap-1 md:flex">
          {snippet.tags.slice(0, 3).map((tag) => (
            <DashboardBadge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </DashboardBadge>
          ))}
        </div>
      ) : null}

      <span className="hidden shrink-0 text-xs text-[#7d8ba3] sm:block">
        {timeAgo(snippet.updatedAt)}
      </span>

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
  )
}

const MemoizedRow = memo(SnippetRow)

export { MemoizedRow as SnippetRow }
