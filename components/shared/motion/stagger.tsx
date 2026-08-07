"use client"

import { motion } from "framer-motion"

import { listItem, listStagger } from "@/lib/design/motion"
import { cn } from "@/lib/utils"

export function StaggerContainer({
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

export function StaggerItem({
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
