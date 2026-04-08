"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import type { DailyProgress } from "@/types/progress"

type Props = {
  data: DailyProgress[]
}

export function ProgressChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-[#888888]">
        Complete lessons to see your progress
      </div>
    )
  }

  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={formatted} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#888888" }}
          axisLine={{ stroke: "#222222" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#888888" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            border: "0.5px solid #222222",
            borderRadius: "2px",
            fontSize: "12px",
            color: "#F5F5F5",
          }}
          labelStyle={{ color: "#888888" }}
          formatter={(value) => [`${value} WPM`, "Best WPM"]}
        />
        <Line
          type="monotone"
          dataKey="wpm"
          stroke="#6C63FF"
          strokeWidth={1.5}
          dot={{ fill: "#6C63FF", r: 2, strokeWidth: 0 }}
          activeDot={{ r: 4, fill: "#6C63FF" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
