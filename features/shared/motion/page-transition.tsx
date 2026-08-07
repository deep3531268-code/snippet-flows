"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { pageTransition } from "./variants"

/**
 * Route-level page transition. Uses the shared 150-200ms `pageTransition`
 * preset. Wrap route content (not the shell) so nav feels snappy.
 */
function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export { PageTransition }
