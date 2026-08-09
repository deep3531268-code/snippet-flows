"use client"

import * as React from "react"
import { SlidersHorizontal } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FilterMenu, MenuCheckItem } from "@/features/shared/components"
import {
  SNIPPET_LANGUAGES,
  SNIPPET_LANGUAGE_LABELS,
} from "@/features/snippets/languages"
import { LanguageIcon } from "@/features/snippets/components/language-icon"
import type { ExploreFilters } from "@/features/explore/query"

function ExploreFilterMenu({
  filters,
  onChange,
  tags,
  onClear,
}: {
  filters: ExploreFilters
  onChange: (patch: Partial<ExploreFilters>) => void
  tags: string[]
  onClear: () => void
}) {
  const activeCount = [
    filters.language !== "all",
    filters.tag !== "all",
  ].filter(Boolean).length

  return (
    <FilterMenu
      ariaLabel="Filter public snippets"
      title="Filter snippets"
      trigger={
        <>
          <SlidersHorizontal className="size-3.5" />
          Filters
        </>
      }
      activeCount={activeCount}
      panelClassName="w-64"
      onClear={onClear}
    >
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
                      onClick={() => onChange({ tag: selected ? "all" : name })}
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

export { ExploreFilterMenu }
