export type CollectionAccent =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "teal"

export type CollectionVisibility = "public" | "private"

export type CollectionSort = "updated" | "created" | "az" | "za" | "count"

export type CollectionListItem = {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  accent: CollectionAccent
  snippetCount: number
  tags: { id: string; name: string }[]
  createdAt: string
  updatedAt: string
}
