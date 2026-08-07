import type { Variants } from "framer-motion"

import { motionDurations, motionEasings } from "./tokens"
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  scaleIn,
  overlay,
  dialogPreset,
  drawerPreset,
  dropdownPreset,
  popoverPreset,
  toastPreset,
  listStagger,
  listItem,
  pressable,
  iconButton,
  cardHover,
  spinnerPulse,
  dotPulse,
  skeletonShimmer,
} from "@/lib/design/motion"

export {
  fadeIn,
  fadeInUp,
  fadeInDown,
  scaleIn,
  overlay,
  dialogPreset,
  drawerPreset,
  dropdownPreset,
  popoverPreset,
  toastPreset,
  listStagger,
  listItem,
  pressable,
  iconButton,
  cardHover,
  spinnerPulse,
  dotPulse,
  skeletonShimmer,
}

// Canonical route-level transition. Compressed to the 150-200ms range so
// navigations feel snappy while preserving a subtle premium slide.
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.base, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: motionDurations.fast, ease: motionEasings.in },
  },
}

// Lightweight content reveal for sections inside a route.
export const contentReveal: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.base, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: motionDurations.fast, ease: motionEasings.in },
  },
}
