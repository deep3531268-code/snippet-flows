import * as React from "react";
import { Folder } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DashboardButton,
  DashboardCard,
  EmptyState,
  SectionHeader,
} from "@/features/dashboard/ui";

function Collections({
  className,
}: {
  className?: string;
}) {
  return (
    <DashboardCard className={cn("flex flex-col gap-5", className)}>
      <SectionHeader
        title="Collections"
        description="Organize your snippets"
        action={
          <DashboardButton variant="secondary" size="sm">
            View all
          </DashboardButton>
        }
      />
      <EmptyState
        icon={Folder}
        title="No collections yet"
        description="Create a collection to keep related snippets together."
        className="min-h-[280px] flex-1 border-0 bg-transparent shadow-none"
      >
        <DashboardButton size="sm">New Collection</DashboardButton>
      </EmptyState>
    </DashboardCard>
  );
}

export { Collections };
