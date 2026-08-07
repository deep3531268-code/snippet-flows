// Dashboard typography utilities.
//
// Reuses the existing project font (--font-sans / --font-heading) and the
// established hierarchy: Heading / Section Title / Body / Caption.
// No new typography system is introduced.

import { cn } from "@/lib/utils";

export const dashboardTypography = {
  heading: "font-heading text-[24px] leading-tight font-bold tracking-tight",
  sectionTitle:
    "font-heading text-[17px] leading-snug font-semibold tracking-tight",
  body: "text-sm leading-relaxed font-normal",
  caption: "text-xs leading-snug font-medium",
} as const;

export type DashboardTypographyKey = keyof typeof dashboardTypography;

export function dashboardText(
  variant: DashboardTypographyKey,
  className?: string,
) {
  return cn(dashboardTypography[variant], className);
}
