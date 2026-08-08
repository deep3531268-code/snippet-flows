"use client"

import { MotionConfig } from "framer-motion"
import { ThemeProvider } from "next-themes"

import { Toaster } from "@/components/ui/sonner"
import { GlobalSearchProvider } from "@/features/search"
import { durations } from "@/lib/design/tokens"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: durations.base / 1000, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlobalSearchProvider>{children}</GlobalSearchProvider>
        <Toaster richColors closeButton position="bottom-right" />
      </MotionConfig>
    </ThemeProvider>
  )
}
