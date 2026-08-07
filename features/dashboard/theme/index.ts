// Dashboard Theme Foundation (D1.3.1)
//
// Reusable Dashboard-only design tokens, typography, and motion utilities.
// Every future Dashboard milestone (Sidebar, Top Navigation, Cards, Home, ...)
// MUST consume these instead of introducing new values.

export {
  dashboardColors,
  dashboardRadius,
  dashboardShadows,
  dashboardBorders,
  dashboardSpacing,
  type DashboardSpacing,
} from "./tokens";

export {
  dashboardTypography,
  dashboardText,
  type DashboardTypographyKey,
} from "./typography";

export {
  dashboardTransitions,
  dashboardFocus,
  dashboardMotion,
  dashboardHover,
  dashboardEasing,
} from "./motion";
