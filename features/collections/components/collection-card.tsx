"use client"

import * as React from "react"
import { memo } from "react"
import { useRouter } from "next/navigation"
import { EllipsisVertical, Folder, Globe, Lock } from "lucide-react"

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
import type { CollectionAccent, CollectionListItem } from "../types"
import { RelativeTime } from "@/features/shared/components"
import { cn } from "@/lib/utils"

export const ACCENT_GRADIENTS: Record<CollectionAccent, string> = {
  blue: "bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] shadow-[0_8px_24px_-8px_rgba(37,99,235,0.6)]",
  green:
    "bg-gradient-to-br from-[#10b981] to-[#059669] shadow-[0_8px_24px_-8px_rgba(16,185,129,0.55)]",
  purple:
    "bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]",
  orange:
    "bg-gradient-to-br from-[#f59e0b] to-[#d97706] shadow-[0_8px_24px_-8px_rgba(245,158,11,0.5)]",
  pink: "bg-gradient-to-br from-[#ec4899] to-[#db2777] shadow-[0_8px_24px_-8px_rgba(236,72,153,0.5)]",
  teal: "bg-gradient-to-br from-[#14b8a6] to-[#0d9488] shadow-[0_8px_24px_-8px_rgba(20,184,166,0.5)]",
}

const ACCENT_GLOW: Record<CollectionAccent, string> = {
  blue: "group-hover:shadow-[0_12px_32px_-10px_rgba(37,99,235,0.65)]",
  green: "group-hover:shadow-[0_12px_32px_-10px_rgba(16,185,129,0.6)]",
  purple: "group-hover:shadow-[0_12px_32px_-10px_rgba(139,92,246,0.6)]",
  orange: "group-hover:shadow-[0_12px_32px_-10px_rgba(245,158,11,0.55)]",
  pink: "group-hover:shadow-[0_12px_32px_-10px_rgba(236,72,153,0.55)]",
  teal: "group-hover:shadow-[0_12px_32px_-10px_rgba(20,184,166,0.55)]",
}

function CollectionCard({
  collection,
  className,
  selected = false,
  selectable = true,
  onToggleSelect,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  collection: CollectionListItem
  className?: string
  selected?: boolean
  selectable?: boolean
  onToggleSelect: (id: string) => void
  onEdit: (collection: CollectionListItem) => void
  onDuplicate: (collection: CollectionListItem) => void
  onDelete: (collection: CollectionListItem) => void
}) {
  const router = useRouter()

  return (
    <DashboardCard
      interactive
      onClick={() => router.push(`/dashboard/collections/${collection.id}`)}
      className={cn(
        "group flex h-full cursor-pointer flex-col gap-4 p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {selectable ? (
            <input
              type="checkbox"
              aria-label={`Select ${collection.name}`}
              checked={selected}
              onChange={() => onToggleSelect(collection.id)}
              onClick={(event) => event.stopPropagation()}
              className="size-4 shrink-0 cursor-pointer appearance-none rounded border border-white/[0.15] bg-white/[0.03] transition-colors checked:border-[#2563eb] checked:bg-[#2563eb]"
            />
          ) : null}
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:scale-105",
              ACCENT_GRADIENTS[collection.accent],
              ACCENT_GLOW[collection.accent],
            )}
          >
            <Folder className="size-6" />
          </div>
          <div className="grid min-w-0 gap-1">
            <h3
              className="truncate text-sm font-semibold text-[#f3f6fb]"
              title={collection.name}
            >
              {collection.name}
            </h3>
            <DashboardBadge
              variant={collection.isPublic ? "success" : "secondary"}
              className="w-fit"
            >
              {collection.isPublic ? (
                <Globe className="size-3" />
              ) : (
                <Lock className="size-3" />
              )}
              {collection.isPublic ? "Public" : "Private"}
            </DashboardBadge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              type="button"
              aria-label={`${collection.name} actions`}
              onClick={(event) => event.stopPropagation()}
              className="size-8"
            >
              <EllipsisVertical className="size-4" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 border-white/[0.08] bg-[#141f30] text-[#e8edf5] ring-white/[0.1]"
          >
            <DropdownMenuItem
              onSelect={() => onEdit(collection)}
              className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onDuplicate(collection)}
              className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]"
            >
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onSelect={() => onDelete(collection)}
              className="text-[#fb7185] focus:bg-[#fb7185]/10 focus:text-[#fda4af]"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {collection.description ? (
        <p className="line-clamp-2 text-sm text-[#94a3b8]">
          {collection.description}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {collection.tags.length > 0 ? (
          collection.tags.map((tag) => (
            <DashboardBadge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </DashboardBadge>
          ))
        ) : (
          <span className="text-xs text-[#5b6b82]">No tags</span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-[#7d8ba3]">
        <span className="font-medium text-[#94a3b8]">
          {collection.snippetCount}{" "}
          {collection.snippetCount === 1 ? "snippet" : "snippets"}
        </span>
        <span>Updated <RelativeTime date={collection.updatedAt} /></span>
      </div>
    </DashboardCard>
  )
}

const MemoizedCard = memo(CollectionCard)

export { MemoizedCard as CollectionCard }
