"use client"

import * as React from "react"
import { X } from "lucide-react"

import { IconButton, SearchInput } from "@/features/dashboard/ui"
import { cn } from "@/lib/utils"

function SearchBar({
  value,
  onChange,
  placeholder,
  ariaLabel,
  dataAttribute,
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
  dataAttribute: string
  className?: string
}) {
  const dataProps = { [`data-${dataAttribute}`]: "" }
  return (
    <div className={cn("relative", className)}>
      <SearchInput
        {...dataProps}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        kbd={value ? undefined : "⌘F"}
        className="w-full"
      />
      {value ? (
        <IconButton
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-1.5 size-7 -translate-y-1/2 rounded-full bg-transparent"
        >
          <X className="size-3.5" />
        </IconButton>
      ) : null}
    </div>
  )
}

export { SearchBar }
