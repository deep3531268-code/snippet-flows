import type { Variants } from "framer-motion"

import { durations, easings, springs } from "./tokens"

type PresetOptions = {
  delay?: number
}

type Direction = "left" | "right" | "top" | "bottom"

const springVisible = { ...springs.gentle, duration: 0.32 }
const springDialog = { ...springs.base, duration: 0.3 }

export const fadeIn = (options: PresetOptions = {}): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.base / 1000, ease: easings.out, delay: options.delay },
  },
  exit: { opacity: 0, transition: { duration: durations.fast / 1000, ease: easings.in } },
})

export const fadeInUp = (options: PresetOptions = {}): Variants => ({
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...springVisible, delay: options.delay },
  },
  exit: { opacity: 0, y: 4, transition: { duration: durations.fast / 1000, ease: easings.in } },
})

export const fadeInDown = (options: PresetOptions = {}): Variants => ({
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...springVisible, delay: options.delay },
  },
  exit: { opacity: 0, y: -4, transition: { duration: durations.fast / 1000, ease: easings.in } },
})

export const scaleIn = (options: PresetOptions = {}): Variants => ({
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...springDialog, delay: options.delay },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: durations.fast / 1000, ease: easings.in } },
})

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...springs.gentle, duration: 0.3 },
  },
  exit: { opacity: 0, y: -4, transition: { duration: 0.16, ease: easings.in } },
}

export const overlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.fast / 1000, ease: easings.out } },
  exit: { opacity: 0, transition: { duration: durations.fast / 1000, ease: easings.in } },
}

export const dialogPreset: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springDialog,
  },
  exit: { opacity: 0, scale: 0.97, y: 6, transition: { duration: durations.fast / 1000, ease: easings.in } },
}

const drawerAxis: Record<Direction, { axis: "x" | "y"; initial: number; exit: number }> = {
  left: { axis: "x", initial: -48, exit: -24 },
  right: { axis: "x", initial: 48, exit: 24 },
  top: { axis: "y", initial: -48, exit: -24 },
  bottom: { axis: "y", initial: 48, exit: 24 },
}

export const drawerPreset = (direction: Direction = "right"): Variants => {
  const { axis, initial, exit } = drawerAxis[direction]
  return {
    hidden: { opacity: 0, [axis]: initial },
    visible: {
      opacity: 1,
      [axis]: 0,
      transition: { ...springs.gentle, duration: 0.3 },
    },
    exit: {
      opacity: 0,
      [axis]: exit,
      transition: { duration: durations.fast / 1000, ease: easings.in },
    },
  } as Variants
}

export const dropdownPreset: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: -3 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.snappy,
  },
  exit: { opacity: 0, scale: 0.98, y: -3, transition: { duration: durations.instant / 1000, ease: easings.in } },
}

export const popoverPreset: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 2 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.snappy,
  },
  exit: { opacity: 0, scale: 0.98, y: 2, transition: { duration: durations.instant / 1000, ease: easings.in } },
}

export const toastPreset: Variants = {
  hidden: { opacity: 0, x: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { ...springs.snappy, duration: 0.28 },
  },
  exit: { opacity: 0, x: 24, scale: 0.98, transition: { duration: durations.fast / 1000, ease: easings.in } },
}

export const listStagger = (options: PresetOptions = {}): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: options.delay ?? 0 },
  },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
})

export const listItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
  exit: { opacity: 0, y: -6, transition: { duration: durations.fast / 1000, ease: easings.in } },
}

export const pressable = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: springs.micro,
}

export const iconButton = {
  whileHover: { scale: 1.06 },
  whileTap: { scale: 0.92 },
  transition: springs.micro,
}

export const cardHover = {
  whileHover: { y: -2, scale: 1.004 },
  whileTap: { scale: 0.995 },
  transition: springs.gentle,
}

export const spinnerPulse = {
  animate: {
    rotate: 360,
    transition: { repeat: Infinity, duration: 0.8, ease: "linear" },
  },
}

export const dotPulse = {
  animate: {
    opacity: [0.3, 1, 0.3],
    scale: [0.9, 1.1, 0.9],
    transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
  },
}

export const skeletonShimmer = {
  animate: {
    opacity: [0.45, 0.9, 0.45],
    transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
  },
}
