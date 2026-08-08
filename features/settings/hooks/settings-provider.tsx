"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import {
  getSettingsAction,
  resetSettingAction,
  resetSettingsAction,
  updateSettingAction,
} from "../actions"
import { SETTING_KEYS, type SettingKey } from "../config"
import type { SettingValue, Settings } from "../types"

type SettingsContextValue = {
  settings: Settings | null
  loaded: boolean
  updateSetting: (key: SettingKey, value: SettingValue) => Promise<void>
  resetSetting: (key: SettingKey) => Promise<void>
  resetSettings: () => Promise<void>
}

const SettingsContext = React.createContext<SettingsContextValue | null>(null)

const THEME_STORAGE_KEY = "theme"

export function useSettings(): SettingsContextValue {
  const context = React.useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within <SettingsProvider>")
  }
  return context
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme()
  const [settings, setSettings] = React.useState<Settings | null>(null)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    getSettingsAction()
      .then((result) => {
        if (cancelled) return
        if (result.ok && result.settings) {
          setSettings(result.settings)
          // Seed the account-level theme on devices that never picked one
          // locally (next-themes persists an explicit choice in localStorage).
          try {
            if (window.localStorage.getItem(THEME_STORAGE_KEY) === null) {
              setTheme(result.settings.appearance.theme)
            }
          } catch {
            // Ignore storage failures.
          }
        }
      })
      .catch(() => {
        // The provider must not crash when the settings request fails.
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [setTheme])

  const applyTheme = React.useCallback(
    (value: SettingValue) => {
      if (typeof value === "string") setTheme(value)
    },
    [setTheme],
  )

  const updateSetting = React.useCallback(
    async (key: SettingKey, value: SettingValue) => {
      const result = await updateSettingAction(key, value)
      if (!result.ok || !result.settings) {
        throw new Error(result?.error ?? "Failed to update setting")
      }
      setSettings(result.settings)
      if (key === SETTING_KEYS.theme) applyTheme(value)
    },
    [applyTheme],
  )

  const resetSetting = React.useCallback(
    async (key: SettingKey) => {
      const result = await resetSettingAction(key)
      if (!result.ok || !result.settings) {
        throw new Error(result?.error ?? "Failed to reset setting")
      }
      setSettings(result.settings)
      if (key === SETTING_KEYS.theme) {
        setTheme(result.settings.appearance.theme)
      }
    },
    [setTheme],
  )

  const resetSettings = React.useCallback(async () => {
    const result = await resetSettingsAction()
    if (!result.ok || !result.settings) {
      throw new Error(result?.error ?? "Failed to reset settings")
    }
    setSettings(result.settings)
    setTheme(result.settings.appearance.theme)
  }, [setTheme])

  const value = React.useMemo<SettingsContextValue>(
    () => ({ settings, loaded, updateSetting, resetSetting, resetSettings }),
    [settings, loaded, updateSetting, resetSetting, resetSettings],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
