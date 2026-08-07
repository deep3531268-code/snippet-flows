"use client"

import * as React from "react"
import { useState } from "react"
import { RotateCcw } from "lucide-react"

import { DashboardButton } from "@/features/dashboard/ui"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function FilterMenu({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  trigger,
  ariaLabel,
  title,
  activeCount = 0,
  triggerClassName,
  panelClassName,
  children,
  onClear,
  clearLabel = "Clear filters",
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger: React.ReactNode
  ariaLabel: string
  title: string
  activeCount?: number
  triggerClassName?: string
  panelClassName?: string
  children: React.ReactNode
  onClear?: () => void
  clearLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const isControlled = openProp !== undefined
  const handleOpenChange = (next: boolean) => {
    if (isControlled) {
      onOpenChangeProp?.(next)
    } else {
      setOpen(next)
    }
  }

  return (
    <Popover
      open={isControlled ? openProp : open}
      onOpenChange={handleOpenChange}
    >
      <PopoverTrigger asChild>
        <DashboardButton
          variant="secondary"
          size="sm"
          aria-label={ariaLabel}
          className={triggerClassName}
        >
          {trigger}
          {activeCount > 0 ? (
            <span className="flex min-w-4 items-center justify-center rounded-full bg-[#2563eb] px-1 text-[10px] font-semibold text-white">
              {activeCount}
            </span>
          ) : null}
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
        {children}
        {onClear ? (
          <>
            <Separator className="bg-white/[0.06]" />
            <div className="p-1">
              <DashboardButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onClear()
                  handleOpenChange(false)
                }}
                className="w-full justify-start px-2 text-[#94a3b8]"
              >
                <RotateCcw className="size-3.5" />
                {clearLabel}
              </DashboardButton>
            </div>
          </>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export { FilterMenu }
