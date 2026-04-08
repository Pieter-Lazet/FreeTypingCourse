"use client"

import Link from "next/link"
import type { LessonWithProgress } from "@/types/lesson"

type Props = {
  lesson: LessonWithProgress
}

export function LessonCard({ lesson }: Props) {
  const isCompleted = lesson.best_wpm !== undefined
  const isLocked = !lesson.is_unlocked

  const content = (
    <div
      className={`
        p-4 border rounded-sm transition-colors
        ${isLocked
          ? "border-[#222222] bg-[#0e0e0e] opacity-50 cursor-not-allowed"
          : isCompleted
          ? "border-[#1DB97A33] bg-[#141414] hover:border-[#1DB97A66]"
          : "border-[#222222] bg-[#141414] hover:border-[#444444]"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            {isLocked && (
              <LockIcon className="text-[#888888] flex-shrink-0" />
            )}
            {isCompleted && !isLocked && (
              <CheckIcon className="text-[#1DB97A] flex-shrink-0" />
            )}
            <span className={`text-sm font-medium truncate ${isLocked ? "text-[#888888]" : "text-[#F5F5F5]"}`}>
              {lesson.title}
            </span>
          </div>

          {isLocked ? (
            <span className="text-xs text-[#888888]">
              Reach {lesson.unlock_wpm} WPM in previous lesson to unlock
            </span>
          ) : isCompleted ? (
            <div className="flex items-center gap-3 text-xs text-[#888888]">
              <span>
                <span className="text-[#1DB97A] font-medium">{lesson.best_wpm}</span> WPM
              </span>
              <span>
                <span className="text-[#F5F5F5]">{lesson.best_accuracy}%</span> accuracy
              </span>
              {lesson.attempts && lesson.attempts > 1 && (
                <span>{lesson.attempts} attempts</span>
              )}
            </div>
          ) : (
            <span className="text-xs text-[#888888]">Not started</span>
          )}
        </div>

        {!isLocked && (
          <div className="flex-shrink-0">
            <WPMBar wpm={lesson.best_wpm ?? 0} maxWpm={80} />
          </div>
        )}
      </div>
    </div>
  )

  if (isLocked) return content

  return (
    <Link href={`/lesson/${lesson.id}`} className="block" aria-label={`${lesson.title}${isCompleted ? `, best ${lesson.best_wpm} WPM` : ""}`}>
      {content}
    </Link>
  )
}

function WPMBar({ wpm, maxWpm }: { wpm: number; maxWpm: number }) {
  const pct = Math.min((wpm / maxWpm) * 100, 100)
  if (wpm === 0) return null

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="text-xs text-[#1DB97A] font-mono">{wpm}</span>
      <div className="w-16 h-1 bg-[#222222] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1DB97A] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`w-3.5 h-3.5 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`w-3.5 h-3.5 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
