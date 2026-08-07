"use client"

import * as React from "react"
import { useInView } from "framer-motion"
import {
  Code2,
  Database,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

type Statistic = {
  icon: LucideIcon
  value: string
  title: string
  description: string
}

const STATISTICS: Statistic[] = [
  {
    icon: Database,
    value: "100+",
    title: "Snippets Stored",
    description: "Keep reusable code organized in one place.",
  },
  {
    icon: Code2,
    value: "10+",
    title: "Languages",
    description: "Support for your favorite programming languages.",
  },
  {
    icon: Search,
    value: "<50ms",
    title: "Search",
    description: "Instantly find any snippet using powerful filters.",
  },
  {
    icon: ShieldCheck,
    value: "99.9%",
    title: "Secure Sharing",
    description: "Share snippets safely using controlled visibility.",
  },
]

function entranceDelay(delay: number) {
  return { animationDelay: `${delay}s`, animationFillMode: "both" } as const
}

function entrance(delay: number) {
  return {
    className: "animate-slide-up motion-reduce:animate-none",
    style: entranceDelay(delay),
  } as const
}

export function StatisticsSection() {
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      className="relative px-4 py-24 sm:px-6"
      aria-label="SnippetFlow statistics"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <p
            className={
              inView
                ? "animate-fade-in text-xs font-medium tracking-widest text-primary motion-reduce:animate-none"
                : "text-xs font-medium tracking-widest text-primary"
            }
          >
            SOCIAL PROOF
          </p>
          <h2
            className={`mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl ${
              inView ? entrance(0.05).className : ""
            }`}
            style={inView ? entrance(0.05).style : undefined}
          >
            Built for modern developers.
          </h2>
          <p
            className={`mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg ${
              inView ? entrance(0.15).className : ""
            }`}
            style={inView ? entrance(0.15).style : undefined}
          >
            SnippetFlow helps developers organize, search and share code faster
            with a clean, developer-first experience.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {STATISTICS.map((statistic, index) => {
            const Icon = statistic.icon
            const animated = inView ? entrance(0.25 + index * 0.08) : null
            return (
              <li
                key={statistic.title}
                className={animated ? animated.className : undefined}
                style={animated ? animated.style : undefined}
              >
                <div className="group h-full rounded-xl border border-border/60 bg-card/80 p-6 shadow-float backdrop-blur-md transition-all duration-300 supports-[backdrop-filter]:bg-card/60 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lifted">
                  <span className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-muted/60 p-2.5 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:border-primary/30 group-hover:text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <p className="mt-5 font-heading text-4xl font-semibold tracking-tight">
                    {statistic.value}
                  </p>
                  <h3 className="mt-2 text-sm font-medium text-foreground">
                    {statistic.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {statistic.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
