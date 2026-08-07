"use client"

import * as React from "react"
import { useState } from "react"
import { ArrowUpDown, Check } from "lucide-react"

import { DashboardButton } from "@/features/dashboard/ui"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function SortMenu<T extends string>({
  sort,
  onChange,
  options,
  ariaLabel,
  title = "Sort by",
  separator = false,
  triggerClassName,
  labelClassName,
  iconClassName,
  panelClassName,
}: {
  sort: T
  onChange: (sort: T) => void
  options: { value: T; label: string }[]
  ariaLabel: string
  title?: string
  separator?: boolean
  triggerClassName?: string
  labelClassName?: string
  iconClassName?: string
  panelClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const currentLabel =
    options.find((option) => option.value === sort)?.label ??
    options[0].label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <DashboardButton
          variant="secondary"
          size="sm"
          aria-label={`${ariaLabel} by ${currentLabel}`}
          className={triggerClassName}
        >
          <ArrowUpDown className={cn("size-3.5", iconClassName)} />
          <span className={cn("truncate", labelClassName)}>{currentLabel}</span>
        </DashboardButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(
          "border-white/[0.08] bg-[#141f30] p-0 text-[#e8edf5] ring-white/[0.1]",
          panelClassName,
        )}
      >
        <PopoverTitle className="px-3 pt-3 text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
          {title}
        </PopoverTitle>
        {separator ? <Separator className="my-1 bg-white/[0.06]" /> : null}
        <div className="flex flex-col gap-0.5 p-1">
          {options.map((option) => {
            const selected = option.value === sort
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center justify-between rounded-[8px] px-2 py-1.5 text-sm transition-colors",
                  selected
                    ? "bg-[#2563eb]/15 font-medium text-[#f3f6fb]"
                    : "text-[#94a3b8] hover:bg-white/[0.05] hover:text-[#e8edf5]",
                )}
              >
                {option.label}
                {selected ? (
                  <Check className="size-3.5 text-[#7cb3ff]" />
                ) : null}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { SortMenu }
