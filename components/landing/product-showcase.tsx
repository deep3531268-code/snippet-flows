"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import {
  Archive,
  Check,
  Clock,
  Eye,
  Folder,
  FolderTree,
  Globe,
  History,
  Layers,
  Search,
  Star,
  Tag,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/features/snippets/components/code-editor"
import { cn } from "@/lib/utils"

const HIGHLIGHTS = [
  "Instant Search",
  "Collections & Tags",
  "Secure Sharing",
  "Multi-language Support",
]

const SIDEBAR_ITEMS = [
  { icon: Layers, label: "Workspace" },
  { icon: Star, label: "Favorites" },
  { icon: FolderTree, label: "Collections" },
  { icon: History, label: "Recent" },
  { icon: Archive, label: "Archived" },
]

const SNIPPETS = [
  {
    name: "React Hook",
    language: "TSX",
    updated: "2h ago",
    favorite: true,
    active: true,
  },
  {
    name: "Next.js Middleware",
    language: "TS",
    updated: "5h ago",
    favorite: false,
    active: false,
  },
  {
    name: "Prisma Query",
    language: "PRISMA",
    updated: "1d ago",
    favorite: true,
    active: false,
  },
  {
    name: "Tailwind Button",
    language: "CSS",
    updated: "2d ago",
    favorite: false,
    active: false,
  },
  {
    name: "Auth Helper",
    language: "TS",
    updated: "3d ago",
    favorite: false,
    active: false,
  },
]

const METADATA = [
  { label: "Language", value: "TypeScript" },
  { label: "Tags", value: ["React", "Next.js", "Database"] },
  { label: "Visibility", value: "Public" },
  { label: "Favorite", value: "Enabled" },
  { label: "Updated", value: "2 hours ago" },
]

const Tok = ({
  type,
  children,
}: {
  type: "kw" | "ty" | "fn" | "prop" | "str" | "attr" | "val"
  children: React.ReactNode
}) => (
  <span
    className={cn(
      type === "kw" && "text-violet-600 dark:text-violet-400",
      type === "ty" && "text-sky-600 dark:text-sky-400",
      type === "fn" && "text-cyan-600 dark:text-cyan-400",
      type === "prop" && "text-zinc-800 dark:text-zinc-200",
      type === "str" && "text-emerald-600 dark:text-emerald-400",
      type === "attr" && "text-rose-500 dark:text-rose-400",
      type === "val" && "text-amber-600 dark:text-amber-400",
    )}
  >
    {children}
  </span>
)

