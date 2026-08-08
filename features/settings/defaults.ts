import { SETTING_DEFS } from "./config"
import type { Settings } from "./types"

function buildDefaults(): Settings {
  const root: Record<string, unknown> = {}
  for (const def of SETTING_DEFS) {
    const segments = def.key.split(".").slice(1)
    let node = root
    for (let index = 0; index < segments.length - 1; index++) {
      node[segments[index]] ??= {}
      node = node[segments[index]] as Record<string, unknown>
    }
    node[segments[segments.length - 1]] = def.defaultValue
  }
  return root as Settings
}

export const DEFAULT_SETTINGS: Settings = buildDefaults()
