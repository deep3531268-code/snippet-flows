"use client"

import { useState } from "react"
import { Palette } from "lucide-react"

import { FilterMenu, MenuCheckItem } from "@/features/shared/components"
import {
  TAG_COLOR_LABELS,
  TAG_COLOR_SWATCH,
  type TagListFilters,
} from "@/features/tags/query"
import { cn } from "@/lib/utils"

function TagFilterMenu({
  filters,
  onChange,
}: {
  filters: TagListFilters
  onChange: (patch: Partial<TagListFilters>) => void
}) {
  const [open, setOpen] = useState(false)

  const options: { value: TagListFilters["color"]; label: string }[] = [
    { value: "all", label: "All tags" },
    { value: "blue", label: TAG_COLOR_LABELS.blue },
    { value: "green", label: TAG_COLOR_LABELS.green },
    { value: "purple", label: TAG_COLOR_LABELS.purple },
    { value: "orange", label: TAG_COLOR_LABELS.orange },
    { value: "pink", label: TAG_COLOR_LABELS.pink },
    { value: "teal", label: TAG_COLOR_LABELS.teal },
  ]

  const active =
    filters.color !== "all"
      ? options.find((o) => o.value === filters.color)?.label
      : null

  return (
    <FilterMenu
      open={open}
      onOpenChange={setOpen}
      ariaLabel="Filter tags"
      title="Color"
      trigger={
        <>
          <Palette className="size-3.5 shrink-0" />
          <span className="truncate">{active ?? "All tags"}</span>
        </>
      }
      triggerClassName="max-w-44"
      panelClassName="w-52"
    >
      <div className="flex flex-col gap-0.5 p-1">
        {options.map((option) => {
          const selected = filters.color === option.value
          return (
            <MenuCheckItem
              key={option.value}
              selected={selected}
              onClick={() => {
                onChange({ color: option.value })
                setOpen(false)
              }}
              label={
                option.value === "all" ? (
                  option.label
                ) : (
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        TAG_COLOR_SWATCH[option.value],
                      )}
                    />
                    {option.label}
                  </span>
                )
              }
            />
          )
        })}
      </div>
    </FilterMenu>
  )
}

export { TagFilterMenu }
