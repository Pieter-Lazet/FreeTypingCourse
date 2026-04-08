"use client"

import { useMemo } from "react"

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
]

const HOME_ROW = new Set(["a", "s", "d", "f", "j", "k", "l", ";"])

type Finger =
  | "left-pinky"
  | "left-ring"
  | "left-middle"
  | "left-index"
  | "thumb"
  | "right-index"
  | "right-middle"
  | "right-ring"
  | "right-pinky"

const KEY_FINGER: Record<string, Finger> = {
  // Left pinky
  q: "left-pinky", a: "left-pinky", z: "left-pinky",
  // Left ring
  w: "left-ring", s: "left-ring", x: "left-ring",
  // Left middle
  e: "left-middle", d: "left-middle", c: "left-middle",
  // Left index
  r: "left-index", f: "left-index", v: "left-index",
  t: "left-index", g: "left-index", b: "left-index",
  // Right index
  y: "right-index", h: "right-index", n: "right-index",
  u: "right-index", j: "right-index", m: "right-index",
  // Right middle
  i: "right-middle", k: "right-middle", ",": "right-middle",
  // Right ring
  o: "right-ring", l: "right-ring", ".": "right-ring",
  // Right pinky
  p: "right-pinky", ";": "right-pinky", "/": "right-pinky",
  "[": "right-pinky", "]": "right-pinky", "\\": "right-pinky", "'": "right-pinky",
}

const FINGER_COLORS: Record<Finger, string> = {
  "left-pinky": "#FF6B9D",
  "left-ring": "#A855F7",
  "left-middle": "#3B82F6",
  "left-index": "#F59E0B",
  "thumb": "#888888",
  "right-index": "#F59E0B",
  "right-middle": "#3B82F6",
  "right-ring": "#A855F7",
  "right-pinky": "#FF6B9D",
}

const FINGER_NAMES: Record<Finger, string> = {
  "left-pinky": "Left pinky",
  "left-ring": "Left ring finger",
  "left-middle": "Left middle finger",
  "left-index": "Left index finger",
  "thumb": "Thumbs — Space bar",
  "right-index": "Right index finger",
  "right-middle": "Right middle finger",
  "right-ring": "Right ring finger",
  "right-pinky": "Right pinky",
}

type Props = {
  nextKey: string
  lastKeyCorrect: boolean | null
  currentKey: string
}

export function Keyboard({ nextKey, lastKeyCorrect, currentKey }: Props) {
  const nextKeyLower = nextKey.toLowerCase()
  const currentKeyLower = currentKey.toLowerCase()

  const activeFinger: Finger | null = useMemo(() => {
    if (nextKeyLower === " ") return "thumb"
    return KEY_FINGER[nextKeyLower] ?? null
  }, [nextKeyLower])

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Keyboard rows */}
      <div className="flex flex-col gap-1.5">
        {/* Top row */}
        <div className="flex gap-1.5 justify-center">
          {ROWS[0].map((key) => (
            <Key
              key={key}
              label={key}
              isNext={key === nextKeyLower || (nextKeyLower === key)}
              isJustPressed={currentKeyLower === key}
              wasCorrect={lastKeyCorrect}
              isHomeRow={HOME_ROW.has(key)}
              finger={KEY_FINGER[key]}
            />
          ))}
        </div>
        {/* Home row */}
        <div className="flex gap-1.5 justify-center ml-4">
          {ROWS[1].map((key) => (
            <Key
              key={key}
              label={key}
              isNext={key === nextKeyLower}
              isJustPressed={currentKeyLower === key}
              wasCorrect={lastKeyCorrect}
              isHomeRow={HOME_ROW.has(key)}
              finger={KEY_FINGER[key]}
            />
          ))}
        </div>
        {/* Bottom row */}
        <div className="flex gap-1.5 justify-center ml-10">
          {ROWS[2].map((key) => (
            <Key
              key={key}
              label={key}
              isNext={key === nextKeyLower}
              isJustPressed={currentKeyLower === key}
              wasCorrect={lastKeyCorrect}
              isHomeRow={HOME_ROW.has(key)}
              finger={KEY_FINGER[key]}
            />
          ))}
        </div>
        {/* Space bar */}
        <div className="flex justify-center">
          <Key
            label="space"
            isNext={nextKey === " "}
            isJustPressed={currentKey === " "}
            wasCorrect={lastKeyCorrect}
            isHomeRow={false}
            finger="thumb"
            wide
          />
        </div>
      </div>

      {/* Finger hint */}
      {activeFinger && (
        <p className="text-xs text-[#888888] mt-1">
          Use your{" "}
          <span style={{ color: FINGER_COLORS[activeFinger] }}>
            {FINGER_NAMES[activeFinger]}
          </span>
        </p>
      )}
    </div>
  )
}

type KeyProps = {
  label: string
  isNext: boolean
  isJustPressed: boolean
  wasCorrect: boolean | null
  isHomeRow: boolean
  finger?: Finger
  wide?: boolean
}

function Key({ label, isNext, isJustPressed, wasCorrect, isHomeRow, finger, wide }: KeyProps) {
  let bg = "#141414"
  let borderColor = "#222222"
  let textColor = "#888888"

  if (isHomeRow) {
    bg = "#1a1a2e"
    borderColor = "#6C63FF44"
    textColor = "#9d9aff"
  }

  if (isNext) {
    bg = "#6C63FF"
    borderColor = "#6C63FF"
    textColor = "#ffffff"
  }

  if (isJustPressed && wasCorrect === true) {
    bg = "#1DB97A22"
    borderColor = "#1DB97A"
    textColor = "#1DB97A"
  }

  if (isJustPressed && wasCorrect === false) {
    bg = "#E24B4A22"
    borderColor = "#E24B4A"
    textColor = "#E24B4A"
  }

  const fingerColor = finger ? FINGER_COLORS[finger] : undefined

  return (
    <div
      className={`
        flex items-center justify-center rounded-sm
        border transition-all duration-75 select-none
        ${wide ? "w-48 h-9" : "w-9 h-9"}
        text-xs font-mono uppercase
      `}
      style={{
        backgroundColor: bg,
        borderColor,
        color: textColor,
        ...(isNext && fingerColor ? { boxShadow: `0 0 8px ${fingerColor}44` } : {}),
      }}
      aria-hidden="true"
    >
      {label === "space" ? "" : label}
    </div>
  )
}
