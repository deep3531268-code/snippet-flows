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
import type { CollectionListItem } from "../types"

function CollectionDeleteDialog({
  collection,
  count,
  onOpenChange,
  onConfirm,
  pending = false,
}: {
  collection: CollectionListItem | null
  count?: number
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  pending?: boolean
}) {
  const bulk = Boolean(count)
  const open = Boolean(collection) || bulk
  const label = bulk
    ? `Delete ${count} ${count === 1 ? "collection" : "collections"}?`
    : "Delete collection?"

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
                {count}{" "}
                {count === 1 ? "collection" : "collections"} will be
                permanently removed. This action cannot be undone.
              </>
            ) : (
              <>
                &ldquo;{collection?.name}&rdquo; will be permanently removed.
                This action cannot be undone.
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

export { CollectionDeleteDialog }
