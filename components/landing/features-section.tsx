"use client"

import * as React from "react"
import { useInView } from "framer-motion"
import {
  FolderTree,
  Globe,
  History,
  Search,
  Star,
  Tags,
  type LucideIcon,
} from "lucide-react"

type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: FolderTree,
    title: "Collections",
    description: "Group related snippets into organized collections.",
  },
  {
    icon: Tags,
    title: "Smart Tags",
    description: "Categorize snippets for faster organization.",
  },
  {
    icon: Search,
    title: "Instant Search",
    description: "Find any snippet in milliseconds.",
  },
  {
    icon: Globe,
    title: "Public Sharing",
    description: "Share snippets securely with a single link.",
  },
  {
    icon: Star,
    title: "Favorites",
    description: "Pin your most frequently used snippets.",
  },
  {
    icon: History,
    title: "Version History",
    description: "Track edits and restore previous versions.",
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

export function FeaturesSection() {
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      className="relative px-4 pb-24 sm:px-6"
      aria-label="SnippetFlow features"
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
            FEATURES
          </p>
          <h2
            className={`mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl ${
              inView ? entrance(0.05).className : ""
            }`}
            style={inView ? entrance(0.05).style : undefined}
          >
            Everything you need to manage code snippets.
          </h2>
          <p
            className={`mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg ${
              inView ? entrance(0.15).className : ""
            }`}
            style={inView ? entrance(0.15).style : undefined}
          >
            SnippetFlow helps developers capture, organize, search and share
            snippets with a fast, modern workflow.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            const animated = inView ? entrance(0.25 + index * 0.08) : null
            return (
              <li
                key={feature.title}
                className={animated ? animated.className : undefined}
                style={animated ? animated.style : undefined}
              >
                <div className="group h-full rounded-xl border border-border/60 bg-card/80 p-6 shadow-float backdrop-blur-md transition-all duration-300 supports-[backdrop-filter]:bg-card/60 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lifted">
                  <span className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-muted/60 p-2.5 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:border-primary/30 group-hover:text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-sm font-medium text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
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
