import { SNIPPET_LANGUAGES } from "../../features/snippets/languages"

export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000"
export const DEMO_USER_EMAIL = "dev@snippetflow.local"
export const DEMO_USER_NAME = "Demo User"

export const CATEGORIES = [
  "Authentication",
  "Backend",
  "Frontend",
  "Database",
] as const

export type Category = (typeof CATEGORIES)[number]

export const COLLECTION_DEFS: Record<Category, { description: string }> = {
  Authentication: {
    description: "Auth flows, tokens, sessions, and access control",
  },
  Backend: {
    description: "Server, API, middleware, and service code",
  },
  Frontend: {
    description: "React, UI, hooks, and client-side code",
  },
  Database: {
    description: "Prisma, SQL, Redis, and data access code",
  },
}

export const TAG_POOL: Record<Category, readonly string[]> = {
  Authentication: ["jwt", "better-auth", "auth", "middleware", "oauth"],
  Backend: ["express", "nestjs", "api", "node", "validation"],
  Frontend: ["react", "nextjs", "tailwind", "hooks", "ui"],
  Database: ["prisma", "postgres", "mysql", "redis", "drizzle", "sql", "backup"],
}

export const SUPPORTED_LANGUAGES: readonly string[] = [
  ...SNIPPET_LANGUAGES,
  "php",
]

export type SeedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Fixed anchor keeps the seed deterministic. Override with SEED_ANCHOR_DATE to
// re-anchor the dataset against a different "now" (ISO 8601).
const DEFAULT_ANCHOR = "2026-08-07T12:00:00.000Z"

export function resolveAnchorDate(): Date {
  const anchor = new Date(process.env.SEED_ANCHOR_DATE ?? DEFAULT_ANCHOR)
  if (Number.isNaN(anchor.getTime())) {
    throw new Error("SEED_ANCHOR_DATE must be a valid ISO 8601 date")
  }
  return anchor
}
