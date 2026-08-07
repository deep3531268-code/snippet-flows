"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/features/snippets/components/code-editor"
import { cn } from "@/lib/utils"

const Kw = ({ children }: { children: React.ReactNode }) => (
  <span className="text-violet-600 dark:text-violet-400">{children}</span>
)

const Ty = ({ children }: { children: React.ReactNode }) => (
  <span className="text-sky-600 dark:text-sky-400">{children}</span>
)

const Fn = ({ children }: { children: React.ReactNode }) => (
  <span className="text-cyan-600 dark:text-cyan-400">{children}</span>
)

const Prop = ({ children }: { children: React.ReactNode }) => (
  <span className="text-zinc-800 dark:text-zinc-200">{children}</span>
)

const Str = ({ children }: { children: React.ReactNode }) => (
  <span className="text-emerald-600 dark:text-emerald-400">{children}</span>
)

const Attr = ({ children }: { children: React.ReactNode }) => (
  <span className="text-rose-500 dark:text-rose-400">{children}</span>
)

const Val = ({ children }: { children: React.ReactNode }) => (
  <span className="text-amber-600 dark:text-amber-400">{children}</span>
)

const Cmt = ({ children }: { children: React.ReactNode }) => (
  <span className="text-zinc-400 italic dark:text-zinc-500">{children}</span>
)

type PreviewLine = React.ReactNode

type PreviewFile = {
  name: string
  language: string
  label: string
  activeLine: number
  content: string
  lines: PreviewLine[]
}

