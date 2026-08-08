import { CATEGORIES, SUPPORTED_LANGUAGES, TAG_POOL } from "./constants"
import { slugify } from "./ids"

export type SnippetSeed = {
  title: string
  description: string
  language: (typeof SUPPORTED_LANGUAGES)[number]
  collection: (typeof CATEGORIES)[number]
  tags: string[]
  content: string
}

export const SNIPPETS: SnippetSeed[] = [
// ── Authentication ──────────────────────────────────────────────────────────
  {
    title: "JWT Login",
    description: "Sign a short-lived JWT after verifying user credentials.",
    language: "typescript",
    collection: "Authentication",
    tags: ["jwt", "auth"],
    content: `import { sign } from "jsonwebtoken"

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email)
  const valid = user && (await verifyPassword(password, user.passwordHash))
  if (!valid) {
    throw new Error("invalid_credentials")
  }
  const token = sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  })
  return { token, user: { id: user.id, email: user.email, role: user.role } }
}`,
  },
  {
    title: "JWT Middleware",
    description: "Express middleware that verifies a Bearer token and attaches the user.",
    language: "typescript",
    collection: "Authentication",
    tags: ["jwt", "middleware", "auth"],
    content: `import { verify, type JwtPayload } from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null
  if (!token) {
    res.status(401).json({ error: "missing_token" })
    return
  }
  try {
    const payload = verify(token, process.env.JWT_SECRET!) as JwtPayload
    res.locals.userId = payload.sub
    next()
  } catch {
    res.status(401).json({ error: "invalid_token" })
  }
}`,
  },
  {
    title: "JWT Refresh",
    description: "Exchange a valid refresh token for a new access token.",
    language: "typescript",
    collection: "Authentication",
    tags: ["jwt", "auth"],
    content: `import { sign, verify } from "jsonwebtoken"

export async function refreshToken(refreshToken: string) {
  const payload = verify(refreshToken, process.env.REFRESH_SECRET!) as {
    sub: string
  }
  const session = await findSessionByToken(refreshToken)
  if (!session || session.revokedAt) {
    throw new Error("invalid_refresh_token")
  }
  const accessToken = sign({ sub: payload.sub }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  })
  return { accessToken }
}`,
  },
  {
    title: "JWT Logout",
    description: "Revoke the current session and blacklist its token.",
    language: "typescript",
    collection: "Authentication",
    tags: ["jwt", "auth"],
    content: `export async function logout(userId: string, token: string) {
  const session = await findSessionByToken(token)
  if (session) {
    await prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    })
  }
  await redis.del(\`session:\${token}\`)
  return { ok: true }
}`,
  },
  {
    title: "BetterAuth Login",
    description: "Configure better-auth with email and password providers.",
    language: "typescript",
    collection: "Authentication",
    tags: ["better-auth", "auth"],
    content: `import { betterAuth } from "better-auth"

export const auth = betterAuth({
  database: prisma,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
})`,
  },
  {
    title: "BetterAuth Middleware",
    description: "Protect Next.js API routes with the better-auth session.",
    language: "typescript",
    collection: "Authentication",
    tags: ["better-auth", "middleware", "auth"],
    content: `import { auth } from "@/lib/auth"
import type { NextRequest } from "next/server"

export async function getSessionUser(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) {
    return null
  }
  return { id: session.user.id, email: session.user.email }
}`,
  },
  {
    title: "BetterAuth Session",
    description: "Read and validate the current session inside a route handler.",
    language: "typescript",
    collection: "Authentication",
    tags: ["better-auth", "auth"],
    content: `import { auth } from "@/lib/auth"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  return NextResponse.json({ user: session.user })
}`,
  },
  {
    title: "Go JWT Middleware",
    description: "net/http middleware that parses and validates a JWT.",
    language: "go",
    collection: "Authentication",
    tags: ["jwt", "middleware", "auth"],
    content: `package auth

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(secret string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		token := strings.TrimPrefix(header, "Bearer ")
		parsed, err := jwt.Parse(token, func(t *jwt.Token) (any, error) {
			return []byte(secret), nil
		})
		if err != nil || !parsed.Valid {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}`,
  },
  {
    title: "Python OAuth2 Client",
    description: "Exchange an OAuth2 authorization code for tokens.",
    language: "python",
    collection: "Authentication",
    tags: ["oauth", "auth"],
    content: `import requests

TOKEN_URL = "https://provider.example.com/token"


def exchange_code(code: str, redirect_uri: str) -> dict:
    response = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json()`,
  },
  {
    title: "Password Reset Flow",
    description: "Issue a reset token, validate it, and update the password.",
    language: "typescript",
    collection: "Authentication",
    tags: ["auth", "middleware"],
    content: `import { randomBytes } from "node:crypto"

export async function requestPasswordReset(email: string) {
  const user = await findUserByEmail(email)
  if (!user) return { ok: true }
  const token = randomBytes(32).toString("hex")
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      tokenHash: await hash(token),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  })
  await sendEmail(user.email, "reset-password", { token })
  return { ok: true }
}`,
  },
  {
    title: "Email Verification Token",
    description: "Generate and consume a signed email verification token.",
    language: "typescript",
    collection: "Authentication",
    tags: ["auth", "jwt"],
    content: `import { sign, verify } from "jsonwebtoken"

export function createVerificationToken(userId: string) {
  return sign({ sub: userId, purpose: "verify-email" }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  })
}

export function verifyEmailToken(token: string) {
  const payload = verify(token, process.env.JWT_SECRET!)
  if (payload.purpose !== "verify-email") {
    throw new Error("invalid_purpose")
  }
  return payload.sub as string
}`,
  },
  {
    title: "Session Cookie Helper",
    description: "Read, write, and clear an httpOnly session cookie.",
    language: "javascript",
    collection: "Authentication",
    tags: ["auth", "middleware"],
    content: `const COOKIE_NAME = "session"

export function getSessionId(req) {
  return req.cookies?.[COOKIE_NAME] ?? null
}

export function setSessionCookie(res, sessionId, maxAge) {
  res.cookie(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  })
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" })
}`,
  },
  {
    title: "CSRF Token Middleware",
    description: "Issue and validate CSRF tokens for state-changing requests.",
    language: "typescript",
    collection: "Authentication",
    tags: ["middleware", "auth"],
    content: `import { randomBytes } from "node:crypto"
import type { Request, Response, NextFunction } from "express"

const TOKENS = new Map<string, { value: string; expiresAt: number }>()

export function csrfProtect(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const token = randomBytes(24).toString("hex")
    TOKENS.set(token, { value: token, expiresAt: Date.now() + 3600_000 })
    res.locals.csrfToken = token
    return next()
  }
  const sent = req.headers["x-csrf-token"] as string | undefined
  const stored = sent ? TOKENS.get(sent) : null
  if (!stored || stored.expiresAt < Date.now()) {
    res.status(403).json({ error: "invalid_csrf" })
    return
  }
  TOKENS.delete(sent!)
  next()
}`,
  },
  {
    title: "Login Rate Limiter",
    description: "Limit failed login attempts per email address.",
    language: "typescript",
    collection: "Authentication",
    tags: ["middleware", "auth"],
    content: `import { Redis } from "ioredis"

const redis = new Redis(process.env.REDIS_URL!)

export async function isRateLimited(key: string) {
  const attempts = await redis.incr(\`login:\${key}\`)
  if (attempts === 1) await redis.expire(\`login:\${key}\`, 60 * 15)
  return attempts > 5
}

export async function resetAttempts(key: string) {
  await redis.del(\`login:\${key}\`)
}`,
  },
  {
    title: "Role-Based Access Control",
    description: "Guard routes by role using an allowlist of permitted roles.",
    language: "typescript",
    collection: "Authentication",
    tags: ["auth", "middleware"],
    content: `export type Role = "user" | "admin" | "moderator"

const ROLE_RANK: Record<Role, number> = {
  user: 1,
  moderator: 2,
  admin: 3,
}

export function requireRole(role: Role) {
  return (current: Role) => {
    if (ROLE_RANK[current] < ROLE_RANK[role]) {
      throw new Error("forbidden")
    }
    return true
  }
}`,
  },
  {
    title: "Permission Guard",
    description: "Check granular permissions on an API request.",
    language: "typescript",
    collection: "Authentication",
    tags: ["auth", "middleware"],
    content: `type Permission = "read" | "write" | "delete"

const PERMISSIONS: Record<string, Permission[]> = {
  user: ["read"],
  moderator: ["read", "write"],
  admin: ["read", "write", "delete"],
}

export function can(role: string, permission: Permission) {
  return PERMISSIONS[role]?.includes(permission) ?? false
}`,
  },
  {
    title: "Two-Factor Setup QR",
    description: "Generate an otpauth URI and QR payload for TOTP enrollment.",
    language: "typescript",
    collection: "Authentication",
    tags: ["auth", "oauth"],
    content: `import { authenticator } from "otplib"

export function setupTotp(email: string, issuer: string) {
  const secret = authenticator.generateSecret()
  const otpauth = authenticator.keyuri(email, issuer, secret)
  return { secret, otpauth }
}

export function verifyTotp(secret: string, token: string) {
  return authenticator.verify({ token, secret })
}`,
  },
  {
    title: "Password Hashing with Argon2",
    description: "Hash and verify passwords using argon2-cffi.",
    language: "python",
    collection: "Authentication",
    tags: ["auth", "validation"],
    content: `from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return hasher.hash(password)


def verify_password(password: str, digest: str) -> bool:
    try:
        return hasher.verify(digest, password)
    except VerifyMismatchError:
        return False`,
  },
  {
    title: "Token Blacklist with Redis",
    description: "Revoke JWTs by storing their jti with a TTL.",
    language: "typescript",
    collection: "Authentication",
    tags: ["jwt", "auth"],
    content: `import { Redis } from "ioredis"

const redis = new Redis(process.env.REDIS_URL!)

export async function revokeToken(jti: string, expiresIn: number) {
  await redis.set(\`jti:\${jti}\`, "revoked", "EX", expiresIn)
}

export async function isRevoked(jti: string) {
  return (await redis.exists(\`jti:\${jti}\`)) === 1
}`,
  },
  {
    title: "Refresh Token Rotation",
    description: "Rotate refresh tokens and revoke the previous one.",
    language: "typescript",
    collection: "Authentication",
    tags: ["jwt", "auth"],
    content: `import { randomBytes } from "node:crypto"

export async function rotateRefreshToken(userId: string, oldToken: string) {
  const session = await findSessionByToken(oldToken)
  if (!session || session.revokedAt) {
    throw new Error("session_reused_or_invalid")
  }
  await prisma.session.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  })
  const next = randomBytes(48).toString("hex")
  await prisma.session.create({
    data: { userId, token: next, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) },
  })
  return { refreshToken: next }
}`,
  },
  {
    title: "Signup Endpoint",
    description: "Create a user, hash the password, and send a welcome email.",
    language: "typescript",
    collection: "Authentication",
    tags: ["auth", "validation"],
    content: `import { z } from "zod"
import { hash } from "argon2"

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).optional(),
})

export async function signup(input: unknown) {
  const data = signupSchema.parse(input)
  const exists = await findUserByEmail(data.email)
  if (exists) throw new Error("email_taken")
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash: await hash(data.password),
    },
  })
  await sendEmail(user.email, "welcome")
  return { id: user.id }
}`,
  },
  {
    title: "Account Lockout Policy",
    description: "Temporarily lock an account after repeated failures.",
    language: "typescript",
    collection: "Authentication",
    tags: ["auth", "middleware"],
    content: `const MAX_FAILURES = 5
const LOCKOUT_MS = 10 * 60 * 1000

export async function checkLockout(email: string) {
  const record = await findAuthAttempts(email)
  if (record.failures >= MAX_FAILURES) {
    const lockedUntil = new Date(record.lastFailureAt.getTime() + LOCKOUT_MS)
    if (lockedUntil > new Date()) {
      throw new Error("account_locked")
    }
    await resetFailures(email)
  }
}`,
  },
  {
    title: "PHP Magic Link",
    description: "Send and validate a passwordless login link in PHP.",
    language: "php",
    collection: "Authentication",
    tags: ["auth", "jwt"],
    content: `<?php

function sendMagicLink(string $email): void
{
    $token = bin2hex(random_bytes(32));
    $expiresAt = time() + 60 * 30;

    $stmt = $pdo->prepare(
        'INSERT INTO magic_links (email, token_hash, expires_at) VALUES (?, ?, ?)'
    );
    $stmt->execute([$email, hash('sha256', $token), $expiresAt]);

    mail(
        $email,
        'Your sign-in link',
        'https://app.example.com/auth/magic?token=' . $token
    );
}

function consumeMagicLink(string $token): ?array
{
    $stmt = $pdo->prepare(
        'SELECT * FROM magic_links WHERE token_hash = ? AND expires_at > ?'
    );
    $stmt->execute([hash('sha256', $token), time()]);
    return $stmt->fetch() ?: null;
}`,
  },
  {
    title: "API Key Authentication",
    description: "Authenticate machine clients with an API key.",
    language: "typescript",
    collection: "Authentication",
    tags: ["auth", "middleware"],
    content: `import { randomBytes } from "node:crypto"

export function generateApiKey() {
  const key = randomBytes(32).toString("base64url")
  const keyHash = hashApiKey(key)
  return { key, keyHash }
}

export function hashApiKey(key: string) {
  return createHash("sha256").update(key).digest("hex")
}

export async function resolveApiKey(req) {
  const key = req.headers["x-api-key"]
  if (!key) return null
  return prisma.apiKey.findUnique({
    where: { keyHash: hashApiKey(key) },
  })
}`,
  },
  {
    title: "Verified Session Middleware",
    description: "Combine better-auth session check with a role guard.",
    language: "typescript",
    collection: "Authentication",
    tags: ["better-auth", "middleware", "auth"],
    content: `import { auth } from "@/lib/auth"
import { NextResponse, type NextRequest } from "next/server"

export async function requireVerifiedSession(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user.emailVerified) {
    return NextResponse.json({ error: "email_not_verified" }, { status: 403 })
  }
  return session
}`,
  },

  // ── Backend ────────────────────────────────────────────────────────────────
  {
    title: "Express Error Handler",
    description: "Centralized error handler that normalizes API errors.",
    language: "typescript",
    collection: "Backend",
    tags: ["express", "node", "api"],
    content: `import type { Request, Response, NextFunction } from "express"

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err instanceof HttpError ? err.status : 500
  const message = err instanceof Error ? err.message : "internal_error"
  if (status >= 500) console.error(err)
  res.status(status).json({ error: message })
}`,
  },
  {
    title: "Express Router Factory",
    description: "Build a versioned API router with common middleware.",
    language: "javascript",
    collection: "Backend",
    tags: ["express", "node"],
    content: `import { Router } from "express"

export function createApiRouter() {
  const router = Router()

  router.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store")
    next()
  })

  router.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() })
  })

  return router
}`,
  },
  {
    title: "NestJS Module Setup",
    description: "Declare a NestJS module with providers and exports.",
    language: "typescript",
    collection: "Backend",
    tags: ["nestjs", "node", "api"],
    content: `import { Module } from "@nestjs/common"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"
import { PrismaService } from "../prisma/prisma.service"

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}`,
  },
  {
    title: "NestJS Auth Guard",
    description: "NestJS guard that validates the request JWT.",
    language: "typescript",
    collection: "Backend",
    tags: ["nestjs", "middleware"],
    content: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.replace("Bearer ", "")
    if (!token) throw new UnauthorizedException()
    request.user = await this.jwt.verifyAsync(token)
    return true
  }
}`,
  },
  {
    title: "Node Request Logger",
    description: "Log method, path, status, and duration per request.",
    language: "javascript",
    collection: "Backend",
    tags: ["node", "middleware"],
    content: `export function requestLogger(req, res, next) {
  const started = Date.now()
  res.on("finish", () => {
    const duration = Date.now() - started
    console.log(
      JSON.stringify({
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: duration,
      }),
    )
  })
  next()
}`,
  },
  {
    title: "Async Handler Wrapper",
    description: "Catch async route errors without try/catch repetition.",
    language: "typescript",
    collection: "Backend",
    tags: ["express", "validation"],
    content: `import type { Request, Response, NextFunction } from "express"

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}`,
  },
  {
    title: "Zod Validation Middleware",
    description: "Validate request bodies against a Zod schema.",
    language: "typescript",
    collection: "Backend",
    tags: ["validation", "express"],
    content: `import { z, type ZodSchema } from "zod"
