"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLessons } from "@/hooks/useLessons"
import { useProgress } from "@/hooks/useProgress"
import { LessonCard } from "@/components/ui/LessonCard"
import { ProgressChart } from "@/components/ui/ProgressChart"
import { StreakBadge } from "@/components/ui/StreakBadge"
import { Badge, computeBadges } from "@/components/ui/Badge"
import { supabase } from "@/lib/supabase"
import type { LessonWithProgress } from "@/types/lesson"
import type { DailyProgress } from "@/types/progress"

export default function DashboardPage() {
  const { lessons, loading: lessonsLoading } = useLessons()
  const { getDailyProgress, getStreak, getUserProgress } = useProgress()
  const [chartData, setChartData] = useState<DailyProgress[]>([])
  const [streak, setStreak] = useState(0)
  const [badges, setBadges] = useState(computeBadges([], 0))
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsSignedIn(true)
        setEmail(user.email ?? null)
        const [daily, streakCount, progress] = await Promise.all([
          getDailyProgress(14),
          getStreak(),
          getUserProgress(),
        ])
        setChartData(daily)
        setStreak(streakCount)
        setBadges(computeBadges(progress, streakCount))
      }
    }
    loadData()
  }, [getDailyProgress, getStreak, getUserProgress])

  const phases = groupByPhase(lessons)

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      {/* Nav */}
      <nav className="border-b border-[#222222] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-medium text-[#F5F5F5] tracking-tight">
          FreeTypingCourse
        </Link>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <span className="text-xs text-[#888888]">{email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-xs text-[#888888] hover:text-[#F5F5F5] transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-[#888888] hover:text-[#F5F5F5] transition-colors"
            >
              Sign in to save progress
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-[#F5F5F5]">Lessons</h1>
            <p className="text-sm text-[#888888] mt-1">
              {lessons.filter((l) => l.best_wpm !== undefined).length} of {lessons.length} completed
            </p>
          </div>
          {streak > 0 && <StreakBadge streak={streak} />}
        </div>

        <div className="flex gap-8 items-start">
          {/* Main: lesson list */}
          <div className="flex-1 flex flex-col gap-8">
            {lessonsLoading ? (
              <div className="text-sm text-[#888888]">Loading lessons...</div>
            ) : lessons.length === 0 ? (
              <EmptyLessons />
            ) : (
              phases.map(({ phase, phase_name, lessons: phaseLessons }) => (
                <PhaseSection
                  key={phase}
                  phase={phase}
                  phase_name={phase_name}
                  lessons={phaseLessons}
                />
              ))
            )}
          </div>

          {/* Sidebar */}
          {isSignedIn && (
            <aside className="w-72 flex flex-col gap-6">
              {/* WPM chart */}
              <div className="bg-[#141414] border border-[#222222] rounded-sm p-5">
                <h2 className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-4">
                  WPM — last 14 days
                </h2>
                <ProgressChart data={chartData} />
              </div>

              {/* Badges */}
              <div className="bg-[#141414] border border-[#222222] rounded-sm p-5">
                <h2 className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-4">
                  Badges
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {badges.map((badge) => (
                    <Badge key={badge.id} badge={badge} />
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

function PhaseSection({
  phase,
  phase_name,
  lessons,
}: {
  phase: number
  phase_name: string
  lessons: LessonWithProgress[]
}) {
  const completed = lessons.filter((l) => l.best_wpm !== undefined).length

  return (
    <section aria-labelledby={`phase-${phase}`}>
      <div className="flex items-center gap-3 mb-3">
        <h2 id={`phase-${phase}`} className="text-sm font-medium text-[#F5F5F5]">
          Phase {phase}: {phase_name}
        </h2>
        <span className="text-xs text-[#888888]">
          {completed}/{lessons.length}
        </span>
        <div className="flex-1 h-px bg-[#222222]" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </section>
  )
}

function EmptyLessons() {
  return (
    <div className="py-12 text-center border border-[#222222] rounded-sm bg-[#141414]">
      <p className="text-sm text-[#888888] mb-1">No lessons loaded yet.</p>
      <p className="text-xs text-[#888888]">
        <Link href="/admin/lessons" className="text-[#6C63FF] hover:underline">
          Import lessons
        </Link>{" "}
        to get started.
      </p>
    </div>
  )
}

function groupByPhase(lessons: LessonWithProgress[]) {
  const map = new Map<
    number,
    { phase: number; phase_name: string; lessons: LessonWithProgress[] }
  >()

  for (const lesson of lessons) {
    if (!map.has(lesson.phase)) {
      map.set(lesson.phase, {
        phase: lesson.phase,
        phase_name: lesson.phase_name,
        lessons: [],
      })
    }
    map.get(lesson.phase)!.lessons.push(lesson)
  }

  return Array.from(map.values()).sort((a, b) => a.phase - b.phase)
}
