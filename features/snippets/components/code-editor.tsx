"use client"

import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { createHighlighter, type Highlighter } from "shiki"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  SNIPPET_LANGUAGES,
  SNIPPET_LANGUAGE_LABELS,
  type SnippetLanguage,
} from "@/features/snippets/languages"
import { cn } from "@/lib/utils"

const SUPPORTED_LANGUAGES = new Set<string>(SNIPPET_LANGUAGES)

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    langs: [...SNIPPET_LANGUAGES],
    themes: ["github-light", "github-dark"],
  })
  return highlighterPromise
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]!,
  )
}

function innerCodeHtml(html: string) {
  const start = html.indexOf(">") + 1
  const end = html.lastIndexOf("</pre>")
  return html.slice(start, end)
}

export function useCopy(delay = 1500) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), delay)
      } catch {
        // Clipboard unavailable in this context; ignore.
      }
    },
    [delay],
  )

  return { copied, copy }
}

export function CopyButton({
  value,
  size = "sm",
  className,
}: {
  value: string
  size?: "sm" | "icon-sm"
  className?: string
}) {
  const { copied, copy } = useCopy()

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      disabled={!value}
      onClick={() => copy(value)}
      aria-label="Copy code"
      className={className}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="inline-flex items-center gap-1 text-emerald-500"
          >
            <Check className="size-3.5" />
            {size === "sm" && (
              <span className="hidden sm:inline">Copied</span>
            )}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="inline-flex items-center gap-1"
          >
            <Copy className="size-3.5" />
            {size === "sm" && <span className="hidden sm:inline">Copy</span>}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}

