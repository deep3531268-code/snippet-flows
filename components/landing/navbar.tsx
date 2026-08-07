"use client"

import * as React from "react"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion"
import { ArrowRight, Braces, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GithubIcon } from "@/components/landing/github-icon"
import { dropdownPreset, overlay } from "@/lib/design/motion"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing", badge: "Soon" },
  { label: "FAQ", href: "#faq" },
] as const

const MOBILE_LINKS = [...NAV_LINKS]

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const { scrollY } = useScroll()

  const toggleRef = React.useRef<React.ComponentRef<typeof Button>>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 8)
  })

  const closeMenu = React.useCallback((focusToggle = false) => {
    setOpen(false)
    if (focusToggle) toggleRef.current?.focus()
  }, [])

  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu(true)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, closeMenu])

  React.useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus()
  }, [open])

  return (
    <header className="sticky top-0 z-50 animate-fade-in motion-reduce:animate-none">
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "border-b border-border/60 bg-background/70 shadow-card backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
            : "border-b border-transparent",
        )}
      >
        <nav
          className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            onClick={() => closeMenu()}
            className="group flex items-center gap-2 rounded-md transition-opacity duration-200 hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            aria-label="SnippetFlow home"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background transition-transform duration-200 group-hover:scale-105">
              <Braces className="size-4" />
            </span>
            <span className="font-heading text-sm font-semibold tracking-tight">
              SnippetFlow
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {link.label}
                  {link.badge && (
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-foreground">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-1.5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="group hidden items-center justify-center rounded-md p-1.5 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none lg:inline-flex"
              aria-label="SnippetFlow on GitHub"
            >
              <GithubIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
            </a>

            <div className="transition-transform duration-200 hover:scale-105">
              <ThemeToggle />
            </div>

            <Link
              href="/auth/sign-in"
              className="hidden items-center rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none lg:inline-flex"
            >
              Sign In
            </Link>

            <Button
              asChild
              className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lifted"
            >
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/button:translate-x-0.5" />
              </Link>
            </Button>

            <Button
              ref={toggleRef}
              type="button"
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="landing-mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="landing-mobile-menu"
            variants={overlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-0 top-16 bottom-0 z-40 bg-background/40 backdrop-blur-sm lg:hidden"
            onClick={() => closeMenu()}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="false"
              aria-label="Menu"
              variants={dropdownPreset}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mx-3 mt-2 rounded-xl border bg-card p-2 shadow-float"
              onClick={(event) => event.stopPropagation()}
            >
              <ul className="flex flex-col">
                {MOBILE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => closeMenu()}
                      className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-foreground transition-colors duration-200 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="my-1 h-px bg-border" role="separator" />

              <div className="flex flex-col gap-1.5 p-1">
                <Button asChild variant="ghost" className="justify-center">
                  <Link href="/auth/sign-in" onClick={() => closeMenu()}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild onClick={() => closeMenu()}>
                  <Link href="/auth/sign-up">
                    Get Started
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/button:translate-x-0.5" />
                  </Link>
                </Button>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => closeMenu()}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <GithubIcon className="size-4" />
                  GitHub
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
