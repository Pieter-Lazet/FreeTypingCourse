"use client"

import { useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { Progress, LessonResult, DailyProgress } from "@/types/progress"

export function useProgress() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveProgress = useCallback(async (result: LessonResult): Promise<void> => {
    setSaving(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: existing } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("lesson_id", result.lesson_id)
        .single()

      if (existing) {
        await supabase
          .from("progress")
          .update({
            best_wpm: Math.max(existing.best_wpm, result.wpm),
            best_accuracy: Math.max(existing.best_accuracy, result.accuracy),
            attempts: existing.attempts + 1,
            completed_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
      } else {
        await supabase.from("progress").insert({
          user_id: user.id,
          lesson_id: result.lesson_id,
          best_wpm: result.wpm,
          best_accuracy: result.accuracy,
          attempts: 1,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save progress")
    } finally {
      setSaving(false)
    }
  }, [])

  const getUserProgress = useCallback(async (): Promise<Progress[]> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })

    return data ?? []
  }, [])

  const getDailyProgress = useCallback(async (days = 14): Promise<DailyProgress[]> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const since = new Date()
    since.setDate(since.getDate() - days)

    const { data } = await supabase
      .from("progress")
      .select("completed_at, best_wpm")
      .eq("user_id", user.id)
      .gte("completed_at", since.toISOString())
      .order("completed_at", { ascending: true })

    if (!data) return []

    const byDate = new Map<string, { wpm: number; count: number }>()
    for (const row of data) {
      const date = row.completed_at.split("T")[0]
      const existing = byDate.get(date) ?? { wpm: 0, count: 0 }
      byDate.set(date, {
        wpm: Math.max(existing.wpm, row.best_wpm),
        count: existing.count + 1,
      })
    }

    return Array.from(byDate.entries()).map(([date, { wpm, count }]) => ({
      date,
      wpm,
      lessons_completed: count,
    }))
  }, [])

  const getStreak = useCallback(async (): Promise<number> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { data } = await supabase
      .from("progress")
      .select("completed_at")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })

    if (!data || data.length === 0) return 0

    const dates = new Set(data.map((d) => d.completed_at.split("T")[0]))
    let streak = 0
    const today = new Date()

    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split("T")[0]
      if (dates.has(dateStr)) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    return streak
  }, [])

  return { saveProgress, getUserProgress, getDailyProgress, getStreak, saving, error }
}
