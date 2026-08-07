"use client";

import * as React from "react";
import { useState } from "react";
import { Check, Copy, Maximize2, Minimize2, WrapText } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  DashboardButton,
  DashboardInput,
  IconButton,
} from "@/features/dashboard/ui";
import { CodeEditor, type EditorToolbarControls } from "@/features/snippets/components/code-editor";
import { SNIPPET_LANGUAGES } from "@/features/snippets/languages";
import { createSnippetSchema } from "@/features/snippets/schemas";
import { languageLabel } from "./language-icon";
import { cn } from "@/lib/utils";

export type SnippetDraft = {
  title: string;
  description: string | null;
  content: string;
  language: string;
  isPublic: boolean;
  tags: { id: string; name: string }[];
};

type EditableSnippet = {
  id: string;
  title: string;
  description: string | null;
  content: string;
  language: string;
  isPublic: boolean;
  tags: { id: string; name: string }[];
};

const SELECT_CLASSES = cn(
  "h-9 w-full min-w-0 rounded-[12px] border border-white/[0.07] bg-white/[0.04] px-3 text-sm text-[#e2e8f0]",
  "outline-none transition-colors duration-200",
  "hover:bg-white/[0.07] focus-visible:border-[#2563eb]/60 focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:opacity-50",
);

function EditorToolbar({
  language,
  onLanguageChange,
  code,
  isFullscreen,
  onToggleFullscreen,
  wrapEnabled,
  onToggleWrap,
}: {
  language: string;
  onLanguageChange?: (language: string) => void;
  code: string;
} & EditorToolbarControls) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable; ignore.
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] bg-white/[0.03] px-2 py-1.5">
      <select
        aria-label="Language"
        value={language}
        onChange={(event) => onLanguageChange?.(event.target.value)}
        className={cn(
          SELECT_CLASSES,
          "h-7 w-auto rounded-md px-2 text-xs [&>option]:bg-[#141f30]",
        )}
      >
        {SNIPPET_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {languageLabel(lang)}
          </option>
        ))}
      </select>

      <div className="flex shrink-0 items-center gap-0.5">
        <IconButton
          type="button"
          aria-label="Toggle word wrap"
          aria-pressed={wrapEnabled}
          onClick={onToggleWrap}
          className={cn("size-8", wrapEnabled && "bg-[#2563eb]/20 text-[#7cb3ff]")}
        >
          <WrapText className="size-3.5" />
        </IconButton>
        <IconButton
          type="button"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          aria-pressed={isFullscreen}
          onClick={onToggleFullscreen}
          className={cn("size-8", isFullscreen && "bg-[#2563eb]/20 text-[#7cb3ff]")}
        >
          {isFullscreen ? (
            <Minimize2 className="size-3.5" />
          ) : (
            <Maximize2 className="size-3.5" />
          )}
        </IconButton>
        <IconButton
          type="button"
          aria-label="Copy code"
          onClick={copy}
          className="size-8"
        >
          {copied ? (
            <Check className="size-3.5 text-[#4ade80]" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </IconButton>
      </div>
    </div>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p role="alert" className="text-xs text-[#fb7185]">
      {errors[0]}
    </p>
  );
}

