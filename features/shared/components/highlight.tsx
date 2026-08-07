"use client"

import * as React from "react"
import { highlightParts } from "@/features/shared/query"

function Highlight({
  text,
  query,
  className,
}: {
  text: string
  query: string
  className?: string
}) {
  const parts = highlightParts(text ?? "", query)
  const hasMatch = parts.some((part) => part.match)

  if (!hasMatch) return <>{text}</>

  return (
    <>
      {parts.map((part, index) =>
        part.match ? (
          <mark
            key={index}
            className="rounded-[2px] bg-[#2563eb]/35 text-[#f3f6fb]"
          >
            {part.value}
          </mark>
        ) : (
          <span key={index} className={className}>
            {part.value}
          </span>
        ),
      )}
    </>
  )
}

export { Highlight }
