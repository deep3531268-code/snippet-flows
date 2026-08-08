import type { SnippetListSort, SnippetView } from "@/features/snippets/query"
import type { TagListSort, TagView } from "@/features/tags/query"
import type {
  CollectionListSort,
  CollectionView,
} from "@/features/collections/query"
import type { ThemePreference } from "./config"

export type SettingPersistence = "database" | "local"

export type SettingValue = string | boolean

// Strongly typed view of every user preference, keyed by category. This is the
// shape consumed by components and returned by the settings service.
export type Settings = {
  appearance: {
    theme: ThemePreference
  }
  editor: {
    wordWrap: boolean
  }
  dashboard: {
    snippetView: SnippetView
    snippetSort: SnippetListSort
    tagView: TagView
    tagSort: TagListSort
    collectionView: CollectionView
    collectionSort: CollectionListSort
  }
}
