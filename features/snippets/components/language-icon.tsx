import * as React from "react";
import {
  Braces,
  Database,
  FileCode2,
  FileText,
  Globe,
  Palette,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SNIPPET_LANGUAGE_LABELS } from "@/features/snippets/languages";

type LanguageMeta = {
  icon: LucideIcon;
  className: string;
};

const LANGUAGE_META: Record<string, LanguageMeta> = {
  javascript: { icon: Braces, className: "bg-[#fbbf24]/15 text-[#fbbf24] ring-[#fbbf24]/25" },
  jsx: { icon: Braces, className: "bg-[#fbbf24]/15 text-[#fbbf24] ring-[#fbbf24]/25" },
  typescript: { icon: Braces, className: "bg-[#60a5fa]/15 text-[#60a5fa] ring-[#60a5fa]/25" },
  tsx: { icon: Braces, className: "bg-[#60a5fa]/15 text-[#60a5fa] ring-[#60a5fa]/25" },
  python: { icon: Terminal, className: "bg-[#34d399]/15 text-[#34d399] ring-[#34d399]/25" },
  go: { icon: FileCode2, className: "bg-[#22d3ee]/15 text-[#22d3ee] ring-[#22d3ee]/25" },
  rust: { icon: FileCode2, className: "bg-[#fb923c]/15 text-[#fb923c] ring-[#fb923c]/25" },
  java: { icon: FileCode2, className: "bg-[#f87171]/15 text-[#f87171] ring-[#f87171]/25" },
  c: { icon: FileCode2, className: "bg-[#60a5fa]/15 text-[#60a5fa] ring-[#60a5fa]/25" },
  cpp: { icon: FileCode2, className: "bg-[#60a5fa]/15 text-[#60a5fa] ring-[#60a5fa]/25" },
  csharp: { icon: FileCode2, className: "bg-[#a78bfa]/15 text-[#a78bfa] ring-[#a78bfa]/25" },
  css: { icon: Palette, className: "bg-[#f472b6]/15 text-[#f472b6] ring-[#f472b6]/25" },
  html: { icon: Globe, className: "bg-[#fb923c]/15 text-[#fb923c] ring-[#fb923c]/25" },
  json: { icon: Braces, className: "bg-[#fbbf24]/15 text-[#fbbf24] ring-[#fbbf24]/25" },
  sql: { icon: Database, className: "bg-[#34d399]/15 text-[#34d399] ring-[#34d399]/25" },
  bash: { icon: Terminal, className: "bg-[#94a3b8]/15 text-[#94a3b8] ring-[#94a3b8]/25" },
  yaml: { icon: FileCode2, className: "bg-[#2dd4bf]/15 text-[#2dd4bf] ring-[#2dd4bf]/25" },
  markdown: { icon: FileText, className: "bg-[#94a3b8]/15 text-[#94a3b8] ring-[#94a3b8]/25" },
  plaintext: { icon: FileText, className: "bg-[#94a3b8]/15 text-[#94a3b8] ring-[#94a3b8]/25" },
};

function languageLabel(language: string) {
  return (
    SNIPPET_LANGUAGE_LABELS[language as keyof typeof SNIPPET_LANGUAGE_LABELS] ??
    language
  );
}

function LanguageIcon({
  language,
  size = "md",
  className,
}: {
  language: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = LANGUAGE_META[language] ?? LANGUAGE_META.plaintext;
  const Icon = meta.icon;
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[10px] ring-1",
        size === "sm" ? "size-8" : "size-10",
        meta.className,
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-4" : "size-5"} />
    </div>
  );
}

export { LanguageIcon, languageLabel, LANGUAGE_META };
