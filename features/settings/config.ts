import type { SettingPersistence, SettingValue } from "./types"

// Single source of truth for every user preference: keys, categories,
// defaults, allowed values and persistence rules. Features must not hardcode
// setting keys anywhere else.

export const SETTING_CATEGORIES = [
  "general",
  "editor",
  "dashboard",
  "search",
  "account",
  "data",
] as const

export type SettingCategory = (typeof SETTING_CATEGORIES)[number]

export const THEME_OPTIONS = ["light", "dark", "system"] as const
export type ThemePreference = (typeof THEME_OPTIONS)[number]

export const VIEW_OPTIONS = ["grid", "list"] as const

export const SNIPPET_SORT_OPTIONS = [
  "updated",
  "created",
  "oldest",
  "az",
  "za",
  "language",
] as const

export const TAG_SORT_OPTIONS = ["updated", "created", "az", "za", "count"] as const

export const COLLECTION_SORT_OPTIONS = [
  "updated",
  "created",
  "az",
  "za",
  "count",
] as const

type SettingDef = {
  key: string
  category: SettingCategory
  label: string
  description?: string
  defaultValue: SettingValue
  allowedValues?: readonly string[]
  persistence: SettingPersistence
  // Physical localStorage key for `persistence: "local"` settings.
  storageKey?: string
}

export const SETTING_DEFS = [
  {
    key: "settings.appearance.theme",
    category: "general",
    label: "Theme",
    description: "Choose how SnippetFlow looks across all pages.",
    defaultValue: "system",
    allowedValues: THEME_OPTIONS,
    persistence: "database",
  },
  {
    key: "settings.editor.wordWrap",
    category: "editor",
    label: "Line wrapping",
    description: "Wrap long lines in the code editor by default.",
    defaultValue: false,
    persistence: "database",
  },
  {
    key: "settings.dashboard.snippetView",
    category: "dashboard",
    label: "Snippet view",
    defaultValue: "grid",
    allowedValues: VIEW_OPTIONS,
    persistence: "local",
    storageKey: "snippets-view",
  },
  {
    key: "settings.dashboard.snippetSort",
    category: "dashboard",
    label: "Snippet sort",
    defaultValue: "updated",
    allowedValues: SNIPPET_SORT_OPTIONS,
    persistence: "local",
    storageKey: "snippets-sort",
  },
  {
    key: "settings.dashboard.tagView",
    category: "dashboard",
    label: "Tag view",
    defaultValue: "grid",
    allowedValues: VIEW_OPTIONS,
    persistence: "local",
    storageKey: "tags-view",
  },
  {
    key: "settings.dashboard.tagSort",
    category: "dashboard",
    label: "Tag sort",
    defaultValue: "updated",
    allowedValues: TAG_SORT_OPTIONS,
    persistence: "local",
    storageKey: "tags-sort",
  },
  {
    key: "settings.dashboard.collectionView",
    category: "dashboard",
    label: "Collection view",
    defaultValue: "grid",
    allowedValues: VIEW_OPTIONS,
    persistence: "local",
    storageKey: "collections-view",
  },
  {
    key: "settings.dashboard.collectionSort",
    category: "dashboard",
    label: "Collection sort",
    defaultValue: "updated",
    allowedValues: COLLECTION_SORT_OPTIONS,
    persistence: "local",
    storageKey: "collections-sort",
  },
] satisfies SettingDef[]

export const SETTING_KEYS = {
  theme: "settings.appearance.theme",
  wordWrap: "settings.editor.wordWrap",
  snippetView: "settings.dashboard.snippetView",
  snippetSort: "settings.dashboard.snippetSort",
  tagView: "settings.dashboard.tagView",
  tagSort: "settings.dashboard.tagSort",
  collectionView: "settings.dashboard.collectionView",
  collectionSort: "settings.dashboard.collectionSort",
} as const

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS]

export function getSettingDef(key: SettingKey): SettingDef {
  const def = SETTING_DEFS.find((entry) => entry.key === key)
  if (!def) throw new Error(`Unknown setting key: ${key}`)
  return def
}

export const DB_SETTING_KEYS = SETTING_DEFS.filter(
  (def) => def.persistence === "database",
).map((def) => def.key) as readonly SettingKey[]

export function isDatabaseSetting(key: SettingKey): boolean {
  return (DB_SETTING_KEYS as readonly string[]).includes(key)
}

// Physical localStorage keys and defaults for the device-local dashboard list
// preferences. Lists import these instead of hardcoding storage keys. Values
// are derived from SETTING_DEFS at runtime (single source of truth); the casts
// only pin the literal types for typed consumption.
export const DASHBOARD_STORAGE = {
  snippetView: {
    key: getSettingDef(SETTING_KEYS.snippetView).storageKey as "snippets-view",
    default: getSettingDef(SETTING_KEYS.snippetView).defaultValue as "grid",
  },
  snippetSort: {
    key: getSettingDef(SETTING_KEYS.snippetSort).storageKey as "snippets-sort",
    default: getSettingDef(SETTING_KEYS.snippetSort).defaultValue as "updated",
  },
  tagView: {
    key: getSettingDef(SETTING_KEYS.tagView).storageKey as "tags-view",
    default: getSettingDef(SETTING_KEYS.tagView).defaultValue as "grid",
  },
  tagSort: {
    key: getSettingDef(SETTING_KEYS.tagSort).storageKey as "tags-sort",
    default: getSettingDef(SETTING_KEYS.tagSort).defaultValue as "updated",
  },
  collectionView: {
    key: getSettingDef(SETTING_KEYS.collectionView)
      .storageKey as "collections-view",
    default: getSettingDef(SETTING_KEYS.collectionView).defaultValue as "grid",
  },
  collectionSort: {
    key: getSettingDef(SETTING_KEYS.collectionSort)
      .storageKey as "collections-sort",
    default: getSettingDef(SETTING_KEYS.collectionSort).defaultValue as "updated",
  },
} as const