import type { Request, Response, NextFunction } from "express"

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() })
      return
    }
    req.body = parsed.data
    next()
  }
}

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
})`,
  },
  {
    title: "CORS Middleware",
    description: "Restrict cross-origin requests to an allowlist.",
    language: "typescript",
    collection: "Backend",
    tags: ["express", "middleware", "api"],
    content: `const ALLOWED_ORIGINS = [
  "https://app.example.com",
  "https://admin.example.com",
]

export function corsHeaders(req, res, next) {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Vary", "Origin")
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
  if (req.method === "OPTIONS") {
    res.sendStatus(204)
    return
  }
  next()
}`,
  },
  {
    title: "Health Check Endpoint",
    description: "Report service and database health for uptime checks.",
    language: "typescript",
    collection: "Backend",
    tags: ["api", "node"],
    content: `export async function healthCheck() {
  const checks = {
    database: await pingDatabase(),
    redis: await pingRedis(),
  }
  const healthy = Object.values(checks).every(Boolean)
  return {
    status: healthy ? "ok" : "degraded",
    checks,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }
}`,
  },
  {
    title: "Pagination Params Parser",
    description: "Parse and clamp page and perPage query parameters.",
    language: "typescript",
    collection: "Backend",
    tags: ["api", "validation"],
    content: `import { z } from "zod"

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(20),
})