function SnippetForm({
  snippet,
  onSave,
  onClose,
}: {
  snippet: EditableSnippet | null;
  onSave: (draft: SnippetDraft) => void;
  onClose: () => void;
}) {
  const isEdit = Boolean(snippet);

  const [title, setTitle] = useState(snippet?.title ?? "");
  const [description, setDescription] = useState(snippet?.description ?? "");
  const [content, setContent] = useState(snippet?.content ?? "");
  const [language, setLanguage] = useState(snippet?.language ?? "plaintext");
  const [tagsText, setTagsText] = useState(
    snippet?.tags.map((tag) => tag.name).join(", ") ?? "",
  );
  const [isPublic, setIsPublic] = useState(snippet?.isPublic ?? false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const parsed = createSnippetSchema.safeParse({
      title,
      description,
      content,
      language,
      isPublic,
    });

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setFieldErrors({});

    const tags = [
      ...new Set(
        tagsText
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ].map((name) => ({ id: crypto.randomUUID(), name }));

    onSave({
      title: parsed.data.title,
      description: parsed.data.description,
      content: parsed.data.content,
      language: parsed.data.language,
      isPublic: parsed.data.isPublic,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-5 overflow-y-auto px-6 py-5">
        <div className="grid gap-1.5">
          <label
            htmlFor="snippet-title"
            className="text-sm font-medium text-[#e2e8f0]"
          >
            Title <span className="text-[#fb7185]">*</span>
          </label>
          <DashboardInput
            id="snippet-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="useToggle hook"
            autoFocus
          />
          <FieldError errors={fieldErrors.title} />
        </div>

        <div className="grid gap-1.5">
          <label
            htmlFor="snippet-description"
            className="text-sm font-medium text-[#e2e8f0]"
          >
            Description
          </label>
          <DashboardInput
            id="snippet-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What does this snippet do?"
          />
          <FieldError errors={fieldErrors.description} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <label
              htmlFor="snippet-language"
              className="text-sm font-medium text-[#e2e8f0]"
            >
              Language <span className="text-[#fb7185]">*</span>
            </label>
            <select
              id="snippet-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className={cn(
                SELECT_CLASSES,
                "[&>option]:bg-[#141f30]",
              )}
            >
              {SNIPPET_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {languageLabel(lang)}
                </option>
              ))}
            </select>
            <FieldError errors={fieldErrors.language} />
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="snippet-tags"
              className="text-sm font-medium text-[#e2e8f0]"
            >
              Tags
            </label>
            <DashboardInput
              id="snippet-tags"
              value={tagsText}
              onChange={(event) => setTagsText(event.target.value)}
              placeholder="react, hooks"
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <label
            htmlFor="snippet-code"
            className="text-sm font-medium text-[#e2e8f0]"
          >
            Code <span className="text-[#fb7185]">*</span>
          </label>
          <CodeEditor
            value={content}
            onChange={setContent}
            language={language}
            placeholder="Paste your code here…"
            minHeight="min-h-44"
            toolbar={(controls) => (
              <EditorToolbar
                language={language}
                onLanguageChange={setLanguage}
                code={content}
                {...controls}
              />
            )}
            className="rounded-[12px] border-white/[0.07] bg-[#0a111c] focus-within:border-[#2563eb]/60 focus-within:ring-[#2563eb]/20"
          />
          <FieldError errors={fieldErrors.content} />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
          <div className="grid gap-0.5">
            <p className="text-sm leading-none font-medium text-[#e2e8f0]">
              Public
            </p>
            <p className="text-xs text-[#94a3b8]">
              Anyone with the link can view
            </p>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={setIsPublic}
            aria-label="Make snippet public"
            className="data-[state=unchecked]:bg-white/[0.12]"
          />
        </div>
      </div>

      <DialogFooter className="border-t border-white/[0.06] bg-white/[0.02] px-6 py-4">
        <DashboardButton
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </DashboardButton>
        <DashboardButton type="submit">
          {isEdit ? "Save changes" : "Create snippet"}
        </DashboardButton>
      </DialogFooter>
    </form>
  );
}

function SnippetFormDialog({
  snippet,
  open,
  onOpenChange,
  onSave,
}: {
  snippet: EditableSnippet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (draft: SnippetDraft) => void;
}) {
  const isEdit = Boolean(snippet);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden border-white/[0.08] bg-[#0d1522] p-0 text-[#e8edf5] ring-white/[0.1] sm:max-w-xl"
      >
        <DialogHeader className="border-b border-white/[0.06] px-6 pt-5 pb-4">
          <DialogTitle className="text-[17px] font-semibold text-[#f3f6fb]">
            {isEdit ? "Edit snippet" : "New snippet"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#94a3b8]">
            {isEdit
              ? "Make changes to your snippet."
              : "Store a new snippet in your library."}
          </DialogDescription>
        </DialogHeader>

        <SnippetForm
          key={snippet?.id ?? "create"}
          snippet={snippet}
          onSave={onSave}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export { SnippetFormDialog };