function useHighlightedCode(value: string, language: string) {
  const { resolvedTheme } = useTheme()
  const [html, setHtml] = useState("")
  const [ready, setReady] = useState(false)

  const isDark =
    resolvedTheme === "dark" ||
    (typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"))

  useEffect(() => {
    if (!value) return

    let active = true

    getHighlighter()
      .then((highlighter) => {
        if (!active) return
        if (SUPPORTED_LANGUAGES.has(language)) {
          const raw = highlighter.codeToHtml(value, {
            lang: language,
            theme: isDark ? "github-dark" : "github-light",
          })
          setHtml(innerCodeHtml(raw))
        } else {
          setHtml(
            `<span style="color:var(--muted-foreground)">${escapeHtml(value)}</span>`,
          )
        }
        setReady(true)
      })
      .catch(() => {
        if (!active) return
        setHtml(
          `<span style="color:var(--muted-foreground)">${escapeHtml(value)}</span>`,
        )
        setReady(true)
      })

    return () => {
      active = false
    }
  }, [value, language, isDark])

  return { html, ready }
}

export type EditorToolbarControls = {
  isFullscreen: boolean
  onToggleFullscreen: () => void
  wrapEnabled: boolean
  onToggleWrap: () => void
}

export function CodeEditor({
  value,
  onChange,
  language = "plaintext",
  readOnly = false,
  name,
  placeholder,
  minHeight = "min-h-52",
  autoResize = true,
  maxHeightClass = "max-h-[min(32rem,70vh)]",
  toolbar,
  className,
}: {
  value: string
  onChange?: (value: string) => void
  language?: string
  readOnly?: boolean
  name?: string
  placeholder?: string
  minHeight?: string
  autoResize?: boolean
  maxHeightClass?: string
  toolbar?: (controls: EditorToolbarControls) => React.ReactNode
  className?: string
}) {
  const { html, ready } = useHighlightedCode(value, language)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wrapEnabled, setWrapEnabled] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const lineNumbers = useMemo(() => {
    const count = Math.max(1, value.split("\n").length)
    return Array.from({ length: count }, (_, index) => index + 1).join("\n")
  }, [value])

  const languageLabel =
    SNIPPET_LANGUAGE_LABELS[language as SnippetLanguage] ?? language

  const resize = useCallback(() => {
    const textarea = textareaRef.current
    const row = rowRef.current
    if (!textarea || !row) return

    if (isFullscreen) {
      row.style.height = ""
      return
    }

    if (!autoResize) {
      row.style.height = ""
      return
    }

    textarea.style.height = "auto"
    const max = parseFloat(getComputedStyle(row).maxHeight) || Infinity
    row.style.height = `${Math.min(textarea.scrollHeight, max)}px`
    textarea.style.height = ""
  }, [isFullscreen, autoResize])

  useEffect(() => {
    resize()
  }, [resize, value, wrapEnabled])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        event.preventDefault()
        event.stopPropagation()
        setIsFullscreen(false)
        return
      }

      const target = event.target as HTMLElement | null
      if (!rootRef.current?.contains(target)) return

      const mod = event.metaKey || event.ctrlKey
      if (!mod || !event.shiftKey) return

      const key = event.key.toLowerCase()
      if (key === "f") {
        event.preventDefault()
        setIsFullscreen((value) => !value)
      } else if (key === "w") {
        event.preventDefault()
        setWrapEnabled((value) => !value)
      }
    }

    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [isFullscreen])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event.target.value)
    },
    [onChange],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Tab" || readOnly) return
      event.preventDefault()
      const el = event.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      onChange?.(`${value.slice(0, start)}  ${value.slice(end)}`)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2
      })
    },
    [readOnly, value, onChange],
  )

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLTextAreaElement>) => {
      const { scrollTop, scrollLeft } = event.currentTarget
      if (preRef.current) {
        preRef.current.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`
      }
      if (gutterRef.current) {
        gutterRef.current.style.transform = `translateY(${-scrollTop}px)`
      }
    },
    [],
  )

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Code editor"
      className={cn(
        "group/editor overflow-hidden rounded-lg border border-input bg-card transition-colors focus-within:border-ring/60 focus-within:ring-2 focus-within:ring-ring/25",
        isFullscreen &&
          "fixed inset-0 z-[60] flex flex-col rounded-none border-0 bg-background ring-0",
        className,
      )}
    >
      {toolbar?.({
        isFullscreen,
        onToggleFullscreen: () => setIsFullscreen((value) => !value),
        wrapEnabled,
        onToggleWrap: () => setWrapEnabled((value) => !value),
      })}

      <div
        ref={rowRef}
        className={cn(
          "relative flex",
          isFullscreen ? "flex-1" : cn(minHeight, maxHeightClass),
        )}
      >
        <div
          aria-hidden
          className="hidden shrink-0 select-none overflow-hidden border-r border-border/60 px-2.5 py-3 text-right font-mono text-sm leading-5 text-muted-foreground/50 sm:block"
        >
          <div ref={gutterRef} className="whitespace-pre">
            {lineNumbers}
          </div>
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          {value !== "" && (
            <>
              {ready && html ? (
                <pre
                  ref={preRef}
                  aria-hidden
                  className={cn(
                    "shiki pointer-events-none absolute inset-0 m-0 overflow-hidden p-3 font-mono text-sm leading-5 [background:transparent]",
                    wrapEnabled
                      ? "whitespace-pre-wrap break-words"
                      : "whitespace-pre [tab-size:2]",
                  )}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 animate-pulse-soft p-3 font-mono text-sm leading-5 text-muted-foreground/50"
                >
                  Loading…
                </div>
              )}
            </>
          )}

          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            readOnly={readOnly}
            aria-label={readOnly ? "Code preview" : "Code editor"}
            aria-multiline="true"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            placeholder={placeholder}
            wrap={wrapEnabled ? "soft" : "off"}
            className={cn(
              "absolute inset-0 resize-none overflow-auto bg-transparent p-3 font-mono text-sm leading-5 text-transparent caret-foreground outline-none selection:bg-primary/25 placeholder:text-muted-foreground",
              wrapEnabled
                ? "whitespace-pre-wrap break-words"
                : "whitespace-pre [tab-size:2]",
            )}
          />

          {readOnly && (
            <>
              <CopyButton
                value={value}
                size="icon-sm"
                className="absolute top-2 right-2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/editor:opacity-100"
              />
              <Badge
                variant="secondary"
                className="pointer-events-none absolute right-2 bottom-2 font-mono text-[0.65rem] opacity-0 transition-opacity group-hover/editor:opacity-100"
              >
                {languageLabel}
              </Badge>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
