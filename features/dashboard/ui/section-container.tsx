import * as React from "react";

import { cn } from "@/lib/utils";

function SectionContainer({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="section-container"
      className={cn("grid gap-6", className)}
      {...props}
    />
  );
}

export { SectionContainer };
