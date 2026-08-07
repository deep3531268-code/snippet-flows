"use client"

import { SortMenu } from "@/features/shared/components"
import {
  SORT_OPTIONS,
  type SnippetListSort,
} from "@/features/snippets/query"

function SnippetSortMenu({
  sort,
  onChange,
}: {
  sort: SnippetListSort
  onChange: (sort: SnippetListSort) => void
}) {
  return (
    <SortMenu
      sort={sort}
      onChange={onChange}
      options={SORT_OPTIONS}
      ariaLabel="Sort snippets"
      labelClassName="max-w-36"
      panelClassName="w-56"
    />
  )
}

export { SnippetSortMenu }
