import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { CodeEditor, CopyButton } from "@/features/snippets/components/code-editor"
import { SNIPPET_LANGUAGE_LABELS } from "@/features/snippets/languages"
import { snippetService } from "@/features/snippets/service"

export const metadata: Metadata = {
  title: "Shared snippet",
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date)
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const snippet = await snippetService.getPublicSnippet(token)

  if (!snippet) {
    notFound()
  }

  const languageLabel =
    SNIPPET_LANGUAGE_LABELS[snippet.language as keyof typeof SNIPPET_LANGUAGE_LABELS] ??
    snippet.language

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-heading text-2xl font-semibold tracking-tight">
            {snippet.title}
          </h1>
          {snippet.description && (
            <p className="mt-1.5 text-sm text-muted-foreground">
              {snippet.description}
            </p>
          )}
        </div>
        <Badge variant="secondary">{languageLabel}</Badge>
      </div>

      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {snippet.tags.map(({ tag }) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      <CodeEditor
        value={snippet.content}
        language={snippet.language}
        readOnly
        toolbar={() => (
          <div className="flex items-center justify-between gap-2 border-b border-input px-3 py-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {languageLabel}
            </span>
            <CopyButton value={snippet.content} />
          </div>
        )}
      />

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>Created {formatDate(snippet.createdAt)}</span>
        <span>Updated {formatDate(snippet.updatedAt)}</span>
      </div>
    </main>
  )
}
