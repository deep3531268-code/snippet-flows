"use client"

import { Search } from "lucide-react"

const kbdClass =
  "inline-flex h-4 min-w-4 items-center justify-center rounded-[4px] px-1 font-sans text-[10px] font-medium text-muted-foreground ring-1 ring-foreground/10"

function Shortcut({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1">
      {children}
    </span>
  )
}

function SearchFooter({
  queryActive,
  resultCount,
}: {
  queryActive: boolean
  resultCount: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t px-3 py-2 text-[10px] text-muted-foreground">
      <span className="inline-flex items-center gap-1.5 font-medium tabular-nums">
        {queryActive ? (
          <>
            <Search className="size-3" aria-hidden />
            {resultCount} {resultCount === 1 ? "result" : "results"}
          </>
        ) : (
          "Search snippets, collections, and tags"
        )}
      </span>
      <span className="ml-auto inline-flex flex-wrap items-center gap-x-3 gap-y-1">
        <Shortcut>
          <kbd className={kbdClass}>↑</kbd>
          <kbd className={kbdClass}>↓</kbd>
          <span className="ml-0.5">navigate</span>
        </Shortcut>
        <Shortcut>
          <kbd className={kbdClass}>↵</kbd>
          <span className="ml-0.5">open</span>
        </Shortcut>
        <Shortcut>
          <kbd className={kbdClass}>tab</kbd>
          <span className="ml-0.5">section</span>
        </Shortcut>
        <Shortcut>
          <kbd className={kbdClass}>esc</kbd>
          <span className="ml-0.5">close</span>
        </Shortcut>
      </span>
    </div>
  )
}

export { SearchFooter }
