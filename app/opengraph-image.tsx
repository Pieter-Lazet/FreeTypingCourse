import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "FreeTypingCourse — Free Touch Typing Trainer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B0B0B",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: "18px",
            color: "#888888",
            letterSpacing: "0.1em",
            marginBottom: "40px",
            fontFamily: "monospace",
          }}
        >
          FreeTypingCourse
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#F5F5F5",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          Learn to type.{" "}
          <span style={{ color: "#6C63FF" }}>Free. Forever.</span>
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: "24px",
            color: "#888888",
            marginBottom: "60px",
          }}
        >
          50 lessons · WPM tracking · No ads · No payment
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "40px" }}>
          {[
            ["50", "Free lessons"],
            ["5", "Phases"],
            ["$0", "Cost"],
          ].map(([val, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: 600,
                  color: "#F5F5F5",
                  fontFamily: "monospace",
                }}
              >
                {val}
              </span>
              <span style={{ fontSize: "14px", color: "#888888" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
