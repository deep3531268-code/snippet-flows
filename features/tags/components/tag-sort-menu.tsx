"use client"

import { SortMenu } from "@/features/shared/components"
import { TAG_SORT_OPTIONS, type TagListSort } from "@/features/tags/query"

function TagSortMenu({
  sort,
  onChange,
}: {
  sort: TagListSort
  onChange: (sort: TagListSort) => void
}) {
  return (
    <SortMenu
      sort={sort}
      onChange={onChange}
      options={TAG_SORT_OPTIONS}
      ariaLabel="Sort tags"
      iconClassName="shrink-0"
      triggerClassName="max-w-44"
      panelClassName="w-52"
      separator
    />
  )
}

export { TagSortMenu }
