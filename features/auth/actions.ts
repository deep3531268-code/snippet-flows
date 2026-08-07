"use server";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/server";
import { signInSchema, signUpSchema } from "@/features/auth/schemas";
import { syncUserWithPrisma } from "@/features/auth/service";

export type AuthActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
} | null;

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms: formData.get("terms") === "on",
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { data, error } = await auth.signUp.email({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message || "Failed to create account" };
  }

  if (data?.user) {
    await syncUserWithPrisma(data.user);
  }

  redirect("/auth/sign-in");
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await auth.signIn.email(parsed.data);

  if (error) {
    return { error: error.message || "Failed to sign in" };
  }

  redirect("/dashboard");
}

export async function signOut() {
  await auth.signOut();
  redirect("/auth/sign-in");
}
