"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { listItem, listStagger } from "./variants"

/**
 * Shared stagger container + item for grids/lists. Variants come from the
 * shared motion system; features pass their own item delay.
 */
function StaggerContainer({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={listStagger({ delay })}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div className={cn(className)} variants={listItem}>
      {children}
    </motion.div>
  )
}

export { StaggerContainer, StaggerItem }
