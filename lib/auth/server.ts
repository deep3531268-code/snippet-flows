import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";

// Required server secrets. In production a missing value fails fast with a
// clear message instead of silently degrading; in development the value may be
// absent (the dev auth bypass path does not use Neon Auth).
function requiredEnv(name: string): string | undefined {
  const value = process.env[name];
  if (process.env.NODE_ENV === "production" && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? undefined;
}

export const auth = createNeonAuth({
  baseUrl: requiredEnv("NEON_AUTH_BASE_URL")!,
  cookies: {
    secret: requiredEnv("NEON_AUTH_COOKIE_SECRET")!,
  },
  logLevel: "warn",
});
