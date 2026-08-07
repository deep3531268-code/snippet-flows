"use client"

import { useState } from "react"
import { Globe } from "lucide-react"

import { FilterMenu, MenuCheckItem } from "@/features/shared/components"
import type { CollectionListFilters } from "@/features/collections/query"

function CollectionFilterMenu({
  filters,
  onChange,
}: {
  filters: CollectionListFilters
  onChange: (patch: Partial<CollectionListFilters>) => void
}) {
  const [open, setOpen] = useState(false)

  const options: {
    value: CollectionListFilters["visibility"]
    label: string
  }[] = [
    { value: "all", label: "All collections" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ]

  const active =
    filters.visibility !== "all"
      ? options.find((o) => o.value === filters.visibility)?.label
      : null

  return (
    <FilterMenu
      open={open}
      onOpenChange={setOpen}
      ariaLabel="Filter collections"
      title="Visibility"
      trigger={
        <>
          <Globe className="size-3.5 shrink-0" />
          <span className="truncate">{active ?? "All collections"}</span>
        </>
      }
      triggerClassName="max-w-44"
      panelClassName="w-52"
    >
      <div className="flex flex-col gap-0.5 p-1">
        {options.map((option) => {
          const selected = filters.visibility === option.value
          return (
            <MenuCheckItem
              key={option.value}
              selected={selected}
              onClick={() => {
                onChange({ visibility: option.value })
                setOpen(false)
              }}
              label={option.label}
            />
          )
        })}
      </div>
    </FilterMenu>
  )
}

export { CollectionFilterMenu }
