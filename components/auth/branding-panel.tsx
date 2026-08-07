"use client"

import * as React from "react"
import Link from "next/link"
import {
  Braces,
  Check,
  Clock,
  FileCode2,
  FolderGit2,
  Sparkles,
  Star,
  Tags,
} from "lucide-react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"

import { cn } from "@/lib/utils"

const FEATURE_BULLETS = [
  "Organize every snippet with tags and collections",
  "Find any snippet in milliseconds with instant search",
  "Share code securely with controlled visibility",
]

const KW = "text-violet-600 dark:text-violet-400"
const FN = "text-cyan-600 dark:text-cyan-400"
const ST = "text-emerald-600 dark:text-emerald-400"
const PL = "text-zinc-800 dark:text-zinc-200"

const CARD_CLASS =
  "rounded-xl border border-border/60 bg-card/80 shadow-float backdrop-blur-xl supports-[backdrop-filter]:bg-card/60"

const AURORAS = [
  {
    className: "left-[-20%] top-[-30%] h-72 w-80 bg-primary/10",
    duration: 22,
    drift: 18,
  },
  {
    className: "right-[-25%] top-[15%] h-64 w-72 bg-sky-500/10",
    duration: 26,
    drift: -16,
  },
  {
    className: "bottom-[-35%] left-[20%] h-72 w-80 bg-violet-500/10",
    duration: 24,
    drift: 14,
  },
  {
    className: "right-[-10%] top-[30%] h-80 w-80 bg-primary/10",
    duration: 20,
    drift: 14,
  },
]

const ORBS = [
  {
    className: "left-[10%] top-[20%] h-32 w-32 bg-primary/10",
    duration: 18,
    travel: 10,
  },
  {
    className: "right-[15%] top-[35%] h-24 w-24 bg-sky-400/10",
    duration: 16,
    travel: 8,
  },
  {
    className: "left-[45%] bottom-[18%] h-36 w-36 bg-violet-400/10",
    duration: 20,
    travel: 12,
  },
]

const TAGS = ["React", "Next.js", "Database", "API"]

const COLLECTIONS = [
  { name: "Frontend", count: 12 },
  { name: "Backend", count: 8 },
  { name: "Utilities", count: 6 },
  { name: "Archived", count: 3 },
]

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

function FloatCard({
  className,
  duration,
  travel,
  delay,
  children,
}: {
  className?: string
  duration: number
  travel: number
  delay: number
  children: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={cn("animate-fade-in motion-reduce:animate-none", className)}
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      <motion.div
        className="h-full w-full"
        animate={reduceMotion ? undefined : { y: [0, travel, 0] }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "easeInOut",
          delay,
        }}
      >
        <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

function TypeScriptBadge() {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5">
      <span className="flex size-3.5 items-center justify-center rounded bg-sky-500/15 font-mono text-[8px] font-bold text-sky-600 dark:text-sky-400">
        TS
      </span>
      <span className="text-[9px] font-medium text-muted-foreground">
        TypeScript
      </span>
    </span>
  )
}

