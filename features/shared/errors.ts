import "server-only"

import { Prisma } from "@prisma/client"

const PRISMA_ERROR_MESSAGES: Record<string, string> = {
  P2002: "An item with this name already exists.",
  P2003: "The item you're trying to change no longer exists.",
  P2025: "The item was not found. It may have been deleted.",
}

const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again."

export function getActionErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return PRISMA_ERROR_MESSAGES[error.code] ?? GENERIC_ERROR_MESSAGE
  }
  if (
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError
  ) {
    return GENERIC_ERROR_MESSAGE
  }
  return error instanceof Error ? error.message : fallback
}
