import { prisma } from "@/lib/prisma";

export type NeonAuthUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

export async function syncUserWithPrisma(authUser: NeonAuthUser) {
  const email = authUser.email ?? "";
  return prisma.user.upsert({
    where: { id: authUser.id },
    update: {
      email,
      name: authUser.name ?? null,
      avatarUrl: authUser.image ?? null,
    },
    create: {
      id: authUser.id,
      email,
      name: authUser.name ?? null,
      avatarUrl: authUser.image ?? null,
    },
  });
}
