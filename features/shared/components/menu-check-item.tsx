"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

function MenuCheckItem({
  selected,
  label,
  onClick,
}: {
  selected: boolean
  label: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-[8px] px-2 py-1.5 text-sm transition-colors",
        selected
          ? "bg-[#2563eb]/15 font-medium text-[#f3f6fb]"
          : "text-[#94a3b8] hover:bg-white/[0.05] hover:text-[#e8edf5]",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">{label}</span>
      {selected ? <Check className="size-3.5 shrink-0 text-[#7cb3ff]" /> : null}
    </button>
  )
}

export { MenuCheckItem }
