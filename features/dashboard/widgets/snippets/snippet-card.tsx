"use client";

import * as React from "react";
import {
  EllipsisVertical,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DashboardBadge,
  DashboardCard,
  IconButton,
} from "@/features/dashboard/ui";
import { LanguageIcon, languageLabel } from "./language-icon";
import { timeAgo } from "./utils";
import { cn } from "@/lib/utils";

function SnippetCard({
  snippet,
  onEdit,
  onDelete,
  onToggleFavorite,
}: {
  snippet: {
    id: string;
    title: string;
    description: string | null;
    language: string;
    updatedAt: string;
    isFavorite: boolean;
    tags: { id: string; name: string }[];
  };
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <DashboardCard
      interactive
      className="group flex h-full cursor-pointer flex-col gap-4 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <LanguageIcon language={snippet.language} />
          <div className="grid min-w-0 gap-0.5">
            <h3
              className="truncate text-sm font-semibold text-[#f3f6fb]"
              title={snippet.title}
            >
              {snippet.title}
            </h3>
            <p className="truncate text-xs text-[#94a3b8]">
              {languageLabel(snippet.language)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton
            type="button"
            aria-label={
              snippet.isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            aria-pressed={snippet.isFavorite}
            onClick={onToggleFavorite}
            className="size-8"
          >
            <Star
              className={cn(
                "size-4 transition-colors",
                snippet.isFavorite
                  ? "fill-[#fbbf24] text-[#fbbf24]"
                  : "text-[#94a3b8]",
              )}
            />
          </IconButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                type="button"
                aria-label="Snippet actions"
                className="size-8"
              >
                <EllipsisVertical className="size-4" />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 border-white/[0.08] bg-[#141f30] text-[#e8edf5] ring-white/[0.1]"
            >
              <DropdownMenuItem
                onSelect={onEdit}
                className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]"
              >
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem
                variant="destructive"
                onSelect={onDelete}
                className="data-[variant=destructive]:text-[#fb7185] data-[variant=destructive]:focus:bg-[#fb7185]/10"
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {snippet.description ? (
        <p className="line-clamp-2 text-sm text-[#94a3b8]">
          {snippet.description}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {snippet.tags.length > 0 ? (
          snippet.tags.map((tag) => (
            <DashboardBadge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </DashboardBadge>
          ))
        ) : (
          <span className="text-xs text-[#5b6b82]">No tags</span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-[#7d8ba3]">
        <span>Updated {timeAgo(snippet.updatedAt)}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#4ade80]" />
          {snippet.isFavorite ? "Favorite" : "Private"}
        </span>
      </div>
    </DashboardCard>
  );
}

export { SnippetCard };
