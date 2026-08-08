export type DashboardRecentSnippet = {
  id: string
  title: string
  description: string | null
  content: string
  language: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  tags: { id: string; name: string }[]
  collections: { id: string; name: string }[]
}

export type DashboardCollectionSummary = {
  id: string
  name: string
  description: string | null
  snippetCount: number
  createdAt: string
  updatedAt: string
}

export type DashboardActivityKind = "snippet" | "collection" | "tag"

export type DashboardActivityEvent = {
  id: string
  kind: DashboardActivityKind
  text: string
  timestamp: string
  route: string | null
}

export type DashboardContinueWorking = {
  snippet: DashboardRecentSnippet | null
  action: string | null
  timestamp: string | null
  route: string | null
}

export type DashboardStats = {
  total: number
  favorites: number
  collections: number
  tags: number
}

export type DashboardData = {
  userName: string | null
  stats: DashboardStats
  recentSnippets: DashboardRecentSnippet[]
  recentCollections: DashboardCollectionSummary[]
  activity: DashboardActivityEvent[]
  continueWorking: DashboardContinueWorking
}
