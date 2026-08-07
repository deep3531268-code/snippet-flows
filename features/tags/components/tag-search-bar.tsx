"use client"

import { SearchBar } from "@/features/shared/components"

function TagSearchBar({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Search tags…"
      ariaLabel="Search tags"
      dataAttribute="tags-search"
      className={className}
    />
  )
}

export { TagSearchBar }
