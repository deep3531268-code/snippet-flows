"use client"

import { useLocalStorage } from "@/features/shared/hooks"
import { SORT_OPTIONS as SNIPPET_SORT_OPTIONS } from "@/features/snippets/query"
import { TAG_SORT_OPTIONS } from "@/features/tags/query"
import { COLLECTION_SORT_OPTIONS } from "@/features/collections/query"

import { DASHBOARD_STORAGE } from "../config"
import { SettingRow } from "./setting-row"
import { SettingSegment } from "./setting-segment"
import { SettingSelect } from "./setting-select"

const VIEW_OPTIONS = [
  { value: "grid", label: "Grid" },
  { value: "list", label: "List" },
] as const

type ViewValue = (typeof VIEW_OPTIONS)[number]["value"]

function validateView(raw: string | null, fallback: ViewValue): ViewValue {
  return raw === "grid" || raw === "list" ? raw : fallback
}

function validateSort(
  raw: string | null,
  options: readonly { value: string; label: string }[],
  fallback: string,
): string {
  return options.some((option) => option.value === raw) ? (raw as string) : fallback
}

function DashboardGroup({
  title,
  description,
  viewStorage,
  sortStorage,
  sortOptions,
  segmentLayoutId,
}: {
  title: string
  description: string
  viewStorage: { key: string; default: ViewValue }
  sortStorage: { key: string; default: string }
  sortOptions: readonly { value: string; label: string }[]
  segmentLayoutId: string
}) {
  const [view, setView] = useLocalStorage<ViewValue>(
    viewStorage.key,
    viewStorage.default,
    (raw) => validateView(raw, viewStorage.default),
    String,
  )
  const [sort, setSort] = useLocalStorage<string>(
    sortStorage.key,
    sortStorage.default,
    (raw) => validateSort(raw, sortOptions, sortStorage.default),
    String,
  )

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <SettingRow title="View" description="Default layout for this list.">
        <SettingSegment
          value={view}
          options={VIEW_OPTIONS}
          onChange={setView}
          ariaLabel={`${title} view`}
          layoutId={segmentLayoutId}
        />
      </SettingRow>
      <SettingRow title="Sort" description="Default ordering for this list.">
        <SettingSelect
          value={sort}
          options={sortOptions}
          onChange={setSort}
          ariaLabel={`${title} sort`}
        />
      </SettingRow>
    </div>
  )
}

function DashboardSettings() {
  return (
    <div className="flex flex-col gap-5">
      <DashboardGroup
        title="Snippets"
        description="Default layout for the snippets list."
        viewStorage={DASHBOARD_STORAGE.snippetView}
        sortStorage={DASHBOARD_STORAGE.snippetSort}
        sortOptions={SNIPPET_SORT_OPTIONS}
        segmentLayoutId="dashboard-snippets-view"
      />
      <div className="h-px bg-border" />
      <DashboardGroup
        title="Tags"
        description="Default layout for the tags list."
        viewStorage={DASHBOARD_STORAGE.tagView}
        sortStorage={DASHBOARD_STORAGE.tagSort}
        sortOptions={TAG_SORT_OPTIONS}
        segmentLayoutId="dashboard-tags-view"
      />
      <div className="h-px bg-border" />
      <DashboardGroup
        title="Collections"
        description="Default layout for the collections list."
        viewStorage={DASHBOARD_STORAGE.collectionView}
        sortStorage={DASHBOARD_STORAGE.collectionSort}
        sortOptions={COLLECTION_SORT_OPTIONS}
        segmentLayoutId="dashboard-collections-view"
      />
    </div>
  )
}

export { DashboardSettings }
