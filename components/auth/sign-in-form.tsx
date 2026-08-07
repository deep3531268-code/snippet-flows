"use client"

import * as React from "react"
import { useForm, type FieldErrors, type Resolver } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, type AuthActionState } from "@/features/auth/actions"
import { signInSchema, type SignInInput } from "@/features/auth/schemas"

const signInResolver: Resolver<SignInInput> = async (values) => {
  const parsed = signInSchema.safeParse(values)

  if (parsed.success) {
    return { values: parsed.data, errors: {} }
  }

  const fieldErrors = parsed.error.flatten().fieldErrors
  const errors: FieldErrors<SignInInput> = {}

  for (const field of Object.keys(fieldErrors) as (keyof SignInInput)[]) {
    const messages = fieldErrors[field]
    if (messages?.length) {
      errors[field] = { type: "validation", message: messages[0] }
    }
  }

  return { values: {}, errors }
}

export function SignInForm() {
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: signInResolver,
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    clearErrors()
    setPending(true)

    try {
      const formData = new FormData()
      formData.append("email", values.email)
      formData.append("password", values.password)

      const result: AuthActionState = await signIn(null, formData)

      if (result?.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.length) {
            setError(field as keyof SignInInput, {
              type: "server",
              message: messages[0],
            })
          }
        }
      }

      if (result?.error) {
        setServerError(result.error)
      }
    } finally {
      setPending(false)
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="sign-in-email">Email</Label>
        <Input
          id="sign-in-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="transition-all duration-200 focus-visible:ring-ring/60"
          aria-invalid={Boolean(errors.email)}
          disabled={pending}
          required
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sign-in-password">Password</Label>
        <Input
          id="sign-in-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="transition-all duration-200 focus-visible:ring-ring/60"
          aria-invalid={Boolean(errors.password)}
          disabled={pending}
          required
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground">
          <input
            type="checkbox"
            name="remember"
            className="size-4 rounded accent-foreground"
            disabled={pending}
          />
          Remember me
        </label>
      </div>

      {serverError ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {serverError}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lifted active:translate-y-0"
        disabled={pending}
      >
        {pending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  )
}
