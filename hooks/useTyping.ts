"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  buildCharResults,
  calculateWPM,
  calculateAccuracy,
  countErrors,
  type CharResult,
} from "@/lib/typing-engine"

export type TypingStatus = "idle" | "active" | "completed"

export type TypingState = {
  charResults: CharResult[]
  typed: string
  cursorIndex: number
  wpm: number
  accuracy: number
  errors: number
  elapsed: number
  status: TypingStatus
  capsLockOn: boolean
  currentKey: string
  lastKeyCorrect: boolean | null
}

export type TypingActions = {
  handleKeyDown: (e: KeyboardEvent) => void
  reset: () => void
  inputRef: React.RefObject<HTMLInputElement>
}

export function useTyping(text: string): [TypingState, TypingActions] {
  const [typed, setTyped] = useState("")
  const [status, setStatus] = useState<TypingStatus>("idle")
  const [elapsed, setElapsed] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [capsLockOn, setCapsLockOn] = useState(false)
  const [currentKey, setCurrentKey] = useState("")
  const [lastKeyCorrect, setLastKeyCorrect] = useState<boolean | null>(null)

  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const charResults = buildCharResults(text, typed)
  const cursorIndex = typed.length
  const errors = countErrors(text, typed)
  const correctChars = charResults.filter((c) => c.state === "correct").length
  const accuracy = calculateAccuracy(correctChars, typed.length)

  useEffect(() => {
    if (status === "active") {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const secs = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setElapsed(secs)
          if (secs >= 2) {
            setWpm(calculateWPM(correctChars, secs))
          }
        }
      }, 500)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [status, correctChars])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      setCapsLockOn(e.getModifierState("CapsLock"))

      if (e.key === "Tab") {
        e.preventDefault()
        return
      }

      // Prevent copy/paste
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        return
      }

      if (status === "completed") return

      const nextChar = text[typed.length]
      if (!nextChar) return

      if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1))
        return
      }

      if (e.key.length !== 1) return

      if (status === "idle") {
        setStatus("active")
        startTimeRef.current = Date.now()
      }

      const isCorrect = e.key === nextChar
      setCurrentKey(e.key)
      setLastKeyCorrect(isCorrect)

      const newTyped = typed + e.key
      setTyped(newTyped)

      if (newTyped.length === text.length) {
        setStatus("completed")
        const finalSecs = startTimeRef.current
          ? Math.floor((Date.now() - startTimeRef.current) / 1000)
          : elapsed
        setElapsed(finalSecs)
        setWpm(calculateWPM(correctChars + (isCorrect ? 1 : 0), finalSecs))
      }
    },
    [status, text, typed, elapsed, correctChars]
  )

  const reset = useCallback(() => {
    setTyped("")
    setStatus("idle")
    setElapsed(0)
    setWpm(0)
    setCurrentKey("")
    setLastKeyCorrect(null)
    startTimeRef.current = null
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      setCapsLockOn(e.getModifierState("CapsLock"))
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyDown])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return [
    {
      charResults,
      typed,
      cursorIndex,
      wpm,
      accuracy,
      errors,
      elapsed,
      status,
      capsLockOn,
      currentKey,
      lastKeyCorrect,
    },
    { handleKeyDown, reset, inputRef },
  ]
}
