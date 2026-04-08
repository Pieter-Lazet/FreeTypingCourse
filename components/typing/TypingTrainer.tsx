"use client"

import { useRef, useEffect } from "react"
import { useTyping } from "@/hooks/useTyping"
import { useProgress } from "@/hooks/useProgress"
import { Keyboard } from "./Keyboard"
import { StatsBar } from "./StatsBar"
import { ResultsPanel } from "./ResultsPanel"
import type { Lesson } from "@/types/lesson"

type Props = {
  lesson: Lesson
  nextLessonId: number | null
  isGuest: boolean
}

export function TypingTrainer({ lesson, nextLessonId, isGuest }: Props) {
  const [state, actions] = useTyping(lesson.text)
  const { saveProgress } = useProgress()
  const savedRef = useRef(false)

  const nextChar = lesson.text[state.cursorIndex] ?? ""

  // Save progress on completion
  useEffect(() => {
    if (state.status === "completed" && !savedRef.current && !isGuest) {
      savedRef.current = true
      saveProgress({
        wpm: state.wpm,
        accuracy: state.accuracy,
        errors: state.errors,
        duration: state.elapsed,
        lesson_id: lesson.id,
      })
    }
  }, [state.status, state.wpm, state.accuracy, state.errors, state.elapsed, lesson.id, isGuest, saveProgress])

  const handleRetry = () => {
    savedRef.current = false
    actions.reset()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* CapsLock warning */}
      {state.capsLockOn && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E24B4A11] border border-[#E24B4A44] rounded-sm text-sm text-[#E24B4A]"
          role="alert"
        >
          <span aria-hidden="true">⚠</span>
          Caps Lock is on — turn it off to type correctly
        </div>
      )}

      {/* Main trainer layout */}
      <div className="flex gap-8 items-start">
        {/* Left: text + stats */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Lesson description */}
          {lesson.description && state.status === "idle" && (
            <div className="px-4 py-3 bg-[#141414] border border-[#222222] rounded-sm text-sm text-[#888888]">
              <span className="text-[#6C63FF] font-medium">Tip: </span>
              {lesson.description}
            </div>
          )}

          {/* Text display */}
          <TextDisplay
            charResults={state.charResults}
            cursorIndex={state.cursorIndex}
          />

          {/* Stats bar */}
          <StatsBar
            wpm={state.wpm}
            accuracy={state.accuracy}
            errors={state.errors}
            elapsed={state.elapsed}
          />

          {/* Hidden input */}
          <input
            ref={actions.inputRef}
            type="text"
            className="sr-only"
            aria-label="Typing input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            readOnly
          />

          {/* Idle hint */}
          {state.status === "idle" && (
            <p className="text-xs text-[#888888] text-center">
              Click anywhere and start typing to begin
            </p>
          )}
        </div>

        {/* Right: keyboard */}
        <div className="flex-shrink-0">
          <Keyboard
            nextKey={nextChar}
            currentKey={state.currentKey}
            lastKeyCorrect={state.lastKeyCorrect}
          />
        </div>
      </div>

      {/* Results overlay */}
      {state.status === "completed" && (
        <ResultsPanel
          wpm={state.wpm}
          accuracy={state.accuracy}
          errors={state.errors}
          elapsed={state.elapsed}
          nextLessonId={nextLessonId}
          isGuest={isGuest}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}

type TextDisplayProps = {
  charResults: { char: string; state: "pending" | "correct" | "wrong" }[]
  cursorIndex: number
}

function TextDisplay({ charResults, cursorIndex }: TextDisplayProps) {
  return (
    <div
      className="font-mono text-xl leading-relaxed p-6 bg-[#141414] border border-[#222222] rounded-sm select-none"
      style={{ lineHeight: "1.8", letterSpacing: "0.05em" }}
      aria-label="Text to type"
      aria-live="polite"
    >
      {charResults.map((result, i) => {
        const isCursor = i === cursorIndex

        let className = ""
        if (result.state === "correct") {
          className = "text-[#1DB97A]"
        } else if (result.state === "wrong") {
          className = "text-[#E24B4A] bg-[#E24B4A18] rounded-sm"
        } else {
          className = "text-[#888888]"
        }

        return (
          <span key={i} className="relative">
            {isCursor && (
              <span
                className="absolute -left-px top-0 h-full w-0.5 bg-[#6C63FF] typing-cursor"
                aria-hidden="true"
              />
            )}
            <span className={className}>
              {result.char === " " ? "\u00A0" : result.char}
            </span>
          </span>
        )
      })}
    </div>
  )
}
