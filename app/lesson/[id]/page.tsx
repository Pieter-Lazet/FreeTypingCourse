"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { TypingTrainer } from "@/components/typing/TypingTrainer"
import type { Lesson } from "@/types/lesson"

export default function LessonPage() {
  const params = useParams()
  const lessonId = parseInt(params.id as string)

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [nextLessonId, setNextLessonId] = useState<number | null>(null)
  const [isGuest, setIsGuest] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [lessonResult, userResult] = await Promise.all([
          supabase.from("lessons").select("*").eq("id", lessonId).single(),
          supabase.auth.getUser(),
        ])

        if (lessonResult.error || !lessonResult.data) {
          setError("Lesson not found.")
          return
        }

        setLesson(lessonResult.data)
        setIsGuest(!userResult.data.user)

        // Find next lesson
        const { data: nextLesson } = await supabase
          .from("lessons")
          .select("id")
          .eq("phase", lessonResult.data.phase)
          .eq("order", lessonResult.data.order + 1)
          .single()

        if (nextLesson) {
          setNextLessonId(nextLesson.id)
        } else {
          // Try first lesson of next phase
          const { data: nextPhaseLesson } = await supabase
            .from("lessons")
            .select("id")
            .eq("phase", lessonResult.data.phase + 1)
            .eq("order", 1)
            .single()
          setNextLessonId(nextPhaseLesson?.id ?? null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load lesson")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [lessonId])

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      {/* Nav */}
      <nav className="border-b border-[#222222] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-medium text-[#F5F5F5] tracking-tight">
          FreeTypingCourse
        </Link>
        <div className="flex items-center gap-4">
          {lesson && (
            <span className="text-xs text-[#888888]">
              Phase {lesson.phase} — {lesson.title}
            </span>
          )}
          <Link
            href="/dashboard"
            className="text-sm text-[#888888] hover:text-[#F5F5F5] transition-colors"
          >
            ← Lessons
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {loading && (
          <div className="text-sm text-[#888888]">Loading lesson...</div>
        )}

        {error && (
          <div className="text-sm text-[#E24B4A]" role="alert">
            {error}
          </div>
        )}

        {lesson && !loading && (
          <div className="flex flex-col gap-6">
            {/* Lesson header */}
            <div>
              <h1 className="text-xl font-semibold text-[#F5F5F5]">{lesson.title}</h1>
              <p className="text-sm text-[#888888] mt-1">
                Phase {lesson.phase}: {lesson.phase_name}
              </p>
            </div>

            {/* Trainer */}
            <TypingTrainer
              lesson={lesson}
              nextLessonId={nextLessonId}
              isGuest={isGuest}
            />
          </div>
        )}
      </div>
    </div>
  )
}
