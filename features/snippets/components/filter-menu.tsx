"use client"

import { Globe, SlidersHorizontal, Star } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FilterMenu, MenuCheckItem } from "@/features/shared/components"
import {
  SNIPPET_LANGUAGES,
  SNIPPET_LANGUAGE_LABELS,
} from "@/features/snippets/languages"
import {
  DEFAULT_FILTERS,
  hasActiveFilters,
  type SnippetListFilters,
} from "@/features/snippets/query"
import { LanguageIcon } from "./language-icon"
import { cn } from "@/lib/utils"

function SnippetFilterMenu({
  filters,
  onChange,
  tags,
}: {
  filters: SnippetListFilters
  onChange: (patch: Partial<SnippetListFilters>) => void
  tags: string[]
}) {
  const activeCount = hasActiveFilters(filters)
    ? [
        filters.language !== "all",
        filters.tag !== "all",
        filters.favoritesOnly,
        filters.visibility !== "all",
      ].filter(Boolean).length
    : 0

  return (
    <FilterMenu
      ariaLabel="Filter snippets"
      title="Filter snippets"
      trigger={
        <>
          <SlidersHorizontal className="size-3.5" />
          Filters
        </>
      }
      activeCount={activeCount}
      panelClassName="w-64"
      onClear={() => onChange({ ...DEFAULT_FILTERS })}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Star
            className={cn(
              "size-4",
              filters.favoritesOnly
                ? "fill-[#fbbf24] text-[#fbbf24]"
                : "text-[#94a3b8]",
            )}
          />
          Favorites
        </span>
        <Switch
          checked={filters.favoritesOnly}
          onCheckedChange={(checked) => onChange({ favoritesOnly: checked })}
          aria-label="Only show favorites"
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      <div className="px-1 py-1">
        <p className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium">
          <Globe className="size-4 text-[#94a3b8]" />
          Visibility
        </p>
        <div className="flex flex-col p-1">
          {(
            [
              { value: "all", label: "All snippets" },
              { value: "public", label: "Public" },
              { value: "private", label: "Private" },
            ] as const
          ).map((option) => {
            const selected = filters.visibility === option.value
            return (
              <MenuCheckItem
                key={option.value}
                selected={selected}
                onClick={() => onChange({ visibility: option.value })}
                label={<span className="truncate">{option.label}</span>}
              />
            )
          })}
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      <div className="px-1">
        <ScrollArea className="max-h-48">
          <div className="flex flex-col p-1">
            {SNIPPET_LANGUAGES.map((lang) => {
              const selected = filters.language === lang
              return (
                <MenuCheckItem
                  key={lang}
                  selected={selected}
                  onClick={() =>
                    onChange({ language: selected ? "all" : lang })
                  }
                  label={
                    <>
                      <LanguageIcon language={lang} size="sm" />
                      <span className="truncate">
                        {SNIPPET_LANGUAGE_LABELS[lang]}
                      </span>
                    </>
                  }
                />
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {tags.length > 0 ? (
        <>
          <Separator className="bg-white/[0.06]" />
          <div className="px-1">
            <ScrollArea className="max-h-32">
              <div className="flex flex-col p-1">
                {tags.map((name) => {
                  const selected = filters.tag === name
                  return (
                    <MenuCheckItem
                      key={name}
                      selected={selected}
                      onClick={() =>
                        onChange({ tag: selected ? "all" : name })
                      }
                      label={
                        <span className="truncate">
                          <span className="text-[#7cb3ff]">#</span>
                          {name}
                        </span>
                      }
                    />
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </>
      ) : null}
    </FilterMenu>
  )
}

export { SnippetFilterMenu }
