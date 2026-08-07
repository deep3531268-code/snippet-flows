"use client"

import * as React from "react"
import { useEffect, useState } from "react"

import { timeAgo, formatDate } from "@/features/shared/utils"

function RelativeTime({
  date,
  className,
}: {
  date: string
  className?: string
}) {
  const [mounted, setMounted] = useState(false)
  const [, setTick] = useState(0)

  useEffect(() => {
    setMounted(true)
    const timer = window.setInterval(() => setTick((value) => value + 1), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <time className={className} dateTime={date} title={formatDate(date)}>
        {formatDate(date)}
      </time>
    )
  }

  return (
    <time className={className} dateTime={date} title={formatDate(date)}>
      {timeAgo(date)}
    </time>
  )
}

export { RelativeTime }
