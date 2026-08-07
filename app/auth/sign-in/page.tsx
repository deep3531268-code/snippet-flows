import Link from "next/link"
import { Braces } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SignInForm } from "@/components/auth/sign-in-form"
import { BrandingPanel } from "@/components/auth/branding-panel"

export default function SignInPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[55fr_45fr]">
      <BrandingPanel />

      <div className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[420px] animate-fade-in motion-reduce:animate-none">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-md transition-opacity duration-200 hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label="SnippetFlow home"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background transition-transform duration-200 group-hover:scale-105">
                <Braces className="size-4" aria-hidden />
              </span>
              <span className="font-heading text-sm font-semibold tracking-tight">
                SnippetFlow
              </span>
            </Link>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-float backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-card/60 hover:shadow-lifted sm:p-8">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Sign In
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Welcome back to SnippetFlow.
            </p>

            <div className="mt-6">
              <SignInForm />
            </div>

            <div className="my-6 flex items-center gap-3" aria-hidden>
              <span className="h-px flex-1 bg-border/60" />
              <span className="text-xs text-muted-foreground">or</span>
              <span className="h-px flex-1 bg-border/60" />
            </div>

            <Button
              asChild
              variant="outline"
              className="w-full transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/40 active:translate-y-0"
            >
              <Link href="/">Back to Home</Link>
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="rounded-md font-medium text-foreground underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
