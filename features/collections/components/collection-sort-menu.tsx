"use client"

import { SortMenu } from "@/features/shared/components"
import {
  COLLECTION_SORT_OPTIONS,
  type CollectionListSort,
} from "@/features/collections/query"

function CollectionSortMenu({
  sort,
  onChange,
}: {
  sort: CollectionListSort
  onChange: (sort: CollectionListSort) => void
}) {
  return (
    <SortMenu
      sort={sort}
      onChange={onChange}
      options={COLLECTION_SORT_OPTIONS}
      ariaLabel="Sort collections"
      iconClassName="shrink-0"
      triggerClassName="max-w-44"
      panelClassName="w-52"
      separator
    />
  )
}

export { CollectionSortMenu }
