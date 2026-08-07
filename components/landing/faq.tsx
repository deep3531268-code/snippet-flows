"use client"

import * as React from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

type FaqItem = {
  question: string
  answer: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I save a snippet?",
    answer:
      "Paste code directly into SnippetFlow or use the editor to save from anywhere. You can add a title, language, and optional description before storing it.",
  },
  {
    question: "How does sharing work?",
    answer:
      "Every snippet can be shared with a single link. You control visibility per snippet, so only people you choose can view or edit your code.",
  },
  {
    question: "How fast is search?",
    answer:
      "Search is indexed and instant. Filter by language, tag, or collection to narrow results down to the exact snippet you need in milliseconds.",
  },
  {
    question: "What are collections and tags?",
    answer:
      "Collections group related snippets together, while tags add flexible labels. Combine both to build an organization system that fits your workflow.",
  },
  {
    question: "Is my code secure?",
    answer:
      "Yes. Snippets default to private and only you can see them until you choose to share. Access is enforced by secure, authenticated sessions.",
  },
  {
    question: "Is SnippetFlow free?",
    answer:
      "SnippetFlow is free to get started. You can save, organize, and search snippets right away, with premium plans coming soon.",
  },
  {
    question: "How does authentication work?",
    answer:
      "Sign in securely with your account using a modern, password-free flow. Your session is protected so your snippets stay yours.",
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

export function Faq() {
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  return (
    <section
      ref={ref}
      className="relative px-4 pb-24 sm:px-6"
      aria-label="Frequently asked questions"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <p
            className={
              inView
                ? "animate-fade-in text-xs font-medium tracking-widest text-primary motion-reduce:animate-none"
                : "text-xs font-medium tracking-widest text-primary"
            }
          >
            FAQ
          </p>
          <h2
            className={`mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl ${
              inView ? entrance(0.05).className : ""
            }`}
            style={inView ? entrance(0.05).style : undefined}
          >
            Frequently asked questions.
          </h2>
          <p
            className={`mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg ${
              inView ? entrance(0.15).className : ""
            }`}
            style={inView ? entrance(0.15).style : undefined}
          >
            Everything you need to know about SnippetFlow.
          </p>
        </div>

        <div
          className={`mt-12 overflow-hidden rounded-xl border border-border/60 bg-card/80 shadow-float backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 ${
            inView ? entrance(0.25).className : ""
          }`}
          style={inView ? entrance(0.25).style : undefined}
        >
          {FAQ_ITEMS.map((item, index) => {
            const open = openIndex === index
            return (
              <div
                key={item.question}
                className={cn(
                  "border-border/60 transition-colors duration-200",
                  index > 0 && "border-t",
                )}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {item.question}
                    </span>
                    <motion.span
                      aria-hidden
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="shrink-0 text-muted-foreground"
                    >
                      <ChevronDown className="size-4" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`faq-panel-${index}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
