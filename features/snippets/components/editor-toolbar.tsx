"use client"

import { Maximize2, Minimize2, WrapText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  SNIPPET_LANGUAGES,
  SNIPPET_LANGUAGE_LABELS,
  type SnippetLanguage,
} from "@/features/snippets/languages"
import { cn } from "@/lib/utils"

import { CopyButton, type EditorToolbarControls } from "./code-editor"

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd data-slot="kbd">{children}</kbd>
}

export function EditorToolbar({
  language,
  onLanguageChange,
  code,
  readOnly = false,
  selectId,
  className,
  isFullscreen,
  onToggleFullscreen,
  wrapEnabled,
  onToggleWrap,
}: {
  language: string
  onLanguageChange?: (language: string) => void
  code: string
  readOnly?: boolean
  selectId?: string
  className?: string
} & EditorToolbarControls) {
  const label = SNIPPET_LANGUAGE_LABELS[language as SnippetLanguage] ?? language

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 border-b border-input bg-muted/40 px-2 py-1.5",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-1">
          {readOnly ? (
            <Badge variant="secondary" className="font-mono text-xs">
              {label}
            </Badge>
          ) : (
            <select
              id={selectId}
              value={language}
              onChange={(event) => onLanguageChange?.(event.target.value)}
              aria-label="Language"
              className="h-7 max-w-full rounded-md border border-input bg-transparent px-2 text-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 [&>option]:bg-popover"
            >
              {SNIPPET_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {SNIPPET_LANGUAGE_LABELS[lang]}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Toggle word wrap"
                aria-pressed={wrapEnabled}
                onClick={onToggleWrap}
                className={cn(wrapEnabled && "bg-muted text-foreground")}
              >
                <WrapText className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Word wrap
              <Kbd>⌘⇧W</Kbd>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                aria-pressed={isFullscreen}
                onClick={onToggleFullscreen}
                className={cn(isFullscreen && "bg-muted text-foreground")}
              >
                {isFullscreen ? (
                  <Minimize2 className="size-3.5" />
                ) : (
                  <Maximize2 className="size-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              <Kbd>⌘⇧F</Kbd>
            </TooltipContent>
          </Tooltip>

          <CopyButton value={code} />
        </div>
      </div>
    </TooltipProvider>
  )
}
