export type Progress = {
  id: string
  user_id: string
  lesson_id: number
  best_wpm: number
  best_accuracy: number
  attempts: number
  completed_at: string
}

export type LessonResult = {
  wpm: number
  accuracy: number
  errors: number
  duration: number
  lesson_id: number
}

export type DailyProgress = {
  date: string
  wpm: number
  lessons_completed: number
}

export type Badge = {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earned_at?: string
}
