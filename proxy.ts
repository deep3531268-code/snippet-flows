import { auth } from "@/lib/auth/server";
import { isAuthDevBypassEnabled } from "@/features/auth/config";
import type { NextRequest } from "next/server";

const protect = auth.middleware({
  loginUrl: "/auth/sign-in",
});

export default function proxy(request: NextRequest) {
  // Development-only bypass: skip dashboard auth checks only when explicitly
  // enabled (AUTH_DEV_BYPASS=true) outside production.
  if (isAuthDevBypassEnabled()) {
    return;
  }

  return protect(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
