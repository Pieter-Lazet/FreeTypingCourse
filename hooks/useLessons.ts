"use client"

import { useState, useEffect } from "react"
import { getAllLessons, getLessonsWithProgress } from "@/lib/lessons"
import type { Lesson, LessonWithProgress } from "@/types/lesson"
import { supabase } from "@/lib/supabase"

export function useLessons() {
  const [lessons, setLessons] = useState<LessonWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const data = await getLessonsWithProgress(user.id)
          setLessons(data)
        } else {
          const data = await getAllLessons()
          setLessons(
            data.map((l, i) => ({
              ...l,
              is_unlocked: i === 0 || l.unlock_wpm === 0,
            }))
          )
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load lessons")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { lessons, loading, error }
}

export function useSingleLesson(id: number) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("lessons")
          .select("*")
          .eq("id", id)
          .single()
        setLesson(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lesson not found")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return { lesson, loading, error }
}
