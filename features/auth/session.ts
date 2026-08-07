import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@prisma/client";

import { auth } from "@/lib/auth/server";
import { syncUserWithPrisma } from "@/features/auth/service";

// Temporary D1.2 development bypass: grants unauthenticated dashboard access.
const DEV_USER: User = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "dev@snippetflow.local",
  name: "Dev User",
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function getCurrentUser() {
  // Temporary D1.2 development bypass: skip session checks during development.
  if (process.env.NODE_ENV === "development") {
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
