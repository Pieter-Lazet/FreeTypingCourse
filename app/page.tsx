import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: {
    absolute: "FreeTypingCourse — Free Touch Typing Trainer",
  },
  description:
    "Learn to type faster with 50 free lessons. No payment, no ads. Track your WPM and accuracy as you improve.",
  alternates: {
    canonical: "https://freetypingcourse.vercel.app",
  },
}

const FEATURES = [
  {
    icon: "∞",
    title: "Free forever",
    desc: "All 50 lessons, all features — zero cost, no credit card, no premium tier.",
  },
  {
    icon: "📊",
    title: "Progress tracking",
    desc: "WPM, accuracy, and error tracking per lesson. See your improvement over time.",
  },
  {
    icon: "⌨️",
    title: "50 structured lessons",
    desc: "From home row basics to full keyboard mastery, unlocking as you improve.",
  },
  {
    icon: "⚡",
    title: "No ads, no distractions",
    desc: "Pure typing practice. Nothing between you and the keyboard.",
  },
]

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Start with the home row",
    desc: "Learn F and J first — your fingers' resting position. The foundation of touch typing.",
  },
  {
    step: "02",
    title: "Unlock new keys as you improve",
    desc: "Each lesson unlocks the next when you hit the target WPM. No skipping ahead.",
  },
  {
    step: "03",
    title: "Track your progress",
    desc: "Create a free account to save your WPM history, streaks, and badges.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      {/* Nav */}
      <nav className="border-b border-[#222222] px-8 py-4 flex items-center justify-between">
        <span className="font-mono text-sm font-medium text-[#F5F5F5] tracking-tight">
          FreeTypingCourse
        </span>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-[#888888] hover:text-[#F5F5F5] transition-colors">
            Lessons
          </Link>
          <Link
            href="/login"
            className="text-sm text-[#888888] hover:text-[#F5F5F5] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-1.5 bg-[#6C63FF] text-white text-sm rounded-sm hover:bg-[#5b54e0] transition-colors"
          >
            Start typing
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6C63FF11] border border-[#6C63FF33] rounded-full text-xs text-[#9d9aff] mb-8">
          <span className="w-1.5 h-1.5 bg-[#6C63FF] rounded-full" aria-hidden="true" />
          50 lessons · No account required
        </div>

        <h1 className="text-[42px] font-semibold leading-tight tracking-tight text-[#F5F5F5] mb-4">
          Learn to type.<br />
          <span className="text-[#6C63FF]">Free. Forever.</span>
        </h1>

        <p className="text-lg text-[#888888] max-w-xl mx-auto mb-10">
          Structured touch typing lessons that take you from hunt-and-peck to fluent typing.
          Track your WPM, fix your accuracy, build muscle memory.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/lesson/1"
            className="px-8 py-3 bg-[#6C63FF] text-white text-sm font-medium rounded-sm hover:bg-[#5b54e0] transition-colors"
          >
            Start typing — it&apos;s free
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 border border-[#222222] text-[#888888] text-sm rounded-sm hover:border-[#444444] hover:text-[#F5F5F5] transition-colors"
          >
            View all lessons
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-16 flex items-center justify-center gap-12 py-6 border-y border-[#222222]">
          <DemoStat value="50" label="Free lessons" />
          <div className="w-px h-8 bg-[#222222]" />
          <DemoStat value="5" label="Phases" />
          <div className="w-px h-8 bg-[#222222]" />
          <DemoStat value="$0" label="Cost" />
          <div className="w-px h-8 bg-[#222222]" />
          <DemoStat value="0" label="Ads" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-xl font-semibold text-[#F5F5F5] mb-8">
          Everything you need. Nothing you don&apos;t.
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-5 bg-[#141414] border border-[#222222] rounded-sm">
              <div className="text-xl mb-3" aria-hidden="true">{f.icon}</div>
              <h3 className="text-sm font-medium text-[#F5F5F5] mb-1.5">{f.title}</h3>
              <p className="text-sm text-[#888888] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-8 py-16 border-t border-[#222222]">
        <h2 className="text-xl font-semibold text-[#F5F5F5] mb-8">How it works</h2>
        <div className="flex gap-6">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="flex-1 flex flex-col gap-3">
              <span className="font-mono text-sm text-[#6C63FF]">{step.step}</span>
              <h3 className="text-sm font-medium text-[#F5F5F5]">{step.title}</h3>
              <p className="text-sm text-[#888888] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sign up CTA */}
      <section className="max-w-4xl mx-auto px-8 py-16 border-t border-[#222222]">
        <div className="p-10 bg-[#141414] border border-[#222222] rounded-sm text-center">
          <h2 className="text-xl font-semibold text-[#F5F5F5] mb-2">
            Ready to stop hunting and pecking?
          </h2>
          <p className="text-sm text-[#888888] mb-6">
            Create a free account to save your progress, track streaks, and earn badges.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-[#6C63FF] text-white text-sm rounded-sm hover:bg-[#5b54e0] transition-colors"
            >
              Create free account
            </Link>
            <Link
              href="/lesson/1"
              className="text-sm text-[#888888] hover:text-[#F5F5F5] transition-colors"
            >
              Try without account →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222222] px-8 py-6 flex items-center justify-between text-xs text-[#888888]">
        <span className="font-mono">FreeTypingCourse</span>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-[#F5F5F5] transition-colors">
            Lessons
          </Link>
          <Link href="/login" className="hover:text-[#F5F5F5] transition-colors">
            Sign in
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F5F5F5] transition-colors"
            aria-label="GitHub repository"
          >
            GitHub
          </a>
        </div>
        <span>Free forever. No ads. No BS.</span>
      </footer>
    </div>
  )
}

function DemoStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl font-mono font-medium text-[#F5F5F5]">{value}</span>
      <span className="text-xs text-[#888888]">{label}</span>
    </div>
  )
}
