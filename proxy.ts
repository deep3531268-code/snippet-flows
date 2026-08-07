import { auth } from "@/lib/auth/server";
import type { NextRequest } from "next/server";

const protect = auth.middleware({
  loginUrl: "/auth/sign-in",
});

export default function proxy(request: NextRequest) {
  // Temporary D1.2 development bypass: skip dashboard auth checks during development.
  if (process.env.NODE_ENV === "development") {
    return;
  }

  return protect(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