export function BrandingPanel({
  badge = "Welcome back",
  heading = "Your snippets, right where you left them.",
  description = "Sign in to access your library, collections, and shared snippets.",
  bullets = FEATURE_BULLETS,
}: {
  badge?: string
  heading?: string
  description?: string
  bullets?: string[]
}) {
  const reduceMotion = useReducedMotion()

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const parallaxX = useSpring(pointerX, { stiffness: 40, damping: 20 })
  const parallaxY = useSpring(pointerY, { stiffness: 40, damping: 20 })
  const backgroundX = useTransform(parallaxX, (value) => value * 8)
  const backgroundY = useTransform(parallaxY, (value) => value * 6)
  const cardsX = useTransform(parallaxX, (value) => value * 10)
  const cardsY = useTransform(parallaxY, (value) => value * 8)

  React.useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches
    if (!finePointer) return

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5
      const y = event.clientY / window.innerHeight - 0.5
      pointerX.set(x)
      pointerY.set(y)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", onPointerMove)
  }, [pointerX, pointerY])

  return (
    <aside className="relative hidden overflow-hidden border-r border-border/60 lg:flex lg:flex-col lg:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-transparent"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-background" />

        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:52px_52px] opacity-[0.04]"
          style={{
            maskImage:
              "radial-gradient(ellipse 90% 70% at 50% 35%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 70% at 50% 35%, black, transparent)",
          }}
        />

        <motion.div
          className="absolute inset-0"
          style={{ x: backgroundX, y: backgroundY }}
        >
          {AURORAS.map((aurora, index) => (
            <motion.div
              key={`aurora-${index}`}
              className={`absolute rounded-full blur-3xl ${aurora.className}`}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: [0, aurora.drift, 0],
                      y: [0, aurora.drift * 0.6, 0],
                    }
              }
              transition={{
                repeat: Infinity,
                duration: aurora.duration,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={{ x: backgroundX, y: backgroundY }}
        >
          {ORBS.map((orb, index) => (
            <motion.div
              key={`orb-${index}`}
              className={`absolute rounded-full blur-2xl ${orb.className}`}
              animate={
                reduceMotion ? undefined : { y: [0, orb.travel, 0] }
              }
              transition={{
                repeat: Infinity,
                duration: orb.duration,
                ease: "easeInOut",
                delay: index * 0.8,
              }}
            />
          ))}
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,var(--primary)_0%,transparent_70%)] opacity-[0.06]" />

        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: NOISE }}
        />
      </div>

      <div className="relative flex flex-1 flex-col justify-between gap-10">
        <div className="relative">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-md transition-opacity duration-200 hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            aria-label="SnippetFlow home"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background transition-transform duration-200 group-hover:scale-105">
              <Braces className="size-4" aria-hidden />
            </span>
            <span className="font-heading text-sm font-semibold tracking-tight">
              SnippetFlow
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between gap-8 lg:gap-16">
          <div className="relative max-w-md">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-primary" aria-hidden />
              {badge}
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight">
              {heading}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                    <Check className="size-3" aria-hidden />
                  </span>
                  <span className="text-sm text-foreground">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            aria-hidden
            className="relative flex h-[26rem] w-[38%] shrink-0 flex-col items-center"
            style={{ x: cardsX, y: cardsY }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,var(--primary)_0%,transparent_70%)] opacity-[0.06]" />

            <FloatCard
              className="-rotate-1"
              duration={11}
              travel={8}
              delay={0.25}
            >
              <div className={cn(CARD_CLASS, "w-48 p-3")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[10px] font-medium text-foreground">
                      <FileCode2 className="size-3 shrink-0 text-primary" aria-hidden />
                      useLocalStorage
                    </p>
                    <p className="mt-1 truncate font-mono text-[9px] text-muted-foreground">
                      export function useLocalStorage...
                    </p>
                  </div>
                  <Star
                    className="size-3.5 shrink-0 fill-current text-primary/70"
                    aria-hidden
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <TypeScriptBadge />
                  <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <Clock className="size-2.5" aria-hidden />
                    Updated 2h ago
                  </span>
                </div>
              </div>
            </FloatCard>

            <div className="flex flex-1 items-center">
              <FloatCard
                className="z-10"
                duration={14}
                travel={10}
                delay={0.45}
              >
                <div className={cn(CARD_CLASS, "w-56")}>
                  <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-3 py-2">
                    <span className="flex shrink-0 gap-1.5" aria-hidden>
                      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="size-2.5 rounded-full bg-[#febc2e]" />
                      <span className="size-2.5 rounded-full bg-[#28c840]" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-muted-foreground">
                      useSnippetSearch.ts
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-muted-foreground">
                      <span className="flex size-3.5 items-center justify-center rounded bg-sky-500/15 font-mono text-[8px] font-bold text-sky-600 dark:text-sky-400">
                        TS
                      </span>
                      TypeScript
                    </span>
                  </div>
                  <div className="p-3.5 font-mono text-[9px] leading-5 text-zinc-700 dark:text-zinc-300">
                    <div className="whitespace-pre">
                      <span className={KW}>import</span> {"{"}{" "}
                      <span className={FN}>useState</span>{" "}
                      {"}"} <span className={KW}>from</span>{" "}
                      <span className={ST}>&quot;react&quot;</span>
                    </div>
                    <div className="whitespace-pre">{" "}</div>
                    <div className="whitespace-pre">
                      <span className={KW}>export</span>{" "}
                      <span className={KW}>function</span>{" "}
                      <span className={FN}>useSearch</span>(
                      <span className={PL}>items</span>){" "}
                      {"{"}
                    </div>
                    <div className="whitespace-pre">
                      {"  "}<span className={KW}>const</span> [
                      <span className={PL}>query</span>,{" "}
                      <span className={PL}>set</span>] ={" "}
                      <span className={FN}>useState</span>(
                      <span className={ST}>&quot;&quot;</span>)
                    </div>
                    <div className="whitespace-pre">{" "}</div>
                    <div className="whitespace-pre">
                      {"  "}<span className={KW}>return</span>{" "}
                      <span className={PL}>items</span>.
                      <span className={FN}>filter</span>((
                      <span className={PL}>item</span>){" "}
                      {"=>"}
                    </div>
                    <div className="whitespace-pre">
                      {"    "}<span className={PL}>item</span>.
                      <span className={PL}>title</span>.
                      <span className={FN}>includes</span>(
                      <span className={PL}>query</span>),
                    </div>
                    <div className="whitespace-pre">{"  "})</div>
                    <div className="whitespace-pre">{"}"}</div>
                  </div>
                </div>
              </FloatCard>
            </div>

            <div className="flex w-full items-end justify-between">
              <FloatCard
                className="rotate-1"
                duration={16}
                travel={6}
                delay={0.6}
              >
                <div className={cn(CARD_CLASS, "w-40 p-3")}>
                  <p className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                    <Tags className="size-3 text-primary" aria-hidden />
                    Tags
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {TAGS.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[9px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FloatCard>

              <FloatCard
                className="-rotate-1"
                duration={13}
                travel={8}
                delay={0.75}
              >
                <div className={cn(CARD_CLASS, "w-44 p-3")}>
                  <p className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                    <FolderGit2 className="size-3 text-primary" aria-hidden />
                    Collections
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {COLLECTIONS.map((collection) => (
                      <div
                        key={collection.name}
                        className="flex items-center justify-between text-[10px] text-zinc-700 dark:text-zinc-300"
                      >
                        <span className="flex items-center gap-1.5">
                          <span
                            className="size-1.5 rounded-full bg-primary/40"
                            aria-hidden
                          />
                          {collection.name}
                        </span>
                        <span className="text-muted-foreground">
                          {collection.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FloatCard>
            </div>
          </motion.div>
        </div>

        <p className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} SnippetFlow. All rights reserved.
        </p>
      </div>
    </aside>
  )
}
