import * as React from "react";
import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";
import { DashboardBadge } from "./dashboard-badge";

function NotificationButton({
  count = 0,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <IconButton
      aria-label={
        count > 0 ? `Notifications (${count} unread)` : "Notifications"
      }
      className={cn("relative", className)}
    >
      <Bell aria-hidden />
      {count > 0 ? (
        <DashboardBadge
          variant="error"
          className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]"
        >
          {count}
        </DashboardBadge>
      ) : null}
    </IconButton>
  );
}

export { NotificationButton };
