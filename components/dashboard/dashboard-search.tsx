"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function DashboardSearch() {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isMac, setIsMac] = React.useState(false)

  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform))

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="relative hidden max-w-[380px] flex-1 sm:block lg:max-w-[420px]">
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        ref={inputRef}
        type="search"
        aria-label="Search snippets"
        placeholder="Search snippets..."
        className="h-8 pr-16 pl-8"
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