export function parsePagination(query: unknown) {
  const { page, perPage } = paginationSchema.parse(query)
  return {
    page,
    perPage,
    skip: (page - 1) * perPage,
    take: perPage,
  }
}`,
  },
  {
    title: "File Upload with Multer",
    description: "Accept an image upload and validate its type and size.",
    language: "javascript",
    collection: "Backend",
    tags: ["express", "node"],
    content: `import multer from "multer"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp"]
    cb(null, allowed.includes(file.mimetype))
  },
})

router.post("/avatar", upload.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "unsupported_file" })
  }
  const url = await putObject(req.file)
  res.json({ url })
})`,
  },
  {
    title: "Env Config Loader",
    description: "Parse and type environment variables with Zod.",
    language: "typescript",
    collection: "Backend",
    tags: ["node", "validation"],
    content: `import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
})

export const env = envSchema.parse(process.env)`,
  },
  {
    title: "Structured Logger",
    description: "Emit JSON log lines with levels and context.",
    language: "typescript",
    collection: "Backend",
    tags: ["node", "api"],
    content: `const LEVELS = ["debug", "info", "warn", "error"] as const
type Level = (typeof LEVELS)[number]

function write(level: Level, message: string, context?: Record<string, unknown>) {
  const line = JSON.stringify({
    level,
    message,
    ...context,
    timestamp: new Date().toISOString(),
  })
  if (level === "error") console.error(line)
  else console.log(line)
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    write("debug", message, context),
  info: (message: string, context?: Record<string, unknown>) =>
    write("info", message, context),
  error: (message: string, context?: Record<string, unknown>) =>
    write("error", message, context),
}`,
  },
  {
    title: "HTTP Client with Retry",
    description: "Fetch wrapper that retries idempotent failures.",
    language: "typescript",
    collection: "Backend",
    tags: ["node", "api"],
    content: `export async function fetchWithRetry(
  url: string,
  init: RequestInit = {},
  retries = 3,
): Promise<Response> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init)
      if (res.status < 500 || attempt === retries) return res
    } catch (error) {
      lastError = error
    }
    await sleep(2 ** attempt * 250)
  }
  throw lastError
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))`,
  },
  {
    title: "Circuit Breaker Helper",
    description: "Open a circuit after repeated failures to protect downstream services.",
    language: "typescript",
    collection: "Backend",
    tags: ["node", "api"],
    content: `type State = "closed" | "open" | "half-open"

