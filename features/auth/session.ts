import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@prisma/client";

import { auth } from "@/lib/auth/server";
import { syncUserWithPrisma } from "@/features/auth/service";
import { isAuthDevBypassEnabled } from "@/features/auth/config";

// Development-only bypass: grants unauthenticated dashboard access only when
// explicitly enabled (AUTH_DEV_BYPASS=true) outside production.
const DEV_USER: User = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "dev@snippetflow.local",
  name: "Dev User",
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function getCurrentUser() {
  if (isAuthDevBypassEnabled()) {
    return syncUserWithPrisma(DEV_USER);
  }

  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return null;
  }

  return syncUserWithPrisma(session.user);
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return user;
}
