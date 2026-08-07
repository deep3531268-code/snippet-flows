"use client";

import * as React from "react";

import { SnippetDialogProvider } from "@/features/snippets/components/snippet-dialog-provider";

function SnippetsPage({ children }: { children?: React.ReactNode }) {
  return <SnippetDialogProvider>{children}</SnippetDialogProvider>;
}

export { SnippetsPage };
