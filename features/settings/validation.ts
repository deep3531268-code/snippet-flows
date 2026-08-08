import { z } from "zod"

import { getSettingDef, SETTING_KEYS, type SettingKey } from "./config"
import { DEFAULT_SETTINGS } from "./defaults"
import type { SettingValue, Settings } from "./types"

const SETTING_KEY_SET = new Set<string>(Object.values(SETTING_KEYS))

export function isSettingKey(value: string): value is SettingKey {
  return SETTING_KEY_SET.has(value)
}

function settingSchema(def: ReturnType<typeof getSettingDef>): z.ZodType<SettingValue> {
  if (def.allowedValues) {
    return z.enum(def.allowedValues as [string, ...string[]])
  }
  return z.boolean()
}

// Validates an incoming value for a known key. Returns null when the key is
// unknown or the value is not one of the allowed values.
export function validateSettingValue(
  key: SettingKey,
  value: unknown,
): SettingValue | null {
  const parsed = settingSchema(getSettingDef(key)).safeParse(value)
  return parsed.success ? (parsed.data as SettingValue) : null
}

function setPath(target: Record<string, unknown>, key: string, value: unknown) {
  const segments = key.split(".").slice(1)
  let node = target
  for (let index = 0; index < segments.length - 1; index++) {
    node = node[segments[index]] as Record<string, unknown>
  }
  node[segments[segments.length - 1]] = value
}

// Normalizes a partial stored payload into a full Settings object. Unknown keys
// are dropped and invalid values fall back to their defaults, so corrupt or
// outdated data can never produce an invalid settings shape.
export function normalizeSettings(raw: Record<string, unknown>): Settings {
  const result = structuredClone(DEFAULT_SETTINGS) as Record<string, unknown>
  for (const key of Object.keys(raw)) {
    if (!isSettingKey(key)) continue
    const value = validateSettingValue(key, raw[key])
    if (value === null) continue
    setPath(result, key, value)
  }
  return result as Settings
}
