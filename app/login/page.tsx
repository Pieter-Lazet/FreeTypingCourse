"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

type Mode = "signin" | "signup"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess("Check your email for a confirmation link.")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[#222222] px-8 py-4">
        <Link href="/" className="font-mono text-sm font-medium text-[#F5F5F5] tracking-tight">
          FreeTypingCourse
        </Link>
      </nav>

      {/* Auth form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-[#F5F5F5]">
              {mode === "signin" ? "Sign in" : "Create account"}
            </h1>
            <p className="text-sm text-[#888888] mt-1">
              {mode === "signin"
                ? "Welcome back. Sign in to continue."
                : "Free account. No credit card needed."}
            </p>
          </div>

          {/* Email/password form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs text-[#888888] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#141414] border border-[#222222] rounded-sm text-sm text-[#F5F5F5] placeholder-[#888888] focus:outline-none focus:border-[#6C63FF] transition-colors"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs text-[#888888] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2.5 bg-[#141414] border border-[#222222] rounded-sm text-sm text-[#F5F5F5] placeholder-[#888888] focus:outline-none focus:border-[#6C63FF] transition-colors"
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>

            {/* Error / success */}
            {error && (
              <p className="text-xs text-[#E24B4A] px-1" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="text-xs text-[#1DB97A] px-1" role="status">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#6C63FF] text-white text-sm font-medium rounded-sm hover:bg-[#5b54e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Loading..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {/* Mode toggle */}
          <p className="text-xs text-[#888888] text-center mt-5">
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-[#6C63FF] hover:underline"
                >
                  Create one free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-[#6C63FF] hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          {/* Guest mode */}
          <p className="text-xs text-[#888888] text-center mt-3">
            <Link href="/lesson/1" className="hover:text-[#F5F5F5] transition-colors">
              Continue as guest (progress won&apos;t be saved)
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
