"use client"

import Link from "next/link"
import { getMotivationalMessage, formatDuration } from "@/lib/typing-engine"

type Props = {
  wpm: number
  accuracy: number
  errors: number
  elapsed: number
  nextLessonId: number | null
  isGuest: boolean
  onRetry: () => void
}

export function ResultsPanel({
  wpm,
  accuracy,
  errors,
  elapsed,
  nextLessonId,
  isGuest,
  onRetry,
}: Props) {
  const message = getMotivationalMessage(wpm)

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(11,11,11,0.9)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Lesson results"
    >
      <div className="bg-[#141414] border border-[#222222] rounded-sm p-10 w-[480px] flex flex-col gap-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-[#F5F5F5]">Lesson complete</h2>
          <p className="text-sm text-[#888888] mt-1">{message}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <ResultStat label="WPM" value={wpm} unit="" accent />
          <ResultStat label="Accuracy" value={`${accuracy}%`} />
          <ResultStat label="Errors" value={errors} highlight={errors > 0 ? "error" : undefined} />
          <ResultStat label="Time" value={formatDuration(elapsed)} />
        </div>

        {/* Guest prompt */}
        {isGuest && (
          <div className="border border-[#6C63FF44] bg-[#6C63FF11] rounded-sm p-4">
            <p className="text-sm text-[#F5F5F5]">
              <span className="text-[#6C63FF] font-medium">Sign up to save your progress.</span>{" "}
              Your results won&apos;t be saved in guest mode.
            </p>
            <Link
              href="/login"
              className="inline-block mt-3 px-4 py-2 bg-[#6C63FF] text-white text-sm rounded-sm hover:bg-[#5b54e0] transition-colors"
            >
              Create free account
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {nextLessonId && (
            <Link
              href={`/lesson/${nextLessonId}`}
              className="flex-1 py-3 bg-[#6C63FF] text-white text-sm text-center rounded-sm hover:bg-[#5b54e0] transition-colors font-medium"
            >
              Next Lesson →
            </Link>
          )}
          <button
            onClick={onRetry}
            className={`${nextLessonId ? "px-6" : "flex-1"} py-3 border border-[#222222] text-[#888888] text-sm rounded-sm hover:border-[#444444] hover:text-[#F5F5F5] transition-colors`}
          >
            Retry
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-[#222222] text-[#888888] text-sm rounded-sm hover:border-[#444444] hover:text-[#F5F5F5] transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

type ResultStatProps = {
  label: string
  value: string | number
  unit?: string
  accent?: boolean
  highlight?: "error"
}

function ResultStat({ label, value, accent, highlight }: ResultStatProps) {
  const valueClass = accent
    ? "text-[#6C63FF]"
    : highlight === "error"
    ? "text-[#E24B4A]"
    : "text-[#F5F5F5]"

  return (
    <div className="bg-[#0B0B0B] border border-[#222222] rounded-sm p-4">
      <div className={`text-2xl font-mono font-medium tabular-nums ${valueClass}`}>
        {value}
      </div>
      <div className="text-xs text-[#888888] mt-1 uppercase tracking-wider">{label}</div>
    </div>
  )
}
