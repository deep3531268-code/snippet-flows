"use client"

import * as React from "react"
import { useForm, type FieldErrors, type Resolver } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp, type AuthActionState } from "@/features/auth/actions"
import { signUpSchema, type SignUpInput } from "@/features/auth/schemas"

const signUpResolver: Resolver<SignUpInput> = async (values) => {
  const parsed = signUpSchema.safeParse(values)

  if (parsed.success) {
    return { values: parsed.data, errors: {} }
  }

  const fieldErrors = parsed.error.flatten().fieldErrors
  const errors: FieldErrors<SignUpInput> = {}

  for (const field of Object.keys(fieldErrors) as (keyof SignUpInput)[]) {
    const messages = fieldErrors[field]
    if (messages?.length) {
      errors[field] = { type: "validation", message: messages[0] }
    }
  }

  return { values: {}, errors }
}

export function SignUpForm() {
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: signUpResolver,
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    clearErrors()
    setPending(true)

    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("email", values.email)
      formData.append("password", values.password)
      formData.append("confirmPassword", values.confirmPassword)
      formData.append("terms", values.terms ? "on" : "off")

      const result: AuthActionState = await signUp(null, formData)

      if (result?.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.length) {
            setError(field as keyof SignUpInput, {
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
        <Label htmlFor="sign-up-name">Full Name</Label>
        <Input
          id="sign-up-name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          className="transition-all duration-200 focus-visible:ring-ring/60"
          aria-invalid={Boolean(errors.name)}
          disabled={pending}
          required
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sign-up-email">Email</Label>
        <Input
          id="sign-up-email"
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
        <Label htmlFor="sign-up-password">Password</Label>
        <Input
          id="sign-up-password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="sign-up-confirm-password">Confirm Password</Label>
        <Input
          id="sign-up-confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="transition-all duration-200 focus-visible:ring-ring/60"
          aria-invalid={Boolean(errors.confirmPassword)}
          disabled={pending}
          required
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded accent-foreground"
            disabled={pending}
            required
            {...register("terms")}
          />
          <span>I accept the Terms &amp; Privacy Policy</span>
        </label>
        {errors.terms ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.terms.message}
          </p>
        ) : null}
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
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  )
}
