"use client"

import { motion, type Variants } from "framer-motion"

import { fadeInUp } from "@/lib/design/motion"
import { cn } from "@/lib/utils"

type FadeInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  variants?: (options: { delay?: number }) => Variants
}

export function FadeIn({
  children,
  className,
  delay = 0,
  variants = fadeInUp,
}: FadeInProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={variants({ delay })}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}
