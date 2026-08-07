"use client"

import * as React from "react"
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type SnippetCreateApi = {
  openCreate: () => void
  setOpenCreate: (openCreate: () => void) => void
}

const SnippetCreateContext = createContext<SnippetCreateApi | null>(null)

function SnippetDialogProvider({ children }: { children: React.ReactNode }) {
  const [openCreate, setOpenCreate] = useState<() => void>(() => () => {})

  const value = useMemo(
    () => ({ openCreate, setOpenCreate }),
    [openCreate],
  )

  return (
    <SnippetCreateContext.Provider value={value}>
      {children}
    </SnippetCreateContext.Provider>
  )
}

function useSnippetCreateContext() {
  const context = useContext(SnippetCreateContext)
  if (!context) {
    throw new Error(
      "useSnippetCreateContext must be used within a SnippetDialogProvider",
    )
  }
  return context
}

function useOpenSnippetCreate() {
  const context = useContext(SnippetCreateContext)
  const router = useRouter()

  return useCallback(() => {
    if (context?.openCreate) {
      context.openCreate()
    } else {
      router.push("/dashboard/snippets")
    }
  }, [context, router])
}

export {
  SnippetDialogProvider,
  useOpenSnippetCreate,
  useSnippetCreateContext,
}
