// Dashboard motion utilities.
//
// Reuses the existing motion presets from lib/design and adds Dashboard-only
// class-based transitions. Animations are intentionally subtle and professional.

import {
  cardHover,
  dropdownPreset,
  iconButton,
  pressable,
} from "@/lib/design/motion";
import { durations, easings } from "@/lib/design/tokens";

export const dashboardTransitions = {
  base: `transition-all duration-${durations.base} ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none`,
  fast: `transition-all duration-${durations.fast} ease-out motion-reduce:transition-none`,
  theme:
    "transition-colors duration-200 ease-out motion-reduce:transition-none",
} as const;

export const dashboardFocus = {
  ring: "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
} as const;

// Re-exported framer-motion presets for Dashboard reuse.
export const dashboardMotion = {
  cardHover,
  dropdown: dropdownPreset,
  iconButton,
  pressable,
};

// CSS-only motion helpers (no framer-motion dependency).
export const dashboardHover = {
  surface: "transition-colors duration-150 hover:bg-white/[0.06]",
  lift: "transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lifted",
  fade: `transition-opacity duration-${durations.fast} hover:opacity-80`,
} as const;

export const dashboardEasing = easings;
