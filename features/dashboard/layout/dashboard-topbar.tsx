"use client"

import * as React from "react";
import { Import, Moon, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DashboardButton,
  IconButton,
  NotificationButton,
  SearchInput,
} from "@/features/dashboard/ui";
import { useOpenSnippetCreate } from "@/features/snippets/components/snippet-dialog-provider";
import { dashboardColors } from "@/features/dashboard/theme";

function DashboardTopbar({
  className,
  ...props
}: React.ComponentProps<"header">) {
  const openCreate = useOpenSnippetCreate();

  return (
    <header
      data-slot="dashboard-topbar"
      className={cn(
        "flex h-[72px] shrink-0 items-center gap-4 px-6",
        dashboardColors.glass,
        "border-b border-white/[0.07]",
        className,
      )}
      {...props}
    >
      <SearchInput
        className="w-full max-w-[450px]"
        kbd="⌘K"
        placeholder="Search snippets, collections, tags..."
      />

      <div className="ml-auto flex items-center gap-2.5">
        <DashboardButton variant="secondary" size="sm">
          <Import aria-hidden className="size-4" />
          Import
        </DashboardButton>
        <DashboardButton size="sm" onClick={openCreate}>
          <Plus aria-hidden className="size-4" />
          New Snippet
        </DashboardButton>

        <div aria-hidden className="mx-1 h-5 w-px bg-white/[0.08]" />

        <IconButton aria-label="Toggle theme">
          <Moon aria-hidden />
        </IconButton>
        <NotificationButton count={3} />
      </div>
    </header>
  );
}

export { DashboardTopbar };