export class CircuitBreaker {
  private state: State = "closed"
  private failures = 0
  private openedAt = 0

  constructor(
    private readonly threshold = 5,
    private readonly cooldownMs = 30_000,
  ) {}

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.state === "open" && Date.now() - this.openedAt > this.cooldownMs) {
      this.state = "half-open"
    }
    if (this.state === "open") throw new Error("circuit_open")
    try {
      const result = await task()
      this.failures = 0
      this.state = "closed"
      return result
    } catch (error) {
      this.failures++
      if (this.failures >= this.threshold) {
        this.state = "open"
        this.openedAt = Date.now()
      }
      throw error
    }
  }
}`,
  },
  {
    title: "BullMQ Job Producer",
    description: "Add an email job to a BullMQ queue.",
    language: "typescript",
    collection: "Backend",
    tags: ["node", "api"],
    content: `import { Queue } from "bullmq"

export const emailQueue = new Queue("email", {
  connection: { url: process.env.REDIS_URL! },
})

export async function enqueueEmail(payload: {
  to: string
  template: string
  data: Record<string, unknown>
}) {
  await emailQueue.add("send", payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: 1000,
  })
}`,
  },
  {
    title: "BullMQ Job Worker",
    description: "Process email jobs from a BullMQ queue.",
    language: "typescript",
    collection: "Backend",
    tags: ["node", "api"],
    content: `import { Worker } from "bullmq"

const worker = new Worker(
  "email",
  async (job) => {
    const { to, template, data } = job.data
    const html = await renderTemplate(template, data)
    await sendEmail(to, html)
  },
  { connection: { url: process.env.REDIS_URL! } },
)

worker.on("failed", (job, err) => {
  console.error("email job failed", job?.id, err)
})`,
  },
  {
    title: "WebSocket Heartbeat",
    description: "Keep WebSocket connections alive and reap dead ones.",
    language: "javascript",
    collection: "Backend",
    tags: ["node", "api"],
    content: `const HEARTBEAT_INTERVAL = 30_000
const DEAD_AFTER = 45_000

export function attachHeartbeat(ws, onDead) {
  ws.isAlive = true
  ws.on("pong", () => {
    ws.isAlive = true
  })
  const timer = setInterval(() => {
    if (ws.isAlive === false) {
      clearInterval(timer)
      ws.terminate()
      onDead?.(ws)
      return
    }
    ws.isAlive = false
    ws.ping()
  }, HEARTBEAT_INTERVAL)
  ws.on("close", () => clearInterval(timer))
}`,
  },
  {
    title: "Graceful Shutdown",
    description: "Close the HTTP server and database on SIGTERM.",
    language: "typescript",
    collection: "Backend",
    tags: ["node", "express"],
    content: `import type { Server } from "node:http"

