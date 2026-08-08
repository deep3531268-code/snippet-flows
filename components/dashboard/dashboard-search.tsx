"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useGlobalSearch } from "@/features/search"

export function DashboardSearch() {
  const [isMac, setIsMac] = React.useState(false)
  const { open } = useGlobalSearch()

  React.useEffect(() => {
    const update = () =>
      setIsMac(/Mac|iPhone|iPad/.test(navigator.platform))
    update()
  }, [])

  return (
    <div className="relative hidden max-w-[380px] flex-1 sm:block lg:max-w-[420px]">
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        aria-label="Open global search"
        placeholder="Search snippets..."
        readOnly
        onFocus={open}
        className="h-8 pr-16 pl-8 cursor-pointer"
      />
      <kbd
        className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-muted/50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground select-none sm:flex"
        aria-hidden
      >
        {isMac ? "⌘K" : "Ctrl K"}
      </kbd>
    </div>
  )
}
