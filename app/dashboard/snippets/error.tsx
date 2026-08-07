"use client"

import * as React from "react"
import { TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/features/shared/motion"

export default function SnippetsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:py-10">
      <FadeIn className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card/50 px-6 py-16 text-center">
        <div className="flex size-11 items-center justify-center rounded-xl border bg-destructive/10 text-destructive">
          <TriangleAlert className="size-5" />
        </div>
        <div className="grid gap-1">
          <p className="font-medium">Couldn&apos;t load snippets</p>
          <p className="text-sm text-muted-foreground">
            Something went wrong while fetching your snippets. Try again.
          </p>
        </div>
        <Button className="mt-1" onClick={reset}>
          Try again
        </Button>
      </FadeIn>
    </div>
  )
}
