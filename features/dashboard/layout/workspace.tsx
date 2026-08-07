import * as React from "react";

import { cn } from "@/lib/utils";
import {
  SectionContainer,
  SectionHeader,
} from "@/features/dashboard/ui";
import { ScrollableContent } from "./scrollable-content";
import { ContentContainer } from "./content-container";

function Workspace({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <SectionContainer
      data-slot="workspace"
      className={cn(
        "h-full min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)]",
        className,
      )}
    >
      {title || description || action ? (
        <div className="px-6 pt-6">
          <SectionHeader
            title={title}
            description={description}
            action={action}
          />
        </div>
      ) : null}
      <ScrollableContent>
        <ContentContainer>{children}</ContentContainer>
      </ScrollableContent>
    </SectionContainer>
  );
}

export { Workspace };
