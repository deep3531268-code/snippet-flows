"use client"

import * as React from "react"
import { useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GithubIcon } from "@/components/landing/github-icon"

function entranceDelay(delay: number) {
  return { animationDelay: `${delay}s`, animationFillMode: "both" } as const
}

function entrance(delay: number) {
  return {
    className: "animate-slide-up motion-reduce:animate-none",
    style: entranceDelay(delay),
  } as const
}

export function Cta() {
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      className="relative px-4 pb-24 sm:px-6"
      aria-label="Get started"
    >
      <div
        className={`relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-border/60 bg-card/80 px-6 py-16 shadow-float backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 sm:px-16 ${
          inView ? entrance(0.25).className : ""
        }`}
        style={inView ? entrance(0.25).style : undefined}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="flex flex-col items-center text-center">
          <h2
            className={`max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl ${
              inView ? entrance(0.35).className : ""
            }`}
            style={inView ? entrance(0.35).style : undefined}
          >
            Start building your snippet library today.
          </h2>
          <p
            className={`mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg ${
              inView ? entrance(0.45).className : ""
            }`}
            style={inView ? entrance(0.45).style : undefined}
          >
            Organize, search, and share every snippet from one clean workspace.
            Free to get started.
          </p>
          <div
            className={`mt-8 flex flex-col items-center gap-3 sm:flex-row ${
              inView ? entrance(0.55).className : ""
            }`}
            style={inView ? entrance(0.55).style : undefined}
          >
            <Button
              asChild
              size="lg"
              className="w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted active:translate-y-0 sm:w-auto"
            >
              <a href="/auth/sign-up">
                Get Started
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/40 active:translate-y-0 sm:w-auto"
            >
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <GithubIcon className="size-4 transition-transform duration-300 group-hover/button:scale-105" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
