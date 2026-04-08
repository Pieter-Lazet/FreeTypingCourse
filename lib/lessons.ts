import { supabase } from "./supabase"
import type { Lesson, LessonWithProgress } from "@/types/lesson"
import type { Progress } from "@/types/progress"

export async function getAllLessons(): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .order("phase", { ascending: true })
    .order("order", { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getLessonById(id: number): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data
}

export async function getLessonsWithProgress(userId: string): Promise<LessonWithProgress[]> {
  const [lessonsResult, progressResult] = await Promise.all([
    supabase.from("lessons").select("*").order("phase").order("order"),
    supabase.from("progress").select("*").eq("user_id", userId),
  ])

  if (lessonsResult.error) throw lessonsResult.error

  const lessons = lessonsResult.data ?? []
  const progressMap = new Map<number, Progress>()
  for (const p of progressResult.data ?? []) {
    progressMap.set(p.lesson_id, p)
  }

  return lessons.map((lesson, index) => {
    const progress = progressMap.get(lesson.id)
    const prevLesson = index > 0 ? lessons[index - 1] : null
    const prevProgress = prevLesson ? progressMap.get(prevLesson.id) : null

    let is_unlocked = false
    if (lesson.unlock_wpm === 0) {
      is_unlocked = true
    } else if (prevProgress && prevProgress.best_wpm >= lesson.unlock_wpm) {
      is_unlocked = true
    }

    return {
      ...lesson,
      best_wpm: progress?.best_wpm,
      best_accuracy: progress?.best_accuracy,
      attempts: progress?.attempts,
      completed_at: progress?.completed_at,
      is_unlocked,
    }
  })
}

export async function importLessons(lessons: Lesson[]): Promise<void> {
  const { error } = await supabase
    .from("lessons")
    .upsert(lessons, { onConflict: "id" })

  if (error) throw error
}

export function parseCsvLessons(csv: string): Lesson[] {
  const lines = csv.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = values[i]?.trim() ?? ""
    })

    return {
      id: parseInt(obj.id),
      phase: parseInt(obj.phase) as 1 | 2 | 3 | 4 | 5,
      phase_name: obj.phase_name,
      order: parseInt(obj.order),
      title: obj.title,
      text: obj.text,
      unlock_wpm: parseInt(obj.unlock_wpm) || 0,
      description: obj.description || undefined,
    }
  })
}

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      values.push(current)
      current = ""
    } else {
      current += char
    }
  }
  values.push(current)
  return values
}
