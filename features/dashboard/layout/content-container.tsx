import * as React from "react";

import { cn } from "@/lib/utils";

function ContentContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-container"
      className={cn(
        "mx-auto w-full max-w-[1200px] px-8 py-8 lg:px-10",
        className,
      )}
      {...props}
    />
  );
}

export { ContentContainer };
