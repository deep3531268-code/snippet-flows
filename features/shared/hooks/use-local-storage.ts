"use client"

import { useEffect, useState, type Dispatch, type SetStateAction } from "react"

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate: (raw: string | null) => T,
  serialize: (value: T) => string,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      setValue(validate(window.localStorage.getItem(key)))
    } catch {
      setValue(initialValue)
    }
    setHydrated(true)
  }, [key])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(key, serialize(value))
    } catch {}
  }, [key, hydrated, value, serialize])

  return [value, setValue]
}
