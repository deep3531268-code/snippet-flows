"use client"

import * as React from "react"
import { useTransition } from "react"
import { Loader2, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { signOut } from "@/features/auth/actions"
import { cn } from "@/lib/utils"

export function LogoutDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log out of SnippetFlow?</DialogTitle>
          <DialogDescription>
            You&apos;ll need to sign in again to access your snippets.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={pending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() => {
              startTransition(() => {
                signOut()
              })
            }}
          >
            {pending ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              <LogOut className="size-4" aria-hidden />
            )}
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function LogoutButton({ collapsed = false }: { collapsed?: boolean }) {
  const [open, setOpen] = React.useState(false)

  const trigger = (
    <DialogTrigger asChild>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2.5 rounded-md text-[13px] text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground motion-reduce:transition-none",
          collapsed ? "justify-center px-0" : "px-2.5",
        )}
        aria-label="Log out"
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        {!collapsed && "Logout"}
      </Button>
    </DialogTrigger>
  )

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Logout
            </TooltipContent>
          </Tooltip>
        ) : (
          trigger
        )}
      </Dialog>
      <LogoutDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
