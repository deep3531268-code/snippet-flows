import "server-only";

// Development-only unauthenticated access. Must be explicitly opted in with
// AUTH_DEV_BYPASS=true and can never activate when NODE_ENV=production, so a
// misconfigured environment cannot silently expose protected routes.
export function isAuthDevBypassEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.AUTH_DEV_BYPASS === "true"
  );
}
