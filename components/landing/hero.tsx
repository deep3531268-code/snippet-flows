import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "@/components/landing/github-icon"
import { LiveCodePreview } from "@/components/landing/live-code-preview"

const TRUST_INDICATORS = [
  "Next.js",
  "TypeScript",
  "Prisma",
  "PostgreSQL",
  "Monaco Editor",
  "Neon Auth",
]

const ENTRANCE = "animate-slide-up motion-reduce:animate-none"

function entranceDelay(delay: number) {
  return { animationDelay: `${delay}s`, animationFillMode: "both" } as const
}

export function Hero() {
  return (
    <section className="relative flex flex-1 items-center px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className={`${ENTRANCE} animate-fade-in`} style={entranceDelay(0.05)}>
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-3 py-1 text-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/30"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-primary" />
              Built for Developers
            </Badge>
          </div>

          <h1
            className={`mt-6 ${ENTRANCE} font-heading text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-6xl`}
            style={entranceDelay(0.15)}
          >
            Store, organize, and share your{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              code snippets
            </span>
          </h1>

          <p
            className={`mt-5 max-w-xl ${ENTRANCE} text-base leading-relaxed text-muted-foreground sm:text-lg`}
            style={entranceDelay(0.25)}
          >
            Keep every snippet in one place. Search your library instantly,
            organize with tags and collections, and share code securely with
            teammates.
          </p>

          <div
            className={`mt-8 flex ${ENTRANCE} flex-col items-center gap-3 sm:flex-row`}
            style={entranceDelay(0.35)}
          >
            <Button
              asChild
              size="lg"
              className="w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted active:translate-y-0 sm:w-auto"
            >
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/40 active:translate-y-0 sm:w-auto"
            >
              <Link href="https://github.com" target="_blank" rel="noreferrer">
                <GithubIcon className="size-4 transition-transform duration-300 group-hover/button:scale-105" />
                View on GitHub
              </Link>
            </Button>
          </div>

          <ul
            className={`mt-10 flex ${ENTRANCE} flex-wrap items-center justify-center gap-2 lg:justify-start`}
            style={entranceDelay(0.45)}
          >
            {TRUST_INDICATORS.map((indicator, index) => (
              <li
                key={indicator}
                className="animate-fade-in motion-reduce:animate-none"
                style={entranceDelay(0.5 + index * 0.06)}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/40">
                  <span
                    aria-hidden
                    className="size-1 rounded-full bg-foreground/25"
                  />
                  {indicator}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <LiveCodePreview />
      </div>
    </section>
  )
}
