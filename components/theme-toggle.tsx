"use client"

import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SETTING_KEYS } from "@/features/settings/config"
import { useSettings } from "@/features/settings/hooks"

export function ThemeToggle() {
  const { updateSetting } = useSettings()

  const select = (theme: "light" | "dark" | "system") => {
    void updateSetting(SETTING_KEYS.theme, theme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" aria-label="Toggle theme">
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => select("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => select("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => select("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
