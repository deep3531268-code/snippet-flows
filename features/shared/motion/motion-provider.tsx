"use client"

import * as React from "react"
import { MotionConfig } from "framer-motion"

import { motionDurations, motionEasings } from "./tokens"

/**
 * Single source of truth for the app-wide motion configuration.
 * Mounted once in the root layout. Everything else consumes presets
 * from `@/features/shared/motion` so no feature ever defines its own
 * duration/easing/spring system.
 */
function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: motionDurations.base, ease: motionEasings.out }}
    >
      {children}
    </MotionConfig>
  )
}

export { MotionProvider }
