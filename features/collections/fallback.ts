import type { CollectionListItem } from "./types"
import type { SnippetListItem } from "@/features/snippets/types"

export const FALLBACK_COLLECTIONS: CollectionListItem[] = [
  {
    id: "00000000-0000-0000-0000-000000000011",
    name: "Design system",
    description: "Reusable tokens, color palettes, and component recipes.",
    isPublic: false,
    accent: "blue",
    snippetCount: 4,
    tags: [
      { id: "00000000-0000-0000-0000-000000000012", name: "design" },
      { id: "00000000-0000-0000-0000-000000000013", name: "tailwind" },
    ],
    createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000014",
    name: "Auth & security",
    description: "Session handling, rate limiting, and hardening helpers.",
    isPublic: true,
    accent: "purple",
    snippetCount: 7,
    tags: [
      { id: "00000000-0000-0000-0000-000000000015", name: "auth" },
      { id: "00000000-0000-0000-0000-000000000016", name: "security" },
    ],
    createdAt: new Date(Date.now() - 21 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000017",
    name: "Database helpers",
    description: "Prisma queries, migrations, and seed utilities.",
    isPublic: false,
    accent: "green",
    snippetCount: 2,
    tags: [{ id: "00000000-0000-0000-0000-000000000018", name: "prisma" }],
    createdAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000019",
    name: "DevOps snippets",
    description: "Docker, CI, and deployment one-liners.",
    isPublic: true,
    accent: "orange",
    snippetCount: 0,
    tags: [],
    createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
  },
]

export function getFallbackCollection(
  id: string,
): CollectionListItem | null {
  return FALLBACK_COLLECTIONS.find((collection) => collection.id === id) ?? null
}

const COLLECTION_SNIPPETS: Record<string, SnippetListItem[]> = {
  "00000000-0000-0000-0000-000000000011": [
    {
      id: "00000000-0000-0000-0000-000000000101",
      title: "design tokens",
      description: "Core theme tokens for surfaces, borders, and text.",
      content:
        ":root {\n  --color-bg: #0f1826;\n  --color-surface: #141f30;\n  --color-border: rgba(255, 255, 255, 0.08);\n  --color-heading: #f3f6fb;\n}",
      language: "css",
      isPublic: false,
      slug: null,
      isFavorite: true,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 28 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000102", name: "design" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000011",
          name: "Design system",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000103",
      title: "color palette recipe",
      description: "Semantic color scales used across the dashboard.",
      content:
        "export const palette = {\n  primary: \"#2563eb\",\n  secondary: \"#94a3b8\",\n  heading: \"#f3f6fb\",\n  danger: \"#fb7185\",\n}",
      language: "typescript",
      isPublic: false,
      slug: null,
      isFavorite: false,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 26 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000104", name: "tailwind" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000011",
          name: "Design system",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000105",
      title: "button variant recipe",
      description: "Variant recipe for the shared button primitive.",
      content:
        "export const buttonVariants = cva(\n  \"inline-flex items-center gap-2 rounded-lg\",\n  { variants: { variant: { primary: \"bg-[#2563eb]\", secondary: \"bg-white/[0.06]\" } } },\n)",
      language: "tsx",
      isPublic: false,
      slug: null,
      isFavorite: false,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 18 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000106", name: "components" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000011",
          name: "Design system",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000107",
      title: "spacing scale",
      description: "Consistent spacing ramp for layout primitives.",
      content:
        ":root {\n  --space-1: 4px;\n  --space-2: 8px;\n  --space-3: 12px;\n  --space-4: 16px;\n  --space-6: 24px;\n}",
      language: "css",
      isPublic: false,
      slug: null,
      isFavorite: false,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 14 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000108", name: "design" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000011",
          name: "Design system",
        },
      ],
    },
  ],
  "00000000-0000-0000-0000-000000000014": [
    {
      id: "00000000-0000-0000-0000-000000000201",
      title: "session guard",
      description: "Redirect unauthenticated requests to the sign-in page.",
      content:
        "export function requireSession() {\n  const session = getSession()\n  if (!session) redirect(\"/auth/sign-in\")\n  return session\n}",
      language: "typescript",
      isPublic: false,
      slug: null,
      isFavorite: true,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 20 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000202", name: "auth" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000014",
          name: "Auth & security",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000203",
      title: "rate limiter",
      description: "Simple in-memory rate limiting helper.",
      content:
        "export async function rateLimit(key: string, limit: number) {\n  const count = await cache.incr(key)\n  if (count === 1) await cache.expire(key, 60)\n  return count <= limit\n}",
      language: "typescript",
      isPublic: false,
      slug: null,
      isFavorite: false,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 19 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000204", name: "security" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000014",
          name: "Auth & security",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000205",
      title: "password hashing",
      description: "Argon2 hashing and verification for user passwords.",
      content:
        "import { hash, verify } from \"@node-rs/argon2\"\nexport function hashPassword(password: string) {\n  return hash(password)\n}",
      language: "typescript",
      isPublic: false,
      slug: null,
      isFavorite: false,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 16 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000206", name: "auth" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000014",
          name: "Auth & security",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000207",
      title: "CSRF token helper",
      description: "Generate per-session CSRF tokens.",
      content:
        "export function csrfToken() {\n  return randomBytes(32).toString(\"hex\")\n}",
      language: "typescript",
      isPublic: false,
      slug: null,
      isFavorite: false,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 13 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 13 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000208", name: "security" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000014",
          name: "Auth & security",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000209",
      title: "login throttle",
      description: "Back off repeated failed login attempts.",
      content:
        "export async function throttleLogin(key: string) {\n  const remaining = await cache.ttl(key)\n  if (remaining > 0) throw new Error(\"Too many attempts\")\n}",
      language: "typescript",
      isPublic: false,
      slug: null,
      isFavorite: false,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 11 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000210", name: "security" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000014",
          name: "Auth & security",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000211",
      title: "JWT verify",
      description: "Verify signed JWTs with jose.",
      content:
        "import { jwtVerify } from \"jose\"\nexport function verifyToken(token: string, secret: Uint8Array) {\n  return jwtVerify(token, secret)\n}",
      language: "typescript",
      isPublic: false,
      slug: null,
      isFavorite: false,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 9 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 9 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000212", name: "security" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000014",
          name: "Auth & security",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000213",
      title: "secure headers",
      description: "Recommended security headers for responses.",
      content:
        "export const securityHeaders = {\n  \"X-Frame-Options\": \"DENY\",\n  \"X-Content-Type-Options\": \"nosniff\",\n  \"Referrer-Policy\": \"strict-origin-when-cross-origin\",\n}",
      language: "typescript",
      isPublic: false,
      slug: null,
      isFavorite: false,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000214", name: "auth" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000014",
          name: "Auth & security",
        },
      ],
    },
  ],
  "00000000-0000-0000-0000-000000000017": [
    {
      id: "00000000-0000-0000-0000-000000000301",
      title: "prisma upsert helper",
      description: "Idempotent tag upsert against the database.",
      content:
        "export async function upsertTag(prisma, name: string) {\n  return prisma.tag.upsert({\n    where: { name },\n    update: {},\n    create: { name },\n  })\n}",
      language: "typescript",
      isPublic: false,
      slug: null,
      isFavorite: true,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 11 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000302", name: "prisma" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000017",
          name: "Database helpers",
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000303",
      title: "paginate query",
      description: "Wrap any query result in a page shape.",
      content:
        "export async function paginate<T>(page: number, take: number, run: () => Promise<T[]>) {\n  const items = await run()\n  return { items, page, take }\n}",
      language: "typescript",
      isPublic: false,
      slug: null,
      isFavorite: false,
      isArchived: false,
      deletedAt: null,
      createdAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
      tags: [{ id: "00000000-0000-0000-0000-000000000304", name: "prisma" }],
      collections: [
        {
          id: "00000000-0000-0000-0000-000000000017",
          name: "Database helpers",
        },
      ],
    },
  ],
}

export function getCollectionSnippets(id: string): SnippetListItem[] {
  return COLLECTION_SNIPPETS[id] ?? []
}
