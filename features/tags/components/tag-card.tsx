"use client"

import * as React from "react"
import { memo } from "react"
import { useRouter } from "next/navigation"
import { EllipsisVertical, Tag } from "lucide-react"

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
import { RelativeTime } from "@/features/shared/components"
import { cn } from "@/lib/utils"
import { TAG_GLOW, TAG_GRADIENTS } from "../query"
import type { TagListItem } from "../types"

function TagCard({
  tag,
  className,
  selected = false,
  selectable = true,
  onToggleSelect,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  tag: TagListItem
  className?: string
  selected?: boolean
  selectable?: boolean
  onToggleSelect: (id: string) => void
  onEdit: (tag: TagListItem) => void
  onDuplicate: (tag: TagListItem) => void
  onDelete: (tag: TagListItem) => void
}) {
  const router = useRouter()

  const navigate = () => {
    router.push(`/dashboard/tags/${tag.id}`)
  }

  return (
    <DashboardCard
      interactive
      onClick={navigate}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          navigate()
        }
      }}
      role="button"
      tabIndex={0}
      className={cn(
        "group flex h-full cursor-pointer flex-col gap-4 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cb3ff]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {selectable ? (
            <input
              type="checkbox"
              aria-label={`Select ${tag.name}`}
              checked={selected}
              onChange={() => onToggleSelect(tag.id)}
              onClick={(event) => event.stopPropagation()}
              className="size-4 shrink-0 cursor-pointer appearance-none rounded border border-white/[0.15] bg-white/[0.03] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cb3ff] checked:border-[#2563eb] checked:bg-[#2563eb]"
            />
          ) : null}
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:scale-105",
              TAG_GRADIENTS[tag.color],
              TAG_GLOW[tag.color],
            )}
          >
            <Tag className="size-6" />
          </div>
          <div className="grid min-w-0 gap-1">
            <h3
              className="truncate text-sm font-semibold text-[#f3f6fb]"
              title={tag.name}
            >
              {tag.name}
            </h3>
            <DashboardBadge variant="secondary" className="w-fit text-xs">
              Tag
            </DashboardBadge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              type="button"
              aria-label={`${tag.name} actions`}
              onClick={(event) => event.stopPropagation()}
              className="size-8"
            >
              <EllipsisVertical className="size-4" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={(event) => event.stopPropagation()}
            className="w-44 border-white/[0.08] bg-[#141f30] text-[#e8edf5] ring-white/[0.1]"
          >
            <DropdownMenuItem
              onSelect={() => onEdit(tag)}
              className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onDuplicate(tag)}
              className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]"
            >
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onSelect={() => onDelete(tag)}
              className="text-[#fb7185] focus:bg-[#fb7185]/10 focus:text-[#fda4af]"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-[#5b6b82]">
          {tag.snippetCount === 0 ? "No snippets yet" : "Applied to snippets"}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-[#7d8ba3]">
        <span className="font-medium text-[#94a3b8]">
          {tag.snippetCount} {tag.snippetCount === 1 ? "snippet" : "snippets"}
        </span>
        <span>
          Updated <RelativeTime date={tag.updatedAt} />
        </span>
      </div>
    </DashboardCard>
  )
}

const MemoizedCard = memo(TagCard)

export { MemoizedCard as TagCard }
