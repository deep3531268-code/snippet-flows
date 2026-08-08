"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { SETTING_KEYS } from "../config"
import { useSettings } from "../hooks"

export function EditorSettings() {
  const { settings, loaded, updateSetting, resetSetting } = useSettings()
  const [pending, start] = useTransition()

  const wordWrap = settings?.editor.wordWrap ?? false

  const toggle = (enabled: boolean) => {
    start(async () => {
      try {
        await updateSetting(SETTING_KEYS.wordWrap, enabled)
        toast.success(enabled ? "Line wrapping enabled" : "Line wrapping disabled")
      } catch {
        toast.error("Failed to update line wrapping")
      }
    })
  }

  const reset = () => {
    start(async () => {
      try {
        await resetSetting(SETTING_KEYS.wordWrap)
        toast.success("Line wrapping reset to default")
      } catch {
        toast.error("Failed to reset line wrapping")
      }
    })
  }

  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <p className="text-sm font-medium">Wrap long lines</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Applies to the code editor when you create or edit a snippet.
        </p>
        {!wordWrap && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 h-auto p-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
            disabled={pending || !loaded}
            onClick={reset}
          >
            Reset to default
          </Button>
        )}
      </div>
      <Switch
        checked={wordWrap}
        disabled={pending || !loaded}
        onCheckedChange={toggle}
        aria-label="Wrap long lines"
      />
    </div>
  )
}
