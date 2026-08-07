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
  IconButton,
} from "@/features/dashboard/ui";
import { LanguageIcon, languageLabel } from "./language-icon";
import { timeAgo } from "./utils";
import { cn } from "@/lib/utils";

function SnippetRow({
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
    <div
      className="group flex cursor-pointer items-center gap-4 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-white/[0.04]"
      onClick={onEdit}
    >
      <LanguageIcon language={snippet.language} size="sm" />

      <div className="grid min-w-0 flex-1 gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-[#e8edf5]">
            {snippet.title}
          </span>
          <span className="hidden shrink-0 text-xs text-[#7d8ba3] sm:inline">
            {languageLabel(snippet.language)}
          </span>
        </div>
        {snippet.description ? (
          <p className="line-clamp-1 truncate text-xs text-[#94a3b8]">
            {snippet.description}
          </p>
        ) : (
          <p className="text-xs text-[#5b6b82]">No description</p>
        )}
      </div>

      <div className="hidden shrink-0 items-center gap-1.5 md:flex">
        {snippet.tags.slice(0, 2).map((tag) => (
          <DashboardBadge key={tag.id} variant="secondary" className="text-xs">
            {tag.name}
          </DashboardBadge>
        ))}
      </div>

      <span className="hidden shrink-0 text-xs text-[#7d8ba3] lg:inline">
        {timeAgo(snippet.updatedAt)}
      </span>

      <div className="flex shrink-0 items-center gap-0.5">
        <IconButton
          type="button"
          aria-label={
            snippet.isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          aria-pressed={snippet.isFavorite}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
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
              onClick={(event) => event.stopPropagation()}
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
  );
}

export { SnippetRow };