const PREVIEW_FILES: PreviewFile[] = [
  {
    name: "snippets.ts",
    language: "typescript",
    label: "TypeScript",
    activeLine: 2,
    content: `export const snippetRepository = {
  async findMany(userId: string, filter: SnippetFilter) {
    return prisma.snippet.findMany({
      where: { userId, ...filterWhere(filter) },
      include: { tags: true, collections: true },
      orderBy: { updatedAt: "desc" },
    })
  },
}`,
    lines: [
      <>
        <Kw>export</Kw> <Kw>const</Kw> <Fn>snippetRepository</Fn> = {"{"}
      </>,
      <>
        <Kw>async</Kw> <Fn>findMany</Fn>(<Prop>userId</Prop>: <Ty>string</Ty>,{" "}
        <Prop>filter</Prop>: <Ty>SnippetFilter</Ty>) {"{"}
      </>,
      <>
        {"    "}<Kw>return</Kw> <Prop>prisma</Prop>.<Fn>snippet</Fn>.
        <Fn>findMany</Fn>({"{"}
      </>,
      <>
        {"      "}<Prop>where</Prop>: {"{"} <Prop>userId</Prop>, ...
        <Fn>filterWhere</Fn>(<Prop>filter</Prop>) {"}"},
      </>,
      <>
        {"      "}<Prop>include</Prop>: {"{"} <Prop>tags</Prop>:{" "}
        <Val>true</Val>, <Prop>collections</Prop>: <Val>true</Val> {"}"},
      </>,
      <>
        {"      "}<Prop>orderBy</Prop>: {"{"} <Prop>updatedAt</Prop>:{" "}
        <Str>{'"\"desc\"'}</Str> {"}"},
      </>,
      <>{")}"}</>,
      <>{"  },"}</>,
      <>{""}</>,
      <>
        <Cmt>{"// Search, favorite, archive — all in one place."}</Cmt>
      </>,
      <>{""}</>,
      <>{""}</>,
      <>{""}</>,
      <>{""}</>,
    ],
  },
  {
    name: "auth.ts",
    language: "typescript",
    label: "TypeScript",
    activeLine: 13,
    content: `export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { error } = await auth.signIn.email(parsed.data)
  if (error) return { error: error.message }

  redirect("/")
}`,
    lines: [
      <>
        <Kw>export</Kw> <Kw>async</Kw> <Kw>function</Kw> <Fn>signIn</Fn>(
      </>,
      <>
        {"  "}<Prop>_prevState</Prop>: <Ty>AuthActionState</Ty>,
      </>,
      <>
        {"  "}<Prop>formData</Prop>: <Ty>FormData</Ty>,
      </>,
      <>{"  ) {"}</>,
      <>
        {"  "}<Kw>const</Kw> <Fn>parsed</Fn> = <Fn>signInSchema</Fn>.
        <Fn>safeParse</Fn>({"{"}
      </>,
      <>
        {"    "}<Prop>email</Prop>: <Prop>formData</Prop>.<Fn>get</Fn>(
        <Str>{'"\"email\"'}</Str>),
      </>,
      <>
        {"    "}<Prop>password</Prop>: <Prop>formData</Prop>.<Fn>get</Fn>(
        <Str>{'"\"password\"'}</Str>),
      </>,
      <>{"  })"}</>,
      <>{""}</>,
      <>
        {"  "}<Kw>if</Kw> (!<Prop>parsed</Prop>.<Prop>success</Prop>) {"{"}
      </>,
      <>
        {"    "}<Kw>return</Kw> {"{"} <Prop>fieldErrors</Prop>:{" "}
        <Prop>parsed</Prop>.<Prop>error</Prop>.<Fn>flatten</Fn>().<Prop>fieldErrors</Prop>{" "}
        {"}"}
      </>,
      <>{"  }"}</>,
      <>{""}</>,
      <>
        {"  "}<Kw>const</Kw> {"{"} <Prop>error</Prop> {"}"} = <Kw>await</Kw>{" "}
        <Prop>auth</Prop>.<Prop>signIn</Prop>.<Fn>email</Fn>(
        <Prop>parsed</Prop>.<Prop>data</Prop>)
      </>,
      <>
        {"  "}<Kw>if</Kw> (<Prop>error</Prop>) <Kw>return</Kw> {"{"}{" "}
        <Prop>error</Prop>: <Prop>error</Prop>.<Prop>message</Prop> {"}"}
      </>,
      <>{""}</>,
      <>
        {"  "}<Fn>redirect</Fn>(<Str>{'"\"/\"'}</Str>)
      </>,
      <>{""}</>,
      <>{""}</>,
      <>{""}</>,
    ],
  },
  {
    name: "prisma.ts",
    language: "prisma",
    label: "Prisma",
    activeLine: 1,
    content: `model Snippet {
  id         String   @id @default(uuid()) @db.Uuid
  title      String   @map("title") @db.VarChar(200)
  content    String
  language   String   @default("plaintext")
  isPublic   Boolean  @default(false)
  isFavorite Boolean  @default(false)
  isArchived Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  userId     String   @map("user_id") @db.Uuid

  @@index([userId, createdAt(sort: Desc)])
  @@map("snippets")
}`,
    lines: [
      <>
        <Kw>model</Kw> <Ty>Snippet</Ty> {"{"}
      </>,
      <>
        {"  "}<Prop>id</Prop>{"         "}<Ty>String</Ty>{"   "}<Attr>@id</Attr>{" "}
        <Attr>@default</Attr>(<Fn>uuid</Fn>()) <Attr>@db.Uuid</Attr>
      </>,
      <>
        {"  "}<Prop>title</Prop>{"      "}<Ty>String</Ty>{"   "}<Attr>@map</Attr>(
        <Str>{'"\"title\"'}</Str>) <Attr>@db.VarChar</Attr>(200)
      </>,
      <>
        {"  "}<Prop>content</Prop>{"    "}<Ty>String</Ty>
      </>,
      <>
        {"  "}<Prop>language</Prop>{"   "}<Ty>String</Ty>{"   "}<Attr>@default</Attr>(
        <Str>{'"\"plaintext\"'}</Str>)
      </>,
      <>
        {"  "}<Prop>isPublic</Prop>{"   "}<Ty>Boolean</Ty>{"  "}<Attr>@default</Attr>(
        <Val>false</Val>)
      </>,
      <>
        {"  "}<Prop>isFavorite</Prop>{" "}<Ty>Boolean</Ty>{"  "}<Attr>@default</Attr>(
        <Val>false</Val>)
      </>,
      <>
        {"  "}<Prop>isArchived</Prop>{" "}<Ty>Boolean</Ty>{"  "}<Attr>@default</Attr>(
        <Val>false</Val>)
      </>,
      <>
        {"  "}<Prop>createdAt</Prop>{"  "}<Ty>DateTime</Ty>{" "}<Attr>@default</Attr>(
        <Fn>now</Fn>())
      </>,
      <>
        {"  "}<Prop>updatedAt</Prop>{"  "}<Ty>DateTime</Ty>{" "}<Attr>@updatedAt</Attr>
      </>,
      <>
        {"  "}<Prop>userId</Prop>{"     "}<Ty>String</Ty>{"   "}<Attr>@map</Attr>(
        <Str>{'"\"user_id\"'}</Str>) <Attr>@db.Uuid</Attr>
      </>,
      <>{""}</>,
      <>
        {"  "}<Attr>@@index</Attr>([<Prop>userId</Prop>, <Prop>createdAt</Prop>(
        <Prop>sort</Prop>: <Ty>Desc</Ty>)])
      </>,
      <>
        {"  "}<Attr>@@map</Attr>(<Str>{'"\"snippets\"'}</Str>)
      </>,
      <>{""}</>,
      <>{""}</>,
      <>{""}</>,
    ],
  },
]

export function LiveCodePreview() {
  const [activeFile, setActiveFile] = React.useState(PREVIEW_FILES[0])

  return (
    <div
      className="relative mx-auto w-full max-w-xl animate-slide-up motion-reduce:animate-none lg:max-w-none"
      style={{ animationDelay: "0.3s", animationFillMode: "both" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl bg-primary/10 blur-2xl"
      />
      <div className="overflow-hidden rounded-xl border bg-card/80 shadow-float backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-card/60 hover:-translate-y-1 hover:shadow-lifted">
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-3 py-2">
          <div
            className="flex shrink-0 gap-1.5 transition-transform duration-200 hover:scale-105"
            aria-hidden
          >
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>

          <div
            role="tablist"
            aria-label="Example files"
            className="-mb-px flex min-w-0 flex-1 gap-0.5 overflow-x-auto"
          >
            {PREVIEW_FILES.map((file) => {
              const active = file.name === activeFile.name
              return (
                <button
                  key={file.name}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  aria-controls="live-code-preview-panel"
                  onClick={() => setActiveFile(file)}
                  className={cn(
                    "relative shrink-0 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {file.name}
                  {active && (
                    <motion.span
                      layoutId="live-code-preview-active-tab"
                      className="absolute inset-x-1 -bottom-px h-px bg-foreground"
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2 transition-transform duration-200 hover:scale-105">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {activeFile.label}
            </Badge>
            <CopyButton value={activeFile.content} size="icon-sm" />
          </div>
        </div>

        <div
          id="live-code-preview-panel"
          role="tabpanel"
          className="h-[480px] overflow-auto bg-background/40"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeFile.name}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-w-fit py-3 pr-4 font-mono text-[13px] leading-6"
            >
              {activeFile.lines.map((line, index) => {
                const active = index === activeFile.activeLine
                return (
                  <div
                    key={`${activeFile.name}-${index}`}
                    className={cn(
                      "flex whitespace-pre",
                      active && "bg-muted/60",
                    )}
                  >
                    <span
                      className={cn(
                        "w-12 shrink-0 pl-4 pr-4 text-right select-none",
                        active
                          ? "text-foreground/80"
                          : "text-muted-foreground/50",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {line}
                    </span>
                    {active && (
                      <motion.span
                        aria-hidden
                        className="ml-1 inline-block h-[1.1em] w-[2px] self-center bg-foreground/80"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.1,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
