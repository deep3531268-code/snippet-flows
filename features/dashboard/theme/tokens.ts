// Dashboard-only design tokens.
//
// The Dashboard is a self-contained dark desktop-style surface. Its palette is
// hardcoded here (rather than reusing the app light/dark CSS variables) so the
// workspace keeps a consistent dark-navy identity regardless of the page theme.
// These tokens are composed into class strings so Dashboard components consume
// them directly. No new global CSS is introduced here.

export const dashboardColors = {
  // Page / workspace
  page: "bg-[#050910] text-[#e8edf5]",
  workspace: "bg-[#0a111c] text-[#e8edf5]",
  workspaceGlass: "bg-[#0a111c]/75 backdrop-blur-2xl",

  // Surfaces
  surface: "bg-[#0f1826]/70 text-[#e8edf5]",
  surfaceMuted: "bg-[#0c1420] text-[#e8edf5]",
  elevated: "bg-[#141f30] text-[#e8edf5]",
  glass: "bg-[#0c1420]/55 backdrop-blur-2xl",

  // Text
  heading: "text-[#f3f6fb]",
  body: "text-[#e2e8f0]",
  secondary: "text-[#94a3b8]",
  caption: "text-[#7d8ba3]",
  faint: "text-[#5b6b82]",

  // Accent
  primary: "bg-[#2563eb] text-white",
  primaryHover: "hover:bg-[#2f6fea]",
  primarySoft: "bg-[#2563eb]/15 text-[#7cb3ff]",
  primaryText: "text-[#60a5fa]",

  // Navigation
  navInactive: "text-[#a7b3c6]",
  navHover: "hover:bg-white/[0.06]",
  navActive:
    "bg-[#2563eb] text-white shadow-[0_0_16px_-2px_rgba(37,99,235,0.55)]",

  // Semantic
  success: "text-[#4ade80]",
  warning: "text-[#fbbf24]",
  error: "text-[#fb7185]",

  // Quick-action accents
  accentBlue: "bg-[#2563eb]",
  accentGreen: "bg-[#10b981]",
  accentPurple: "bg-[#8b5cf6]",
  accentOrange: "bg-[#f59e0b]",
} as const;

export const dashboardRadius = {
  workspace: "rounded-[22px]",
  card: "rounded-[16px]",
  button: "rounded-[12px]",
  input: "rounded-[12px]",
  badge: "rounded-full",
} as const;

export const dashboardShadows = {
  workspace:
    "shadow-[0_30px_80px_-24px_rgba(2,6,17,0.85)]",
  glow: "shadow-[0_0_80px_-20px_rgba(37,99,235,0.4)]",
  soft: "shadow-[0_1px_2px_rgba(2,6,17,0.3),0_2px_10px_-2px_rgba(2,6,17,0.45)]",
  hover:
    "shadow-[0_10px_28px_-10px_rgba(2,6,17,0.65)]",
  elevated:
    "shadow-[0_14px_36px_-10px_rgba(2,6,17,0.75)]",
  hoverElevation:
    "hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(2,6,17,0.7)]",
} as const;

export const dashboardBorders = {
  subtle: "border border-white/[0.07]",
  subtleMuted: "border border-white/[0.05]",
} as const;

// One spacing scale: 4 8 12 16 20 24 32 40 48. No arbitrary values.
export const dashboardSpacing = [4, 8, 12, 16, 20, 24, 32, 40, 48] as const;

export type DashboardSpacing = (typeof dashboardSpacing)[number];
