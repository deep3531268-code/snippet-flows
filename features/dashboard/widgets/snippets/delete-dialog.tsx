"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardButton } from "@/features/dashboard/ui";

function DeleteDialog({
  snippet,
  onOpenChange,
  onConfirm,
}: {
  snippet: { id: string; title: string } | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const open = Boolean(snippet);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-white/[0.08] bg-[#0d1522] text-[#e8edf5] ring-white/[0.1] sm:max-w-sm"
      >
        <DialogHeader>
          <DialogTitle className="text-[17px] font-semibold text-[#f3f6fb]">
            Delete snippet?
          </DialogTitle>
          <DialogDescription className="text-sm text-[#94a3b8]">
            &ldquo;{snippet?.title}&rdquo; will be moved to trash. You can
            restore it later from Trash.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DashboardButton
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            variant="destructive"
            onClick={onConfirm}
          >
            <Trash2 className="size-4" />
            Delete
          </DashboardButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteDialog };
