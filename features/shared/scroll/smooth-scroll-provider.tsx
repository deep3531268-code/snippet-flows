"use client"

import * as React from "react"
import { Lenis } from "lenis/react"

/**
 * Shared Lenis smooth-scroll provider. Mounted exactly once in the root
 * layout and attached to the window (`root`), so the landing page inherits
 * a premium, slightly smoother scroll.
 *
 * Behavior contract:
 * - `syncTouch: false` keeps touch/trackpad momentum native (no fighting).
 * - `allowNestedScroll: true` lets nested scroll regions (dialogs,
 *   dropdowns, the dashboard inner workspace) scroll natively.
 * - `respectReducedMotion` honours `prefers-reduced-motion` (default).
 * - Dashboard's own `ScrollableContent` is additionally guarded with
 *   `data-lenis-prevent`, keeping that region 100% native/fast.
 */
const LENIS_OPTIONS = {
  lerp: 0.09,
  smoothWheel: true,
  syncTouch: false,
  allowNestedScroll: true,
  respectReducedMotion: true,
} as const

function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <Lenis root options={LENIS_OPTIONS} autoRaf>
      {children}
    </Lenis>
  )
}

export { SmoothScrollProvider }
