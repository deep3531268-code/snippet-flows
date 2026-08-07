"use client"

import * as React from "react"

const STORAGE_KEY = "snippetflow:sidebar:collapsed"

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = React.useState(false)

  React.useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1")
    } catch {
      setCollapsed(false)
    }
  }, [])

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0")
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }
  }, [collapsed])

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  return { collapsed, toggleCollapsed }
}
