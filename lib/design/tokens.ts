export const durations = {
  instant: 120,
  fast: 160,
  base: 200,
  slow: 280,
  page: 300,
} as const

export const springs = {
  micro: { type: "spring", stiffness: 600, damping: 38, mass: 0.4 },
  snappy: { type: "spring", stiffness: 500, damping: 34, mass: 0.6 },
  base: { type: "spring", stiffness: 380, damping: 32, mass: 0.8 },
  gentle: { type: "spring", stiffness: 280, damping: 28, mass: 1 },
  soft: { type: "spring", stiffness: 200, damping: 26, mass: 1 },
} as const

export const easings = {
  standard: [0.2, 0.8, 0.2, 1] as const,
  out: [0.16, 1, 0.3, 1] as const,
  in: [0.7, 0, 0.84, 0] as const,
  inOut: [0.87, 0, 0.13, 1] as const,
} as const

export const zIndex = {
  dropdown: 50,
  drawer: 60,
  dialog: 60,
  toast: 80,
  tooltip: 90,
} as const
