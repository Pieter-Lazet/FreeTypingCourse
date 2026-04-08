import type { Badge as BadgeType } from "@/types/progress"

type Props = {
  badge: BadgeType
}

export function Badge({ badge }: Props) {
  return (
    <div
      className={`
        flex flex-col items-center gap-2 p-4 border rounded-sm text-center
        ${badge.earned
          ? "border-[#6C63FF33] bg-[#6C63FF0A]"
          : "border-[#222222] bg-[#141414] opacity-40"
        }
      `}
      title={badge.earned ? `Earned${badge.earned_at ? ` on ${new Date(badge.earned_at).toLocaleDateString()}` : ""}` : "Not earned yet"}
    >
      <span className="text-2xl" aria-hidden="true">{badge.icon}</span>
      <div>
        <p className={`text-xs font-medium ${badge.earned ? "text-[#F5F5F5]" : "text-[#888888]"}`}>
          {badge.name}
        </p>
        <p className="text-xs text-[#888888] mt-0.5">{badge.description}</p>
      </div>
    </div>
  )
}

export const BADGES: BadgeType[] = [
  {
    id: "first-lesson",
    name: "First Step",
    description: "Complete your first lesson",
    icon: "🎯",
    earned: false,
  },
  {
    id: "wpm-30",
    name: "Getting There",
    description: "Reach 30 WPM",
    icon: "⚡",
    earned: false,
  },
  {
    id: "wpm-60",
    name: "Speed Typist",
    description: "Reach 60 WPM",
    icon: "🚀",
    earned: false,
  },
  {
    id: "phase-1",
    name: "Home Row Hero",
    description: "Complete Phase 1",
    icon: "🏠",
    earned: false,
  },
  {
    id: "phase-2",
    name: "Top Shelf",
    description: "Complete Phase 2",
    icon: "⬆️",
    earned: false,
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "7-day streak",
    icon: "🔥",
    earned: false,
  },
]

export function computeBadges(
  progress: { lesson_id: number; best_wpm: number }[],
  streak: number
): BadgeType[] {
  const maxWpm = progress.reduce((max, p) => Math.max(max, p.best_wpm), 0)
  return BADGES.map((badge) => {
    let earned = false
    switch (badge.id) {
      case "first-lesson":
        earned = progress.length > 0
        break
      case "wpm-30":
        earned = maxWpm >= 30
        break
      case "wpm-60":
        earned = maxWpm >= 60
        break
      case "streak-7":
        earned = streak >= 7
        break
      default:
        earned = false
    }
    return { ...badge, earned }
  })
}
