"use client";

import * as React from "react";
import { ArrowDownWideNarrow, LayoutGrid, Rows3 } from "lucide-react";

import {
  IconButton,
  SearchInput,
} from "@/features/dashboard/ui";
import { SNIPPET_LANGUAGES } from "@/features/snippets/languages";
import { languageLabel } from "./language-icon";
import type { SnippetSort } from "@/features/snippets/types";
import { cn } from "@/lib/utils";

const SORTS: { value: SnippetSort; label: string }[] = [
  { value: "updated", label: "Recently updated" },
  { value: "created", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "Title A–Z" },
  { value: "za", label: "Title Z–A" },
];

export type SnippetsView = "grid" | "list";

const SELECT_CLASSES = cn(
  "h-9 w-full min-w-0 rounded-[12px] border border-white/[0.07] bg-white/[0.04] px-3 pr-8 text-sm text-[#e2e8f0]",
  "outline-none transition-colors duration-200",
  "hover:bg-white/[0.07] focus-visible:border-[#2563eb]/60 focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&>option]:bg-[#141f30]",
  "appearance-none",
);

function SnippetsToolbar({
  query,
  onQueryChange,
  language,
  onLanguageChange,
  tag,
  onTagChange,
  tags,
  sort,
  onSortChange,
  view,
  onViewChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  tag: string;
  onTagChange: (value: string) => void;
  tags: string[];
  sort: SnippetSort;
  onSortChange: (value: SnippetSort) => void;
  view: SnippetsView;
  onViewChange: (view: SnippetsView) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchInput
        className="min-w-56 flex-1 basis-64"
        kbd="⌘K"
        data-snippets-search=""
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search snippets…"
        aria-label="Search snippets"
      />

      <label className="sr-only" htmlFor="snippet-filter-language">
        Filter by language
      </label>
      <select
        id="snippet-filter-language"
        value={language}
        onChange={(event) => onLanguageChange(event.target.value)}
        className={cn(SELECT_CLASSES, "w-auto min-w-36")}
      >
        <option value="all">All languages</option>
        {SNIPPET_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {languageLabel(lang)}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="snippet-filter-tag">
        Filter by tag
      </label>
      <select
        id="snippet-filter-tag"
        value={tag}
        onChange={(event) => onTagChange(event.target.value)}
        className={cn(SELECT_CLASSES, "w-auto min-w-32")}
      >
        <option value="all">All tags</option>
        {tags.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="snippet-sort">
        Sort snippets
      </label>
      <div className="relative">
        <ArrowDownWideNarrow
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94a3b8]"
        />
        <select
          id="snippet-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SnippetSort)}
          className={cn(SELECT_CLASSES, "w-auto min-w-44 pl-9")}
        >
          {SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div
        role="group"
        aria-label="View mode"
        className="ml-auto flex items-center gap-1 rounded-[12px] border border-white/[0.07] bg-white/[0.03] p-1"
      >
        <IconButton
          type="button"
          aria-label="Grid view"
          aria-pressed={view === "grid"}
          onClick={() => onViewChange("grid")}
          className={cn(
            "size-8 rounded-lg",
            view === "grid"
              ? "bg-[#2563eb]/20 text-[#7cb3ff]"
              : "text-[#94a3b8]",
          )}
        >
          <LayoutGrid className="size-4" />
        </IconButton>
        <IconButton
          type="button"
          aria-label="List view"
          aria-pressed={view === "list"}
          onClick={() => onViewChange("list")}
          className={cn(
            "size-8 rounded-lg",
            view === "list"
              ? "bg-[#2563eb]/20 text-[#7cb3ff]"
              : "text-[#94a3b8]",
          )}
        >
          <Rows3 className="size-4" />
        </IconButton>
      </div>

      <input type="hidden" name="query" value={query} />
    </div>
  );
}

export { SnippetsToolbar, SORTS };
