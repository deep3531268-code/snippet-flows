"use client"

import * as React from "react"
import { useInView } from "framer-motion"
import { Quote } from "lucide-react"

type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
  initials: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "SnippetFlow replaced my messy notes folder. Search is so fast I stopped bookmarking code altogether.",
    name: "Alex Rivera",
    role: "Staff Engineer",
    company: "Northwind",
    initials: "AR",
  },
  {
    quote:
      "Collections and smart tags finally keep my snippets organized without me having to think about it.",
    name: "Priya Sharma",
    role: "Frontend Lead",
    company: "Lumen Labs",
    initials: "PS",
  },
  {
    quote:
      "Sharing a snippet with a teammate takes seconds, and I know exactly who can see what.",
    name: "Marcus Chen",
    role: "Full-stack Developer",
    company: "Driftwood",
    initials: "MC",
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

export function Testimonials() {
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      className="relative px-4 pb-24 sm:px-6"
      aria-label="Developer testimonials"
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
            TESTIMONIALS
          </p>
          <h2
            className={`mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl ${
              inView ? entrance(0.05).className : ""
            }`}
            style={inView ? entrance(0.05).style : undefined}
          >
            Loved by developers.
          </h2>
          <p
            className={`mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg ${
              inView ? entrance(0.15).className : ""
            }`}
            style={inView ? entrance(0.15).style : undefined}
          >
            Developers use SnippetFlow every day to keep their code organized
            and shareable.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
          {TESTIMONIALS.map((testimonial, index) => {
            const animated = inView ? entrance(0.25 + index * 0.08) : null
            return (
              <li
                key={testimonial.name}
                className={animated ? animated.className : undefined}
                style={animated ? animated.style : undefined}
              >
                <figure className="group flex h-full flex-col rounded-xl border border-border/60 bg-card/80 p-6 shadow-float backdrop-blur-md transition-all duration-300 supports-[backdrop-filter]:bg-card/60 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lifted">
                  <Quote
                    aria-hidden
                    className="size-5 text-primary/60 transition-transform duration-300 group-hover:scale-110"
                  />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/60 text-xs font-semibold text-muted-foreground transition-all duration-300 group-hover:border-primary/30 group-hover:text-primary"
                    >
                      {testimonial.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {testimonial.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
