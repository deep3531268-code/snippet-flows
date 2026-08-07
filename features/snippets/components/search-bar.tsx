"use client"

import { SearchBar } from "@/features/shared/components"

function SnippetSearchBar({
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
      placeholder="Search snippets…"
      ariaLabel="Search snippets"
      dataAttribute="snippets-search"
      className={className}
    />
  )
}

export { SnippetSearchBar }
