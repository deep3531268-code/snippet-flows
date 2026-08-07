"use client"

import * as React from "react"
import { useTransition } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Loader2, Monitor, Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

function Preview({ resolvedTheme }: { resolvedTheme: string | undefined }) {
  const isDark = resolvedTheme === "dark"

  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-lg border transition-colors",
        isDark ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b px-3 py-2",
          isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-zinc-50",
        )}
      >
        <span className="flex gap-1">
          <span
            className={cn(
              "size-2 rounded-full",
              isDark ? "bg-zinc-700" : "bg-zinc-300",
            )}
          />
          <span
            className={cn(
              "size-2 rounded-full",
              isDark ? "bg-zinc-700" : "bg-zinc-300",
            )}
          />
          <span
            className={cn(
              "size-2 rounded-full",
              isDark ? "bg-zinc-700" : "bg-zinc-300",
            )}
          />
        </span>
        <span
          className={cn(
            "mx-auto h-3.5 w-40 rounded-full",
            isDark ? "bg-zinc-800" : "bg-zinc-200",
          )}
        />
      </div>
      <div className="flex gap-3 p-3">
        <div className="w-12 shrink-0 space-y-1.5">
          <div
            className={cn(
              "h-4 rounded-md",
              isDark ? "bg-zinc-800" : "bg-zinc-200",
            )}
          />
          <div
            className={cn(
              "h-3 rounded-full",
              isDark ? "bg-zinc-800/60" : "bg-zinc-100",
            )}
          />
          <div
            className={cn(
              "h-3 rounded-full",
              isDark ? "bg-zinc-800/60" : "bg-zinc-100",
            )}
          />
        </div>
        <div className="flex-1 space-y-1.5">
          <div
            className={cn(
              "h-2.5 w-1/3 rounded-full",
              isDark ? "bg-zinc-700" : "bg-zinc-300",
            )}
          />
          <div className="space-y-1">
            {[70, 100, 55, 85, 40].map((width, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-1.5",
                  isDark ? "text-zinc-500" : "text-zinc-400",
                )}
              >
                <span className="w-3 shrink-0 font-mono text-[8px] leading-3">
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "h-2 rounded-full",
                    isDark ? "bg-zinc-800" : "bg-zinc-100",
                  )}
                  style={{ width: `${width}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ThemeSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [pending, start] = useTransition()

  const select = (value: string) => {
    if (value === theme) return
    start(async () => {
      try {
        setTheme(value)
        toast.success(
          value === "system"
            ? "Using system theme"
            : `Theme set to ${value}`,
        )
      } catch {
        toast.error("Failed to update theme")
      }
    })
  }

  return (
    <div className="grid gap-4">
      <div
        role="radiogroup"
        aria-label="Theme"
        className="flex w-fit items-center gap-0.5 rounded-lg border bg-card p-1"
      >
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
          const active = theme === value
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={pending}
              onClick={() => select(value)}
              className={cn(
                "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                pending && "pointer-events-none opacity-70",
              )}
            >
              {active && (
                <motion.span
                  layoutId="theme-settings-pill"
                  className="absolute inset-0 rounded-md bg-muted"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative inline-flex items-center gap-1.5">
                {active && pending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Icon className="size-3.5" />
                )}
                {label}
              </span>
            </button>
          )
        })}
      </div>

      <Preview resolvedTheme={resolvedTheme} />

      <p className="text-xs text-muted-foreground">
        Your preference is saved automatically and applied across all pages.
      </p>
    </div>
  )
}
