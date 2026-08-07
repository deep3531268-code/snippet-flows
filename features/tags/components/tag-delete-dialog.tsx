"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"

import { DashboardButton } from "@/features/dashboard/ui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { TagListItem } from "../types"

function TagDeleteDialog({
  tag,
  count,
  onOpenChange,
  onConfirm,
  pending = false,
}: {
  tag: TagListItem | null
  count?: number
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  pending?: boolean
}) {
  const bulk = Boolean(count)
  const open = Boolean(tag) || bulk
  const label = bulk
    ? `Delete ${count} ${count === 1 ? "tag" : "tags"}?`
    : "Delete tag?"

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open && !pending) onOpenChange(false)
      }}
    >
      <DialogContent className="border-white/[0.08] bg-[#0f1826] text-[#e8edf5] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[#f3f6fb]">{label}</DialogTitle>
          <DialogDescription className="text-[#94a3b8]">
            {bulk ? (
              <>
                {count} {count === 1 ? "tag" : "tags"} will be permanently
                removed. This action cannot be undone.
              </>
            ) : (
              <>
                &ldquo;{tag?.name}&rdquo; will be permanently removed. This
                action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DashboardButton
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={pending}
          >
            <Trash2 className="size-4" />
            {pending ? "Deleting…" : "Delete"}
          </DashboardButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { TagDeleteDialog }