const CODE_LINES: React.ReactNode[] = [
  <>
    <Tok type="kw">export</Tok> <Tok type="kw">async</Tok>{" "}
    <Tok type="kw">function</Tok> <Tok type="fn">createSnippet</Tok>(
    <Tok type="prop">data</Tok>) {"{"}
  </>,
  <>
    {"  "}
    <Tok type="kw">return</Tok> <Tok type="prop">prisma</Tok>.
    <Tok type="prop">snippet</Tok>.<Tok type="fn">create</Tok>({"{"}
  </>,
  <>
    {"    "}
    <Tok type="prop">data</Tok>,
  </>,
  <>
    {"  })"}
  </>,
  <>{""}</>,
]

const ACTIVE_LINE = 1

function entranceDelay(delay: number) {
  return { animationDelay: `${delay}s`, animationFillMode: "both" } as const
}

function entrance(delay: number) {
  return {
    className: "animate-slide-up motion-reduce:animate-none",
    style: entranceDelay(delay),
  } as const
}

export function ProductShowcase() {
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      className="relative px-4 pb-24 sm:px-6"
      aria-label="Product showcase"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p
            className={
              inView
                ? "animate-fade-in text-xs font-medium tracking-widest text-primary motion-reduce:animate-none"
                : "text-xs font-medium tracking-widest text-primary"
            }
          >
            PRODUCT
          </p>
          <h2
            className={`mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl ${
              inView ? entrance(0.05).className : ""
            }`}
            style={inView ? entrance(0.05).style : undefined}
          >
            See SnippetFlow in action.
          </h2>
          <p
            className={`mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg ${
              inView ? entrance(0.15).className : ""
            }`}
            style={inView ? entrance(0.15).style : undefined}
          >
            Organize, search, and share every snippet from one clean workspace
            built for developers.
          </p>

          <ul
            className={`mt-8 flex w-full max-w-md flex-col gap-3 ${
              inView ? entrance(0.25).className : ""
            }`}
            style={inView ? entrance(0.25).style : undefined}
          >
            {HIGHLIGHTS.map((highlight, index) => {
              const animated = inView
                ? entrance(0.3 + index * 0.08)
                : null
              return (
                <li
                  key={highlight}
                  className={animated ? animated.className : undefined}
                  style={animated ? animated.style : undefined}
                >
                  <span className="group inline-flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-muted/60">
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                      <Check className="size-3" aria-hidden />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {highlight}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>

          <div
            className={`mt-8 flex flex-col items-center gap-3 sm:flex-row ${
              inView ? entrance(0.6).className : ""
            }`}
            style={inView ? entrance(0.6).style : undefined}
          >
            <Button
              asChild
              size="lg"
              className="w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted active:translate-y-0 sm:w-auto"
            >
              <a href="/auth/sign-up">Try it free</a>
            </Button>
          </div>
        </div>

        <div
          className={`relative mx-auto w-full max-w-xl lg:max-w-none ${
            inView ? entrance(0.35).className : ""
          }`}
          style={inView ? entrance(0.35).style : undefined}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl bg-primary/10 blur-xl"
          />
          <div className="overflow-hidden rounded-xl border bg-card/80 shadow-float backdrop-blur-md transition-all duration-300 supports-[backdrop-filter]:bg-card/60 hover:-translate-y-1 hover:shadow-lifted">
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-3 py-2">
              <div
                className="flex shrink-0 gap-1.5 transition-transform duration-200 hover:scale-105"
                aria-hidden
              >
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="min-w-0 flex-1 truncate text-center text-xs text-muted-foreground">
                SnippetFlow — Workspace
              </span>
              <span
                className="hidden items-center gap-1.5 rounded-full border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground sm:inline-flex"
                aria-hidden
              >
                <Globe className="size-3" />
                Public
              </span>
            </div>

            <div className="flex h-[440px]">
              <aside
                className="hidden w-[15%] shrink-0 flex-col gap-0.5 overflow-hidden border-r border-border/60 bg-muted/20 p-2 sm:flex"
                aria-label="Workspace navigation"
              >
                <div className="mb-2 flex items-center gap-1.5 px-2 pt-1">
                  <span className="flex size-5 items-center justify-center rounded bg-foreground text-background">
                    <Layers className="size-3" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold tracking-tight">
                    Workspace
                  </span>
                </div>
                {SIDEBAR_ITEMS.map((item) => {
                  const Icon = item.icon
                  const active = item.label === "Workspace"
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className={cn(
                        "flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors duration-200 hover:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                        active
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="size-3.5 shrink-0" aria-hidden />
                      <span className="truncate">{item.label}</span>
                    </button>
                  )
                })}
              </aside>

              <div className="flex w-[35%] shrink-0 flex-col overflow-hidden border-r border-border/60 sm:w-[25%]">
                <div className="border-b border-border/60 p-2">
                  <div className="flex items-center gap-2 rounded-md border border-border/60 bg-background/60 px-2.5 py-1.5">
                    <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="text-xs text-muted-foreground">
                      Search snippets...
                    </span>
                  </div>
                </div>
                <ul className="flex-1 space-y-1 overflow-auto p-2">
                  {SNIPPETS.map((snippet) => (
                    <li key={snippet.name}>
                      <button
                        type="button"
                        className={cn(
                          "group flex w-full flex-col gap-1 rounded-md px-2 py-2 text-left transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                          snippet.active
                            ? "bg-muted/70"
                            : "hover:bg-muted/50",
                        )}
                      >
                        <span className="flex items-center justify-between gap-1">
                          <span className="truncate text-xs font-medium text-foreground">
                            {snippet.name}
                          </span>
                          <Star
                            aria-hidden
                            className={cn(
                              "size-3 shrink-0 transition-all duration-200",
                              snippet.favorite
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/50 group-hover:scale-110 group-hover:text-muted-foreground",
                            )}
                          />
                        </span>
                        <span className="flex items-center justify-between gap-1">
                          <Badge
                            variant="secondary"
                            className="rounded px-1 py-0 text-[9px] font-medium tracking-wide"
                          >
                            {snippet.language}
                          </Badge>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                            <Clock className="size-2.5" aria-hidden />
                            {snippet.updated}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
                  <span className="truncate text-xs font-medium text-foreground">
                    createSnippet.ts
                  </span>
                  <Badge
                    variant="secondary"
                    className="shrink-0 rounded px-1 py-0 text-[9px] font-medium tracking-wide"
                  >
                    TS
                  </Badge>
                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="hidden lg:inline-flex"
                      aria-label="Favorite snippet"
                    >
                      <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
                    </Button>
                    <CopyButton value="export async function createSnippet(data) { return prisma.snippet.create({ data }) }" size="icon-sm" />
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto bg-background/60">
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="min-w-fit py-3 pr-4 font-mono text-[12px] leading-6"
                  >
                    {CODE_LINES.map((line, index) => {
                      const active = index === ACTIVE_LINE
                      return (
                        <div
                          key={index}
                          className={cn(
                            "flex whitespace-pre",
                            active && "bg-muted/60",
                          )}
                        >
                          <span
                            className={cn(
                              "w-12 shrink-0 pr-4 pl-4 text-right select-none",
                              active
                                ? "text-foreground/80"
                                : "text-muted-foreground/50",
                            )}
                          >
                            {index + 1}
                          </span>
                          <span className="text-zinc-700 dark:text-zinc-300">
                            {line}
                          </span>
                          {active && (
                            <motion.span
                              aria-hidden
                              className="ml-1 inline-block h-[1.1em] w-[2px] self-center bg-foreground/80"
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.1,
                                ease: "easeInOut",
                              }}
                            />
                          )}
                        </div>
                      )
                    })}
                  </motion.div>
                </div>
              </div>

              <aside
                className="hidden w-[20%] shrink-0 flex-col gap-3 overflow-hidden border-l border-border/60 bg-muted/20 p-3 lg:flex"
                aria-label="Snippet metadata"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium tracking-widest text-muted-foreground">
                    DETAILS
                  </span>
                  <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
                </div>
                <dl className="flex flex-col gap-3">
                  {METADATA.map((item) => (
                    <div key={item.label}>
                      <dt className="text-[10px] tracking-wide text-muted-foreground/70">
                        {item.label}
                      </dt>
                      <dd className="mt-0.5">
                        {Array.isArray(item.value) ? (
                          <div className="flex flex-wrap gap-1">
                            {item.value.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-1.5 py-0.5 text-[10px] text-foreground"
                              >
                                <Tag className="size-2.5 text-muted-foreground" aria-hidden />
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                            {item.label === "Visibility" && (
                              <Eye className="size-3 text-muted-foreground" aria-hidden />
                            )}
                            {item.label === "Updated" && (
                              <Clock className="size-3 text-muted-foreground" aria-hidden />
                            )}
                            {item.label === "Language" && (
                              <Folder className="size-3 text-muted-foreground" aria-hidden />
                            )}
                            {item.label === "Favorite" && (
                              <Check className="size-3 text-muted-foreground" aria-hidden />
                            )}
                            {item.value}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