export function setupGracefulShutdown(server: Server) {
  const shutdown = (signal: string) => {
    console.log(\`\${signal} received, shutting down\`)
    server.close(async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10_000).unref()
  }
  process.on("SIGTERM", () => shutdown("SIGTERM"))
  process.on("SIGINT", () => shutdown("SIGINT"))
}`,
  },
  {
    title: "Custom Rate Limiter",
    description: "Sliding-window rate limiter keyed by IP.",
    language: "typescript",
    collection: "Backend",
    tags: ["express", "middleware", "api"],
    content: `import type { Request, Response, NextFunction } from "express"

const buckets = new Map<string, number[]>()

export function rateLimit(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? "unknown"
    const now = Date.now()
    const recent = (buckets.get(key) ?? []).filter(
      (t) => now - t < windowMs,
    )
    if (recent.length >= limit) {
      res.status(429).json({ error: "too_many_requests" })
      return
    }
    recent.push(now)
    buckets.set(key, recent)
    next()
  }
}`,
  },
  {
    title: "Request ID Middleware",
    description: "Tag every request with a traceable ID.",
    language: "javascript",
    collection: "Backend",
    tags: ["express", "middleware"],
    content: `import { randomUUID } from "node:crypto"

export function requestId(req, res, next) {
  const incoming = req.headers["x-request-id"]
  const id = Array.isArray(incoming) ? incoming[0] : incoming ?? randomUUID()
  req.id = id
  res.setHeader("x-request-id", id)
  next()
}`,
  },
  {
    title: "API Response Envelope",
    description: "Wrap success responses in a consistent envelope.",
    language: "typescript",
    collection: "Backend",
    tags: ["express", "api"],
    content: `export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return { success: true as const, data, ...meta }
}

export function fail(message: string, code?: string) {
  return { success: false as const, error: { message, code } }
}

export function sendOk(res, data, status = 200) {
  res.status(status).json(ok(data))
}`,
  },
  {
    title: "Webhook Signature Verify",
    description: "Verify a webhook HMAC payload before processing.",
    language: "typescript",
    collection: "Backend",
    tags: ["api", "node", "validation"],
    content: `import { createHmac, timingSafeEqual } from "node:crypto"

export function verifyWebhook(
  secret: string,
  signature: string,
  body: string,
) {
  const expected = createHmac("sha256", secret).update(body).digest("hex")
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}`,
  },
  {
    title: "Python SMTP Emailer",
    description: "Send transactional emails with Python smtplib.",
    language: "python",
    collection: "Backend",
    tags: ["node", "api"],
    content: `import smtplib
from email.mime.text import MIMEText

SMTP_HOST = "smtp.example.com"


def send_transactional(to: str, subject: str, html: str) -> None:
    message = MIMEText(html, "html")
    message["Subject"] = subject
    message["From"] = "no-reply@example.com"
    message["To"] = to

    with smtplib.SMTP(SMTP_HOST, 587) as client:
        client.starttls()
        client.login(SMTP_USER, SMTP_PASSWORD)
        client.send_message(message)`,
  },
  {
    title: "Go JSON Response Helper",
    description: "Write typed JSON responses with proper status codes.",
    language: "go",
    collection: "Backend",
    tags: ["api", "validation"],
    content: `package httpapi

import (
	"encoding/json"
	"net/http"
)

func WriteJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func WriteError(w http.ResponseWriter, status int, message string) {
	WriteJSON(w, status, map[string]string{"error": message})
}`,
  },

  // ── Frontend ───────────────────────────────────────────────────────────────
  {
    title: "useDebounce",
    description: "Debounce a rapidly changing value.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "hooks"],
    content: `import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}`,
  },
  {
    title: "useDebouncedValue",
    description: "Call a callback once the value stops changing.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "hooks"],
    content: `import { useEffect, useRef } from "react"

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay = 300,
) {
  const timer = useRef<ReturnType<typeof setTimeout>>()

  return (...args: Args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => callback(...args), delay)
  }
}`,
  },
  {
    title: "useLocalStorage",
    description: "Persist React state to localStorage.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "hooks"],
    content: `import { useState } from "react"

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  const update = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = next instanceof Function ? next(prev) : next
      localStorage.setItem(key, JSON.stringify(resolved))
      return resolved
    })
  }

  return [value, update] as const
}`,
  },
  {
    title: "useClickOutside",
    description: "Invoke a callback when clicking outside an element.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "hooks"],
    content: `import { useEffect, type RefObject } from "react"

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
) {
  useEffect(() => {
    function handle(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutside()
      }
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [ref, onOutside])
}`,
  },
  {
    title: "useKeyPress",
    description: "Listen for a specific key combo while a target is focused.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "hooks"],
    content: `import { useEffect } from "react"

export function useKeyPress(
  key: string,
  onPress: () => void,
  modifiers: Partial<{ ctrl: boolean; shift: boolean; alt: boolean }> = {},
) {
  useEffect(() => {
    function handle(event: KeyboardEvent) {
      if (event.key !== key) return
      if (modifiers.ctrl !== undefined && event.ctrlKey !== modifiers.ctrl) return
      if (modifiers.shift !== undefined && event.shiftKey !== modifiers.shift) return
      if (modifiers.alt !== undefined && event.altKey !== modifiers.alt) return
      onPress()
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [key, onPress, modifiers])
}`,
  },
  {
    title: "useMediaQuery",
    description: "Track a CSS media query and return whether it matches.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "hooks"],
    content: `import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return matches
}`,
  },
  {
    title: "useInterval",
    description: "Run a callback on a fixed interval with pausing.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "hooks"],
    content: `import { useEffect, useRef } from "react"

export function useInterval(callback: () => void, delay: number | null) {
  const saved = useRef(callback)

  useEffect(() => {
    saved.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => saved.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}`,
  },
  {
    title: "useCopyToClipboard",
    description: "Copy text and expose a copied state with a timeout.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "hooks"],
    content: `import { useCallback, useRef, useState } from "react"

export function useCopyToClipboard(timeoutMs = 2000) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const copy = useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), timeoutMs)
    },
    [timeoutMs],
  )

  return [copied, copy] as const
}`,
  },
  {
    title: "usePrevious",
    description: "Track the previous value of a prop or state.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "hooks"],
    content: `import { useEffect, useRef } from "react"

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}`,
  },
  {
    title: "useThrottle",
    description: "Limit how often a callback can fire.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "hooks"],
    content: `import { useRef } from "react"

export function useThrottle<Args extends unknown[]>(
  callback: (...args: Args) => void,
  limitMs = 500,
) {
  const lastRan = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  return (...args: Args) => {
    const now = Date.now()
    const remaining = lastRan.current + limitMs - now
    if (remaining <= 0) {
      lastRan.current = now
      callback(...args)
      return
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(
      () => {
        lastRan.current = Date.now()
        callback(...args)
      },
      remaining,
    )
  }
}`,
  },
  {
    title: "Tailwind Modal",
    description: "Accessible modal built with Tailwind and an overlay.",
    language: "tsx",
    collection: "Frontend",
    tags: ["react", "tailwind", "ui"],
    content: `type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}`,
  },
  {
    title: "Tailwind Tooltip",
    description: "CSS-only tooltip using a group hover.",
    language: "tsx",
    collection: "Frontend",
    tags: ["react", "tailwind", "ui"],
    content: `export function Tooltip({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
      >
        {label}
      </span>
    </span>
  )
}`,
  },
  {
    title: "Sonner Toast Helper",
    description: "Shared helpers for success and error toasts.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "ui"],
    content: `import { toast } from "sonner"

export function notifySuccess(message: string) {
  toast.success(message, {
    duration: 3000,
  })
}

export function notifyError(message: string) {
  toast.error(message, {
    duration: 5000,
  })
}

export function notifyAction(message: string, actionLabel: string, onAction: () => void) {
  toast(message, {
    action: {
      label: actionLabel,
      onClick: onAction,
    },
  })
}`,
  },
  {
    title: "API Fetch Wrapper",
    description: "Typed fetch helper that handles JSON and errors.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "nextjs", "ui"],
    content: `type ApiError = { error: string }

export async function api<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(\`/api\${path}\`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiError | null
    throw new Error(body?.error ?? \`Request failed with \${res.status}\`)
  }
  return res.json() as Promise<T>
}`,
  },
  {
    title: "Form Input Field",
    description: "Reusable labelled input with error display.",
    language: "tsx",
    collection: "Frontend",
    tags: ["react", "ui", "tailwind"],
    content: `export function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        className="h-9 rounded-lg border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none focus:border-blue-500"
        {...props}
      />
      {error ? (
        <span className="text-xs text-rose-400" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}`,
  },
  {
    title: "Inline Edit Component",
    description: "Swap a label for an input when clicked.",
    language: "tsx",
    collection: "Frontend",
    tags: ["react", "ui"],
    content: `import { useState } from "react"

export function InlineEdit({
  value,
  onSave,
}: {
  value: string
  onSave: (next: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const submit = () => {
    onSave(draft.trim() || value)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={submit}
        onKeyDown={(event) => {
          if (event.key === "Enter") submit()
          if (event.key === "Escape") setEditing(false)
        }}
        className="rounded-md border border-blue-500 bg-slate-950 px-2 py-1 text-sm text-white"
      />
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="rounded-md px-2 py-1 text-sm hover:bg-white/10"
    >
      {value}
    </button>
  )
}`,
  },
  {
    title: "Accordion Component",
    description: "Single-open accordion with animated chevrons.",
    language: "tsx",
    collection: "Frontend",
    tags: ["react", "ui", "tailwind"],
    content: `import { useState } from "react"

type AccordionItem = { id: string; title: string; content: React.ReactNode }

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="divide-y divide-white/10 rounded-xl border border-white/10">
      {items.map((item) => (
        <div key={item.id}>
          <button
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white"
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            aria-expanded={openId === item.id}
          >
            {item.title}
            <span className="text-slate-400">{openId === item.id ? "−" : "+"}</span>
          </button>
          {openId === item.id ? (
            <div className="px-4 pb-4 text-sm text-slate-300">{item.content}</div>
          ) : null}
        </div>
      ))}
    </div>
  )
}`,
  },
  {
    title: "Tabs Component",
    description: "Accessible tabs with keyboard navigation.",
    language: "tsx",
    collection: "Frontend",
    tags: ["react", "ui", "tailwind"],
    content: `import { useState } from "react"

type Tab = { id: string; label: string; content: React.ReactNode }

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id)

  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            className={\`px-3 py-2 text-sm \${
              active === tab.id
                ? "border-b-2 border-blue-500 text-white"
                : "text-slate-400 hover:text-slate-200"
            }\`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-4">
        {tabs.find((tab) => tab.id === active)?.content}
      </div>
    </div>
  )
}`,
  },
  {
    title: "Debounced Search Input",
    description: "Search input that only calls onSearch after typing pauses.",
    language: "tsx",
    collection: "Frontend",
    tags: ["react", "nextjs", "hooks"],
    content: `import { useEffect, useState } from "react"
import { Search } from "lucide-react"

export function DebouncedSearchInput({
  onSearch,
}: {
  onSearch: (query: string) => void
}) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search snippets…"
        className="h-10 w-full rounded-lg border border-white/10 bg-slate-950 pl-9 pr-3 text-sm text-white outline-none focus:border-blue-500"
      />
    </div>
  )
}`,
  },
  {
    title: "Skeleton Loader",
    description: "Pulsing placeholder block while content loads.",
    language: "tsx",
    collection: "Frontend",
    tags: ["react", "tailwind", "ui"],
    content: `export function Skeleton({
  className = "",
}: {
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={\`animate-pulse rounded-lg bg-white/10 \${className}\`}
    />
  )
}

export function SnippetRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="size-9" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  )
}`,
  },
  {
    title: "Pagination Component",
    description: "Page controls with prev/next and current page.",
    language: "tsx",
    collection: "Frontend",
    tags: ["react", "ui", "nextjs"],
    content: `export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  return (
    <nav className="flex items-center justify-between gap-4 py-4" aria-label="Pagination">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border border-white/10 px-3 py-1.5 text-sm disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-slate-400">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border border-white/10 px-3 py-1.5 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  )
}`,
  },
  {
    title: "Empty State Component",
    description: "Centered illustration, title, and action for empty lists.",
    language: "tsx",
    collection: "Frontend",
    tags: ["react", "tailwind", "ui"],
    content: `export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
      {icon ? (
        <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
          {icon}
        </div>
      ) : null}
      <div className="grid gap-1.5">
        <p className="text-base font-semibold text-white">{title}</p>
        {description ? (
          <p className="max-w-sm text-sm text-slate-400">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}`,
  },
  {
    title: "Command Palette Hook",
    description: "Bind a keyboard shortcut to open a command palette.",
    language: "typescript",
    collection: "Frontend",
    tags: ["react", "hooks", "ui"],
    content: `import { useEffect, useState } from "react"

export function useCommandPalette(key = "k") {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handle(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey
      if (meta && event.key.toLowerCase() === key) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [key])

  return { open, setOpen }
}`,
  },
  {
    title: "ESLint Config",
    description: "Next.js ESLint flat config with TypeScript rules.",
    language: "json",
    collection: "Frontend",
    tags: ["react", "nextjs"],
    content: `{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "react-hooks/exhaustive-deps": "warn"
  }
}`,
  },
  {
    title: "tsconfig Paths",
    description: "Configure import aliases for a Next.js project.",
    language: "json",
    collection: "Frontend",
    tags: ["react", "nextjs"],
    content: `{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"],
      "@components/*": ["./components/*"],
      "@features/*": ["./features/*"],
      "@lib/*": ["./lib/*"]
    }
  }
}`,
  },

  // ── Database ───────────────────────────────────────────────────────────────
  {
    title: "Prisma Pagination",
    description: "Cursor and offset pagination patterns with Prisma.",
    language: "typescript",
    collection: "Database",
    tags: ["prisma", "postgres"],
    content: `export async function paginateSnippets(userId: string, cursor?: string) {
  const snippets = await prisma.snippet.findMany({
    where: { userId, deletedAt: null },
    orderBy: [{ createdAt: "desc" }],
    take: 20,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  })
  const nextCursor = snippets.length === 20 ? snippets.at(-1)?.id : null
  return { snippets, nextCursor }
}`,
  },
  {
    title: "Prisma Soft Delete",
    description: "Soft delete a snippet by setting deletedAt.",
    language: "typescript",
    collection: "Database",
    tags: ["prisma", "postgres"],
    content: `export async function softDeleteSnippet(userId: string, id: string) {
  return prisma.snippet.update({
    where: { id },
    data: { deletedAt: new Date() },
    select: { id: true, deletedAt: true },
  })
}

export async function restoreSnippet(userId: string, id: string) {
  return prisma.snippet.update({
    where: { id },
    data: { deletedAt: null },
  })
}`,
  },
  {
    title: "Prisma Transaction",
    description: "Move a snippet between collections atomically.",
    language: "typescript",
    collection: "Database",
    tags: ["prisma", "postgres"],
    content: `export async function moveSnippet(
  snippetId: string,
  fromCollectionId: string,
  toCollectionId: string,
) {
  await prisma.$transaction([
    prisma.snippetsOnCollections.deleteMany({
      where: { snippetId, collectionId: fromCollectionId },
    }),
    prisma.snippetsOnCollections.create({
      data: { snippetId, collectionId: toCollectionId },
    }),
  ])
}`,
  },
  {
    title: "Prisma Filtered FindMany",
    description: "Combine filter, search, and sort options in one query.",
    language: "typescript",
    collection: "Database",
    tags: ["prisma", "postgres"],
    content: `type Filters = {
  language?: string
  isFavorite?: boolean
  search?: string
}

export function findFiltered(userId: string, filters: Filters = {}) {
  const where = {
    userId,
    deletedAt: null,
    ...(filters.language ? { language: filters.language } : {}),
    ...(filters.isFavorite !== undefined ? { isFavorite: filters.isFavorite } : {}),
    ...(filters.search
      ? { title: { contains: filters.search, mode: "insensitive" } }
      : {}),
  }
  return prisma.snippet.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 50,
  })
}`,
  },
  {
    title: "Prisma Upsert User",
    description: "Create or update a user row from an auth identity.",
    language: "typescript",
    collection: "Database",
    tags: ["prisma", "postgres"],
    content: `type AuthUser = {
  id: string
  email: string
  name?: string | null
}

export async function syncUser(authUser: AuthUser) {
  return prisma.user.upsert({
    where: { id: authUser.id },
    update: {
      email: authUser.email,
      name: authUser.name ?? null,
    },
    create: {
      id: authUser.id,
      email: authUser.email,
      name: authUser.name ?? null,
    },
  })
}`,
  },
  {
    title: "Prisma Relation Include",
    description: "Load a snippet with its tags and collections.",
    language: "typescript",
    collection: "Database",
    tags: ["prisma", "postgres"],
    content: `export function snippetWithRelations(id: string) {
  return prisma.snippet.findUnique({
    where: { id },
    include: {
      tags: { select: { tag: { select: { id: true, name: true } } } },
      collections: {
        select: { collection: { select: { id: true, name: true } } },
      },
    },
  })
}`,
  },
  {
    title: "Prisma Raw Query",
    description: "Run a raw SQL aggregate and return typed rows.",
    language: "typescript",
    collection: "Database",
    tags: ["prisma", "postgres"],
    content: `type LanguageCount = { language: string; count: bigint }

export async function countByLanguage(userId: string) {
  const rows = await prisma.$queryRaw<LanguageCount[]>\`
    SELECT language, COUNT(*)::bigint as count
    FROM snippets
    WHERE user_id = \${userId} AND deleted_at IS NULL
    GROUP BY language
    ORDER BY count DESC
  \`
  return rows
}`,
  },
  {
    title: "Prisma with Redis Cache",
    description: "Cache a Prisma query in Redis and invalidate on write.",
    language: "typescript",
    collection: "Database",
    tags: ["prisma", "redis"],
    content: `import { Redis } from "ioredis"

const redis = new Redis(process.env.REDIS_URL!)
const TTL = 60

export async function getCachedSnippet(id: string) {
  const cached = await redis.get(\`snippet:\${id}\`)
  if (cached) return JSON.parse(cached)
  const snippet = await prisma.snippet.findUnique({ where: { id } })
  if (snippet) await redis.set(\`snippet:\${id}\`, JSON.stringify(snippet), "EX", TTL)
  return snippet
}

export async function invalidateSnippet(id: string) {
  await redis.del(\`snippet:\${id}\`)
}`,
  },
  {
    title: "Postgres JSONB Query",
    description: "Query JSONB columns with containment and extraction.",
    language: "sql",
    collection: "Database",
    tags: ["postgres","sql"],
    content: `SELECT id, title
FROM snippets
WHERE metadata @> '{"language": "typescript"}'::jsonb;

SELECT metadata->>'framework' AS framework, COUNT(*)
FROM projects
GROUP BY metadata->>'framework';

CREATE INDEX idx_snippets_metadata
ON snippets USING gin (metadata jsonb_path_ops);`,
  },
  {
    title: "Postgres Date Grouping",
    description: "Group rows by day, week, or month.",
    language: "sql",
    collection: "Database",
    tags: ["postgres","sql"],
    content: `SELECT
  date_trunc('week', created_at) AS week,
  COUNT(*) AS created_count
FROM snippets
WHERE created_at >= now() - interval '90 days'
GROUP BY date_trunc('week', created_at)
ORDER BY week;

SELECT to_char(created_at, 'YYYY-MM') AS month, COUNT(*)
FROM snippets
GROUP BY month
ORDER BY month;`,
  },
  {
    title: "Postgres Recursive CTE",
    description: "Walk a self-referencing hierarchy with a recursive CTE.",
    language: "sql",
    collection: "Database",
    tags: ["postgres","sql"],
    content: `WITH RECURSIVE org_tree AS (
  SELECT id, parent_id, name, 1 AS depth
  FROM employees
  WHERE parent_id IS NULL

  UNION ALL

  SELECT e.id, e.parent_id, e.name, ot.depth + 1
  FROM employees e
  JOIN org_tree ot ON ot.id = e.parent_id
)
SELECT * FROM org_tree ORDER BY depth, name;`,
  },
  {
    title: "Postgres Window Function",
    description: "Rank rows and compute running totals with window functions.",
    language: "sql",
    collection: "Database",
    tags: ["postgres","sql"],
    content: `SELECT
  id,
  title,
  language,
  ROW_NUMBER() OVER (PARTITION BY language ORDER BY updated_at DESC) AS rn,
  RANK() OVER (ORDER BY views DESC) AS view_rank,
  SUM(views) OVER (ORDER BY created_at) AS running_views
FROM snippets
WHERE deleted_at IS NULL;`,
  },
  {
    title: "Redis Cache Helper",
    description: "Cache-aside helper with JSON serialization and TTL.",
    language: "typescript",
    collection: "Database",
    tags: ["redis", "prisma"],
    content: `import { Redis } from "ioredis"

const redis = new Redis(process.env.REDIS_URL!)

export async function cacheAside<T>(
  key: string,
  loader: () => Promise<T>,
  ttlSeconds: number,
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached) as T
  const value = await loader()
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds)
  return value
}`,
  },
  {
    title: "Redis Rate Limit",
    description: "Fixed-window rate limiting with INCR and EXPIRE.",
    language: "typescript",
    collection: "Database",
    tags: ["redis", "postgres"],
    content: `import { Redis } from "ioredis"

const redis = new Redis(process.env.REDIS_URL!)

export async function hitRateLimit(key: string, limit: number, windowSeconds: number) {
  const bucket = \`rl:\${key}\`
  const current = await redis.incr(bucket)
  if (current === 1) {
    await redis.expire(bucket, windowSeconds)
  }
  const ttl = await redis.ttl(bucket)
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    resetInSeconds: ttl,
  }
}`,
  },
  {
    title: "Redis Distributed Lock",
    description: "Acquire a non-blocking distributed lock.",
    language: "typescript",
    collection: "Database",
    tags: ["redis", "postgres"],
    content: `import { Redis } from "ioredis"
import { randomUUID } from "node:crypto"

const redis = new Redis(process.env.REDIS_URL!)

export async function acquireLock(key: string, ttlMs: number) {
  const token = randomUUID()
  const acquired = await redis.set(
    \`lock:\${key}\`,
    token,
    "PX",
    ttlMs,
    "NX",
  )
  return acquired === "OK" ? token : null
}

export async function releaseLock(key: string, token: string) {
  const script = \`
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  \`
  await redis.eval(script, 1, \`lock:\${key}\`, token)
}`,
  },
  {
    title: "Redis Pub/Sub Subscriber",
    description: "Subscribe to a channel and handle messages.",
    language: "typescript",
    collection: "Database",
    tags: ["redis", "postgres"],
    content: `import { Redis } from "ioredis"

const subscriber = new Redis(process.env.REDIS_URL!)
const publisher = new Redis(process.env.REDIS_URL!)

export function onChannel(channel: string, handler: (message: string) => void) {
  subscriber.subscribe(channel)
  subscriber.on("message", (ch, message) => {
    if (ch === channel) handler(message)
  })
}

export function publish(channel: string, payload: unknown) {
  publisher.publish(channel, JSON.stringify(payload))
}`,
  },
  {
    title: "MySQL Pagination",
    description: "Keyset pagination that stays stable across inserts.",
    language: "sql",
    collection: "Database",
    tags: ["mysql", "sql"],
    content: `-- Keyset pagination: pass the last seen id
SELECT id, title, created_at
FROM snippets
WHERE user_id = ?
  AND id < ?
ORDER BY id DESC
LIMIT 20;

-- Offset pagination for small tables
SELECT id, title
FROM snippets
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT 20 OFFSET ?;`,
  },
  {
    title: "MySQL Composite Index",
    description: "Index strategy for common query patterns.",
    language: "sql",
    collection: "Database",
    tags: ["mysql", "sql"],
    content: `-- Supports: WHERE user_id = ? AND is_archived = ? ORDER BY created_at DESC
CREATE INDEX idx_user_archived_created
ON snippets (user_id, is_archived, created_at DESC);

-- Supports: WHERE language = ? AND is_public = ?
CREATE INDEX idx_language_public
ON snippets (language, is_public);

-- Covering index for tag lookups
CREATE INDEX idx_soc_snippet_tag
ON snippets_on_tags (snippet_id, tag_id);`,
  },
  {
    title: "Drizzle Schema Setup",
    description: "Define tables and enums with Drizzle ORM.",
    language: "typescript",
    collection: "Database",
    tags: ["drizzle", "postgres"],
    content: `import {
  boolean,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const languageEnum = pgEnum("language", [
  "typescript",
  "javascript",
  "python",
  "go",
])

export const snippets = pgTable("snippets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  language: languageEnum("language").notNull().default("typescript"),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})`,
  },
  {
    title: "Drizzle Query Builder",
    description: "Query and filter rows with Drizzle.",
    language: "typescript",
    collection: "Database",
    tags: ["drizzle", "postgres"],
    content: `import { and, desc, eq } from "drizzle-orm"
import { db } from "./db"
import { snippets } from "./schema"

export async function findRecentSnippets(userId: string, language?: string) {
  return db
    .select()
    .from(snippets)
    .where(
      and(
        eq(snippets.userId, userId),
        language ? eq(snippets.language, language) : undefined,
      ),
    )
    .orderBy(desc(snippets.updatedAt))
    .limit(50)
}`,
  },
  {
    title: "Drizzle Relations",
    description: "Declare relations and join tables in Drizzle.",
    language: "typescript",
    collection: "Database",
    tags: ["drizzle", "postgres"],
    content: `import { relations } from "drizzle-orm"
import { pgTable, text, uuid } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
})

export const snippets = pgTable("snippets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  snippets: many(snippets),
}))

export const snippetsRelations = relations(snippets, ({ one }) => ({
  user: one(users, {
    fields: [snippets.userId],
    references: [users.id],
  }),
}))`,
  },
  {
    title: "Postgres Backup Script",
    description: "Dump and compress a Postgres database.",
    language: "bash",
    collection: "Database",
    tags: ["postgres", "backup"],
    content: `#!/usr/bin/env bash
set -euo pipefail

DATABASE_URL="\${DATABASE_URL:-postgres://localhost:5432/snippetflow}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="\${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"

pg_dump "$DATABASE_URL" \\
  --format=custom \\
  --no-owner \\
  | gzip -9 > "$BACKUP_DIR/snippetflow-$TIMESTAMP.dump.gz"

echo "Backup written to $BACKUP_DIR/snippetflow-$TIMESTAMP.dump.gz"`,
  },
  {
    title: "Docker Compose for Postgres",
    description: "Run Postgres and Redis locally for development.",
    language: "yaml",
    collection: "Database",
    tags: ["postgres", "redis"],
    content: `services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: snippetflow
      POSTGRES_PASSWORD: snippetflow
      POSTGRES_DB: snippetflow
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U snippetflow"]
      interval: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:`,
  },
  {
    title: "Connection Pool Manager",
    description: "Build a shared pg pool with size limits.",
    language: "typescript",
    collection: "Database",
    tags: ["postgres", "prisma"],
    content: `import { Pool } from "pg"

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

pool.on("error", (err) => {
  console.error("pg pool error", err)
})

export async function withClient<T>(task: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect()
  try {
    return await task(client)
  } finally {
    client.release()
  }
}`,
  },
  {
    title: "Prisma Query Debug Log",
    description: "Enable query logging and measure slow queries.",
    language: "typescript",
    collection: "Database",
    tags: ["prisma", "postgres"],
    content: `import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient({
  log: [
    { emit: "stdout", level: "warn" },
    { emit: "stdout", level: "error" },
    ...(process.env.DEBUG_PRISMA === "1"
      ? [{ emit: "stdout", level: "query" }]
      : []),
  ],
})

export async function withQueryTimer<T>(label: string, task: () => Promise<T>) {
  const started = performance.now()
  try {
    return await task()
  } finally {
    const ms = performance.now() - started
    if (ms > 200) console.warn(\`slow query [\${label}]: \${ms.toFixed(1)}ms\`)
  }
}`,
  },

]

// Validate the dataset before anything touches the database so a bad definition
// fails fast instead of corrupting the demo dataset.
// The 20 tags form a single shared pool that snippets reuse across categories.
const GLOBAL_TAG_POOL = new Set(Object.values(TAG_POOL).flat())

export function assertDataset(snippets: SnippetSeed[]) {
  const seenSlugs = new Set<string>()
  const seenTitles = new Set<string>()

  for (const snippet of snippets) {
    if (!CATEGORIES.includes(snippet.collection)) {
      throw new Error(`Unknown collection for "${snippet.title}": ${snippet.collection}`)
    }
    if (!SUPPORTED_LANGUAGES.includes(snippet.language)) {
      throw new Error(`Unsupported language for "${snippet.title}": ${snippet.language}`)
    }
    if (snippet.tags.length < 2 || snippet.tags.length > 4) {
      throw new Error(`"${snippet.title}" must have 2-4 tags, got ${snippet.tags.length}`)
    }
    if (new Set(snippet.tags).size !== snippet.tags.length) {
      throw new Error(`"${snippet.title}" contains duplicate tags`)
    }
    for (const tag of snippet.tags) {
      if (!GLOBAL_TAG_POOL.has(tag)) {
        throw new Error(`"${snippet.title}" uses out-of-pool tag "${tag}"`)
      }
    }
    const slug = slugify(snippet.title)
    if (seenSlugs.has(slug)) {
      throw new Error(`Duplicate slug generated: "${snippet.title}"`)
    }
    if (seenTitles.has(snippet.title)) {
      throw new Error(`Duplicate title: "${snippet.title}"`)
    }
    seenSlugs.add(slug)
    seenTitles.add(snippet.title)
  }
}
