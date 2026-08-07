"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { pageTransition } from "./variants"

/**
 * AnimatePresence-based route transition keyed on the current pathname.
 * Mount once in the dashboard layout so navigating between snippets,
 * collections and detail routes cross-fades via the shared preset.
 *
 * `initial={false}` skips the animation on first paint, keeping the
 * dashboard shell rendering instant.
 */
function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        variants={pageTransition}
        initial={false}
        animate="visible"
        exit="exit"
        className="flex min-h-full flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export { RouteTransition }
