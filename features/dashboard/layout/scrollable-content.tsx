import * as React from "react";

import { cn } from "@/lib/utils";

function ScrollableContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="scrollable-content"
      data-lenis-prevent
      className={cn(
        "h-full min-h-0 overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

export { ScrollableContent };
