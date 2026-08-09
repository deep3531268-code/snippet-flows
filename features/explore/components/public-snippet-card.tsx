"use client"

import * as React from "react"
import { memo } from "react"
import { toast } from "sonner"
import { Check, Copy } from "lucide-react"

import {
  DashboardBadge,
  DashboardCard,
  IconButton,
} from "@/features/dashboard/ui"
import { useCopy } from "@/features/snippets/components/code-editor"
import { Highlight } from "@/features/snippets/components/highlight"
import {
  LanguageIcon,
  languageLabel,
} from "@/features/snippets/components/language-icon"
import { timeAgo } from "@/features/snippets/components/utils"
import type { SnippetListItem } from "@/features/snippets/types"
import { cn } from "@/lib/utils"

// Public Explore cards are view-only: the only action is copying the snippet.
// No favorite, edit, delete, archive, or collection management here.
function PublicSnippetCard({
  snippet,
  query,
  className,
}: {
  snippet: SnippetListItem
  query: string
  className?: string
}) {
  const { copied, copy } = useCopy(2000)

  const handleCopy = () => {
    void copy(snippet.content)
    toast.success("Copied to clipboard")
  }

  return (
    <DashboardCard
      interactive
      className={cn("group flex h-full flex-col gap-4 p-5", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
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
          <span className="size-1.5 rounded-full bg-[#4ade80]" />
          Public
        </span>
      </div>
    </DashboardCard>
  )
}

const MemoizedCard = memo(PublicSnippetCard)

export { MemoizedCard as PublicSnippetCard }
