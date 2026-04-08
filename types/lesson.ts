export type Phase = 1 | 2 | 3 | 4 | 5

export type Lesson = {
  id: number
  phase: Phase
  phase_name: string
  order: number
  title: string
  text: string
  unlock_wpm: number
  description?: string
}

export type LessonWithProgress = Lesson & {
  best_wpm?: number
  best_accuracy?: number
  attempts?: number
  completed_at?: string
  is_unlocked: boolean
}
