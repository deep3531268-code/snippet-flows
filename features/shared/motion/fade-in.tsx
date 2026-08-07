"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { fadeInUp } from "./variants"

type FadeInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Shared entrance animation for content blocks. Variants come from the
 * shared motion system; features should never define their own presets.
 */
function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={fadeInUp({ delay })}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export { FadeIn }
