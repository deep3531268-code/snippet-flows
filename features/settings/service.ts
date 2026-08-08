import "server-only"

import {
  getSettingDef,
  isDatabaseSetting,
  type SettingKey,
} from "./config"
import { settingsRepository } from "./repository"
import type { SettingValue, Settings } from "./types"
import { isSettingKey, normalizeSettings, validateSettingValue } from "./validation"

function resolveValue(settings: Settings, key: SettingKey): SettingValue {
  let node: unknown = settings
  for (const segment of key.split(".").slice(1)) {
    node = (node as Record<string, unknown>)[segment]
  }
  return node as SettingValue
}

function pickDatabase(record: Record<string, unknown>) {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(record)) {
    if (isSettingKey(key) && isDatabaseSetting(key)) {
      result[key] = record[key]
    }
  }
  return result
}

async function persist(userId: string, record: Record<string, unknown>) {
  await settingsRepository.upsert(userId, pickDatabase(record))
  return normalizeSettings(record)
}

export const settingsService = {
  async getSettings(userId: string): Promise<Settings> {
    const stored = await settingsRepository.findByUserId(userId)
    return normalizeSettings(stored)
  },

  async getSetting(userId: string, key: SettingKey): Promise<SettingValue> {
    return resolveValue(await this.getSettings(userId), key)
  },

  async updateSettings(
    userId: string,
    patch: Partial<Record<SettingKey, SettingValue>>,
  ): Promise<Settings> {
    for (const key of Object.keys(patch)) {
      if (!isSettingKey(key)) continue
      const value = validateSettingValue(key, patch[key as SettingKey])
      if (value === null) {
        throw new Error(
          `Invalid value for setting "${key}". Allowed: ${
            getSettingDef(key as SettingKey).allowedValues?.join(", ") ?? "boolean"
          }`,
        )
      }
    }

    const record = await settingsRepository.findByUserId(userId)
    for (const key of Object.keys(patch)) {
      if (!isSettingKey(key)) continue
      record[key] = patch[key as SettingKey]
    }
    return persist(userId, record)
  },

  async updateSetting(
    userId: string,
    key: SettingKey,
    value: SettingValue,
  ): Promise<Settings> {
    return this.updateSettings(userId, { [key]: value })
  },

  async resetSetting(userId: string, key: SettingKey): Promise<Settings> {
    const record = await settingsRepository.findByUserId(userId)
    delete record[key]
    return persist(userId, record)
  },

  async resetSettings(userId: string): Promise<Settings> {
    await settingsRepository.upsert(userId, {})
    return normalizeSettings({})
  },
}
