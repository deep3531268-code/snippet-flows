"use client"

import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"

import type { Page } from "@/features/shared/pagination/types"

type UseInfiniteListOptions<T> = {
  initialItems: T[]
  initialNextCursor: string | null
  initialHasMore: boolean
  loadPage: (cursor: string | null) => Promise<Page<T>>
  // When this changes the list resets and reloads the first page.
  resetKey: string
  // Re-fetch the first page on mount when the SSR defaults differ from the
  // client's persisted filters/sort.
  reloadOnMount?: boolean
  // Reconcile server-rendered prop changes (after router.refresh()) only when
  // the current client prefs match the SSR defaults.
  reconcileProps?: boolean
}

type ItemWithId = { id: string }

export function useInfiniteList<T extends ItemWithId>({
  initialItems,
  initialNextCursor,
  initialHasMore,
  loadPage,
  resetKey,
  reloadOnMount = false,
  reconcileProps = false,
}: UseInfiniteListOptions<T>) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [initialLoading, setInitialLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPageRef = useRef(loadPage)
  loadPageRef.current = loadPage
  const nextCursorRef = useRef(nextCursor)
  nextCursorRef.current = nextCursor
  const requestIdRef = useRef(0)
  const busyRef = useRef(false)
  const attemptRef = useRef<"first" | "next">("next")

  const reloadFirstPage = useCallback(async () => {
    const requestId = ++requestIdRef.current
    busyRef.current = true
    attemptRef.current = "first"
    setInitialLoading(true)
    setError(null)
    try {
      const page = await loadPageRef.current(null)
      if (requestId !== requestIdRef.current) return
      setItems(page.items)
      setNextCursor(page.nextCursor)
      setHasMore(page.hasMore)
    } catch {
      if (requestId !== requestIdRef.current) return
      setError("Failed to load items")
    } finally {
      if (requestId === requestIdRef.current) {
        setInitialLoading(false)
        busyRef.current = false
      }
    }
  }, [])

  const loadNextPage = useCallback(async () => {
    if (busyRef.current) return
    const requestId = requestIdRef.current
    const cursor = nextCursorRef.current
    if (!cursor) return
    busyRef.current = true
    attemptRef.current = "next"
    setLoadingMore(true)
    setError(null)
    try {
      const page = await loadPageRef.current(cursor)
      if (requestId !== requestIdRef.current) return
      setItems((current) => {
        const known = new Set(current.map((item) => item.id))
        const fresh = page.items.filter((item) => !known.has(item.id))
        return fresh.length > 0 ? [...current, ...fresh] : current
      })
      setNextCursor(page.nextCursor)
      setHasMore(page.hasMore)
    } catch {
      if (requestId !== requestIdRef.current) return
      setError("Failed to load more")
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingMore(false)
        busyRef.current = false
      }
    }
  }, [])

  // resetKey change => reload the first page with the latest filters/sort.
  const resetKeyRef = useRef(resetKey)
  useEffect(() => {
    if (resetKeyRef.current === resetKey) return
    resetKeyRef.current = resetKey
    void reloadFirstPage()
  }, [resetKey, reloadFirstPage])

  // reload on mount when the SSR default page does not match client prefs.
  const mountedRef = useRef(false)
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    if (reloadOnMount) void reloadFirstPage()
  }, [reloadOnMount, reloadFirstPage])

  // Reconcile server-rendered prop changes after router.refresh() only when
  // the current client prefs match the SSR defaults.
  const prevPropsRef = useRef({ initialItems, initialNextCursor, initialHasMore })
  useEffect(() => {
    if (!reconcileProps) return
    const prev = prevPropsRef.current
    if (
      prev.initialItems === initialItems &&
      prev.initialNextCursor === initialNextCursor &&
      prev.initialHasMore === initialHasMore
    ) {
      return
    }
    prevPropsRef.current = { initialItems, initialNextCursor, initialHasMore }
    setItems(initialItems)
    setNextCursor(initialNextCursor)
    setHasMore(initialHasMore)
    setError(null)
  }, [initialItems, initialNextCursor, initialHasMore, reconcileProps])

  // IntersectionObserver sentinel: load the next page when the user approaches
  // the end. Duplicate/rapid triggers are guarded by busyRef.
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect()
      observerRef.current = null
      if (!node) return
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            void loadNextPage()
          }
        },
        { rootMargin: "300px 0px" },
      )
      observer.observe(node)
      observerRef.current = observer
    },
    [loadNextPage],
  )

  useEffect(() => {
    return () => observerRef.current?.disconnect()
  }, [])

  const retry = useCallback(() => {
    if (!error) return
    void (attemptRef.current === "first" ? reloadFirstPage() : loadNextPage())
  }, [error, reloadFirstPage, loadNextPage])

  return {
    items,
    setItems,
    nextCursor,
    hasMore,
    initialLoading,
    loadingMore,
    error,
    retry,
    sentinelRef,
  }
}
