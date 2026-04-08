export type CharState = "pending" | "correct" | "wrong"

export type CharResult = {
  char: string
  state: CharState
}

export function buildCharResults(text: string, typed: string): CharResult[] {
  return text.split("").map((char, index) => {
    if (index >= typed.length) return { char, state: "pending" }
    if (typed[index] === char) return { char, state: "correct" }
    return { char, state: "wrong" }
  })
}

export function calculateWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds === 0) return 0
  const minutes = elapsedSeconds / 60
  const words = correctChars / 5
  return Math.round(words / minutes)
}

export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars === 0) return 100
  return Math.round((correctChars / totalChars) * 10000) / 100
}

export function countErrors(text: string, typed: string): number {
  let errors = 0
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== text[i]) errors++
  }
  return errors
}

export function getMotivationalMessage(wpm: number): string {
  if (wpm < 20) return "Keep going — every keystroke builds muscle memory!"
  if (wpm < 40) return "Nice work! You're developing a solid foundation."
  if (wpm < 60) return "Great job! You're typing faster than most people."
  return "Outstanding! You're a touch typing pro!"
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s}s`
}
