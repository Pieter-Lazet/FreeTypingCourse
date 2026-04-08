"use client"

import { formatDuration } from "@/lib/typing-engine"

type Props = {
  wpm: number
  accuracy: number
  errors: number
  elapsed: number
}

export function StatsBar({ wpm, accuracy, errors, elapsed }: Props) {
  return (
    <div className="flex items-center gap-8 px-6 py-3 bg-surface border border-[#222222] rounded-sm">
      <StatItem label="WPM" value={wpm} />
      <div className="w-px h-8 bg-[#222222]" />
      <StatItem label="Accuracy" value={`${accuracy}%`} />
      <div className="w-px h-8 bg-[#222222]" />
      <StatItem label="Errors" value={errors} highlight={errors > 0 ? "error" : undefined} />
      <div className="w-px h-8 bg-[#222222]" />
      <StatItem label="Time" value={formatDuration(elapsed)} />
    </div>
  )
}

type StatItemProps = {
  label: string
  value: string | number
  highlight?: "error" | "success"
}

function StatItem({ label, value, highlight }: StatItemProps) {
  const valueClass =
    highlight === "error"
      ? "text-[#E24B4A]"
      : highlight === "success"
      ? "text-[#1DB97A]"
      : "text-[#F5F5F5]"

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-xl font-mono font-medium tabular-nums ${valueClass}`}>
        {value}
      </span>
      <span className="text-xs text-[#888888] uppercase tracking-wider">{label}</span>
    </div>
  )
}
