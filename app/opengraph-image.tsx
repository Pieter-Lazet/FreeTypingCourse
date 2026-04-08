import { ImageResponse } from "next/og"

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
        <div
          style={{
            display: "flex",
            fontSize: "16px",
            color: "#888888",
            letterSpacing: "0.1em",
            marginBottom: "40px",
          }}
        >
          FreeTypingCourse
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            fontSize: "64px",
            fontWeight: 700,
            color: "#F5F5F5",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          <span style={{ marginRight: "16px" }}>Learn to type.</span>
          <span style={{ color: "#6C63FF" }}>Free. Forever.</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#888888",
            marginBottom: "60px",
          }}
        >
          50 lessons · WPM tracking · No ads · No payment
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "40px" }}>
          {[
            ["50", "Free lessons"],
            ["5", "Phases"],
            ["$0", "Cost"],
          ].map(([val, label]) => (
            <div
              key={label}
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <span style={{ fontSize: "36px", fontWeight: 600, color: "#F5F5F5" }}>
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
