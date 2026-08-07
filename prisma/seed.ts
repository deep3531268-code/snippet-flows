import { PrismaClient } from "@prisma/client"
import { randomUUID } from "node:crypto"

const prisma = new PrismaClient()

const DEMO_USER_EMAIL = "demo@snippetflow.dev"

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `${base}-${randomUUID().slice(0, 8)}`
}

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: {
      id: randomUUID(),
      email: DEMO_USER_EMAIL,
      name: "Demo User",
    },
  })

  const existingSnippets = await prisma.snippet.count({
    where: { userId: demoUser.id },
  })
  if (existingSnippets > 0) {
    console.log("Demo data already exists. Seeding skipped.")
    return
  }

  const frontend = await prisma.collection.create({
    data: {
      userId: demoUser.id,
      name: "Frontend",
      description: "UI and client-side code",
    },
  })
  const backend = await prisma.collection.create({
    data: {
      userId: demoUser.id,
      name: "Backend",
      description: "Server and API code",
    },
  })

  const reactTag = await prisma.tag.create({
    data: { userId: demoUser.id, name: "react" },
  })
  const nodeTag = await prisma.tag.create({
    data: { userId: demoUser.id, name: "node" },
  })

  const reactSnippet = await prisma.snippet.create({
    data: {
      userId: demoUser.id,
      title: "useToggle hook",
      description: "A small React hook for boolean state.",
      language: "typescript",
      isPublic: true,
      slug: slugify("useToggle hook"),
      content: `import { useCallback, useState } from "react"

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn((value) => !value), [])
  return [on, toggle] as const
}`,
      collections: { create: [{ collectionId: frontend.id }] },
      tags: { create: [{ tagId: reactTag.id }] },
    },
  })

  const nodeSnippet = await prisma.snippet.create({
    data: {
      userId: demoUser.id,
      title: "Debounce utility",
      description: "Generic debounce function for async callbacks.",
      language: "typescript",
      isPublic: false,
      content: `export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait = 300
) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}`,
      collections: { create: [{ collectionId: backend.id }] },
      tags: { create: [{ tagId: nodeTag.id }] },
    },
  })

  console.log(`Seeded demo user: ${demoUser.email}`)
  console.log(`Seeded collections: ${frontend.name}, ${backend.name}`)
  console.log(`Seeded tags: ${reactTag.name}, ${nodeTag.name}`)
  console.log(`Seeded snippets: ${reactSnippet.title}, ${nodeSnippet.title}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
