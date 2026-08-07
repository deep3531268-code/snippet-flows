"use client"

import { SearchBar } from "@/features/shared/components"

function CollectionSearchBar({
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
      placeholder="Search collections…"
      ariaLabel="Search collections"
      dataAttribute="collections-search"
      className={className}
    />
  )
}

export { CollectionSearchBar }
