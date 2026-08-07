export type TagColor = "blue" | "green" | "purple" | "orange" | "pink" | "teal"

export type TagSort = "updated" | "created" | "az" | "za" | "count"

export type TagListItem = {
  id: string
  name: string
  color: TagColor
  snippetCount: number
  createdAt: string
  updatedAt: string
}
