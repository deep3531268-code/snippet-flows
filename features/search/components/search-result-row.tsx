"use client"

import { Badge } from "@/components/ui/badge"
import { Highlight } from "@/features/shared/components/highlight"
import { TAG_COLOR_SWATCH } from "@/features/tags/query"
import { cn } from "@/lib/utils"

import { searchRowClassName } from "../styles"
import type { SearchItem } from "../types"

function SnippetContent({ item, query }: { item: SearchItem; query: string }) {
  return (
    <>
      <span className="truncate">
        <Highlight text={item.title} query={query} />
      </span>
      {item.description ? (
        <span className="truncate text-xs text-muted-foreground">
          <Highlight text={item.description} query={query} />
        </span>
      ) : null}
      {item.codePreview ? (
        <span className="line-clamp-3 mt-1 w-full rounded-md bg-muted/50 px-2 py-1 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-all text-muted-foreground">
          <Highlight text={item.codePreview} query={query} />
        </span>
      ) : null}
    </>
  )
}

function EntityContent({ item, query }: { item: SearchItem; query: string }) {
  return (
    <>
      <span className="flex min-w-0 items-center gap-2">
        {item.kind === "tag" && item.tagColor ? (
          <span
            aria-hidden
            className={cn(
              "size-2 shrink-0 rounded-full",
              TAG_COLOR_SWATCH[item.tagColor],
            )}
          />
        ) : null}
        <span className="truncate">
          <Highlight text={item.title} query={query} />
        </span>
      </span>
      {item.description ? (
        <span className="truncate text-xs text-muted-foreground">
          <Highlight text={item.description} query={query} />
        </span>
      ) : null}
    </>
  )
}

export function SearchResultRow({
  item,
  query,
  active,
  id,
  onMouseEnter,
  onActivate,
}: {
  item: SearchItem
  query: string
  active: boolean
  id?: string
  onMouseEnter: () => void
  onActivate: () => void
}) {
  return (
    <button
      type="button"
      id={id}
      role="option"
      aria-selected={active}
      aria-current={active ? "true" : undefined}
      onMouseEnter={onMouseEnter}
      onClick={onActivate}
      className={searchRowClassName(active)}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        {item.kind === "snippet" ? (
          <SnippetContent item={item} query={query} />
        ) : (
          <EntityContent item={item} query={query} />
        )}
      </span>
      {item.snippetCount != null ? (
        <Badge variant="outline" className="shrink-0 whitespace-nowrap tabular-nums">
          {item.snippetCount}{" "}
          {item.snippetCount === 1 ? "snippet" : "snippets"}
        </Badge>
      ) : null}
      <Badge variant="outline" className="shrink-0 capitalize">
        {item.kind}
      </Badge>
    </button>
  )
}
