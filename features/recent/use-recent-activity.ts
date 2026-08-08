import { useCallback } from "react"
import {
  recordCollectionViewed,
  recordSnippetCopied,
  recordSnippetViewed,
} from "./actions"

export function useRecentActivity() {
  const viewSnippet = useCallback((id: string) => {
    void recordSnippetViewed(id)
  }, [])

  const copySnippet = useCallback((id: string) => {
    void recordSnippetCopied(id)
  }, [])

  const viewCollection = useCallback((id: string) => {
    void recordCollectionViewed(id)
  }, [])

  return { viewSnippet, copySnippet, viewCollection }
}
