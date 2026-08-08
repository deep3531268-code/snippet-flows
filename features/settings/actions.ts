"use server"

import { getCurrentUser } from "@/features/auth/session"
import { getActionErrorMessage } from "@/features/shared/errors"
import { isDatabaseSetting, type SettingKey } from "./config"
import { settingsService } from "./service"
import type { SettingValue, Settings } from "./types"
import { isSettingKey } from "./validation"

export type SettingsActionResult = {
  ok?: boolean
  error?: string
  settings?: Settings
}

// The settings provider mounts on every page (including public ones such as
// share/sign-in), so these actions must not redirect when unauthenticated.
async function getAuthedUser() {
  return getCurrentUser()
}

export async function getSettingsAction(): Promise<SettingsActionResult> {
  const user = await getAuthedUser()
  if (!user) return { ok: false, error: "Unauthorized" }
  try {
    const settings = await settingsService.getSettings(user.id)
    return { ok: true, settings }
  } catch (error) {
    return { error: getActionErrorMessage(error, "Failed to load settings") }
  }
}

export async function updateSettingAction(
  key: string,
  value: SettingValue,
): Promise<SettingsActionResult> {
  const user = await getAuthedUser()
  if (!user) return { ok: false, error: "Unauthorized" }
  if (!isSettingKey(key) || !isDatabaseSetting(key)) {
    return { error: "Unknown setting" }
  }

  try {
    const settings = await settingsService.updateSetting(
      user.id,
      key as SettingKey,
      value,
    )
    return { ok: true, settings }
  } catch (error) {
    return { error: getActionErrorMessage(error, "Failed to update setting") }
  }
}

export async function resetSettingAction(
  key: string,
): Promise<SettingsActionResult> {
  const user = await getAuthedUser()
  if (!user) return { ok: false, error: "Unauthorized" }
  if (!isSettingKey(key) || !isDatabaseSetting(key)) {
    return { error: "Unknown setting" }
  }

  try {
    const settings = await settingsService.resetSetting(
      user.id,
      key as SettingKey,
    )
    return { ok: true, settings }
  } catch (error) {
    return { error: getActionErrorMessage(error, "Failed to reset setting") }
  }
}

export async function resetSettingsAction(): Promise<SettingsActionResult> {
  const user = await getAuthedUser()
  if (!user) return { ok: false, error: "Unauthorized" }
  try {
    const settings = await settingsService.resetSettings(user.id)
    return { ok: true, settings }
  } catch (error) {
    return { error: getActionErrorMessage(error, "Failed to reset settings") }
  }
}
