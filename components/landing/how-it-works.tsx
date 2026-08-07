"use client"

import * as React from "react"
import { useInView } from "framer-motion"
import { Save, Share2, Tags, type LucideIcon } from "lucide-react"

type Step = {
  number: string
  icon: LucideIcon
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: "01",
    icon: Save,
    title: "Save snippets",
    description:
      "Save code instantly from your editor or paste it directly into SnippetFlow.",
  },
  {
    number: "02",
    icon: Tags,
    title: "Organize using tags & collections",
    description:
      "Group related snippets and add smart tags to keep everything easy to find.",
  },
  {
    number: "03",
    icon: Share2,
    title: "Search and share instantly",
    description:
      "Find any snippet in milliseconds and share securely with a single link.",
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

export function HowItWorks() {
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      className="relative px-4 pb-24 sm:px-6"
      aria-label="How SnippetFlow works"
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
            HOW IT WORKS
          </p>
          <h2
            className={`mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl ${
              inView ? entrance(0.05).className : ""
            }`}
            style={inView ? entrance(0.05).style : undefined}
          >
            Get started in three steps.
          </h2>
          <p
            className={`mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg ${
              inView ? entrance(0.15).className : ""
            }`}
            style={inView ? entrance(0.15).style : undefined}
          >
            Capture, organize, and share your snippets with a workflow built for
            developers.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            const animated = inView ? entrance(0.25 + index * 0.08) : null
            return (
              <li
                key={step.number}
                className={animated ? animated.className : undefined}
                style={animated ? animated.style : undefined}
              >
                <div className="group relative h-full rounded-xl border border-border/60 bg-card/80 p-6 shadow-float backdrop-blur-md transition-all duration-300 supports-[backdrop-filter]:bg-card/60 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lifted">
                  <span className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-muted/60 p-2.5 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:border-primary/30 group-hover:text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-xs font-medium text-muted-foreground/50"
                    >
                      {step.number}
                    </span>
                  </span>
                  <h3 className="mt-5 text-sm font-medium text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
