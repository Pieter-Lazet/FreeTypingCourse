type Props = {
  streak: number
}

export function StreakBadge({ streak }: Props) {
  if (streak === 0) return null

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#222222] rounded-sm">
      <span className="text-base" aria-hidden="true">🔥</span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[#F5F5F5] tabular-nums">
          {streak} day{streak !== 1 ? "s" : ""} streak
        </span>
        <span className="text-xs text-[#888888]">Keep it up!</span>
      </div>
    </div>
  )
}
