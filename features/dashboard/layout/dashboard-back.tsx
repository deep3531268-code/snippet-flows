"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { IconButton } from "@/features/dashboard/ui";

function DashboardBack({
  fallback,
  className,
}: {
  fallback: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <IconButton
      type="button"
      aria-label="Go back"
      className={cn("size-9", className)}
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallback);
        }
      }}
    >
      <ArrowLeft aria-hidden className="size-4" />
    </IconButton>
  );
}

export { DashboardBack };
