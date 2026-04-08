"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { importLessons, parseCsvLessons } from "@/lib/lessons"
import { supabase } from "@/lib/supabase"
import type { Lesson } from "@/types/lesson"

type ImportStatus = "idle" | "preview" | "importing" | "success" | "error"

export default function AdminLessonsPage() {
  const router = useRouter()
  const [status, setStatus] = useState<ImportStatus>("idle")
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/login"); return }

      const res = await fetch("/api/admin/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: session.access_token }),
      })

      if (!res.ok) router.push("/")
      else setAuthChecked(true)
    })
  }, [router])

  const processFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        let parsed: Lesson[]

        if (file.name.endsWith(".json")) {
          parsed = JSON.parse(content) as Lesson[]
        } else {
          parsed = parseCsvLessons(content)
        }

        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error("No valid lessons found in file")
        }

        setLessons(parsed)
        setStatus("preview")
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse file")
        setStatus("error")
      }
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleImport = async () => {
    setStatus("importing")
    setError(null)
    try {
      await importLessons(lessons)
      setStatus("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed")
      setStatus("error")
    }
  }

  const handleReset = () => {
    setStatus("idle")
    setLessons([])
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-sm text-[#888888]">
        Checking authentication...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      {/* Nav */}
      <nav className="border-b border-[#222222] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-medium text-[#F5F5F5] tracking-tight">
          FreeTypingCourse
        </Link>
        <span className="text-xs text-[#888888] bg-[#141414] border border-[#222222] px-2 py-1 rounded-sm">
          Admin
        </span>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-[#F5F5F5]">Import Lessons</h1>
          <p className="text-sm text-[#888888] mt-1">
            Upload a CSV or JSON file to populate the lessons database.
          </p>
        </div>

        {/* Drop zone */}
        {(status === "idle" || status === "error") && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Drop lesson file here or click to upload"
            className={`
              border border-dashed rounded-sm p-12 text-center cursor-pointer transition-colors
              ${isDragging
                ? "border-[#6C63FF] bg-[#6C63FF0A]"
                : "border-[#333333] hover:border-[#444444] bg-[#141414]"
              }
            `}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-3xl" aria-hidden="true">📂</span>
              <p className="text-sm text-[#F5F5F5]">Drop your CSV or JSON file here</p>
              <p className="text-xs text-[#888888]">or click to browse</p>
              <p className="text-xs text-[#888888] mt-2">
                Supports: <code className="text-[#6C63FF]">.csv</code> and{" "}
                <code className="text-[#6C63FF]">.json</code>
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="sr-only"
              aria-label="Upload lesson file"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 px-4 py-3 bg-[#E24B4A11] border border-[#E24B4A44] rounded-sm text-sm text-[#E24B4A]" role="alert">
            {error}
          </div>
        )}

        {/* Preview table */}
        {status === "preview" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#888888]">
                <span className="text-[#F5F5F5] font-medium">{lessons.length} lessons</span> ready to import
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-[#222222] text-sm text-[#888888] rounded-sm hover:border-[#444444] hover:text-[#F5F5F5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-[#6C63FF] text-white text-sm rounded-sm hover:bg-[#5b54e0] transition-colors"
                >
                  Import {lessons.length} lessons
                </button>
              </div>
            </div>

            <div className="border border-[#222222] rounded-sm overflow-hidden">
              <table className="w-full text-xs font-mono" aria-label="Lesson preview">
                <thead>
                  <tr className="border-b border-[#222222] bg-[#141414]">
                    <th className="text-left px-4 py-2.5 text-[#888888] font-medium">ID</th>
                    <th className="text-left px-4 py-2.5 text-[#888888] font-medium">Phase</th>
                    <th className="text-left px-4 py-2.5 text-[#888888] font-medium">Title</th>
                    <th className="text-left px-4 py-2.5 text-[#888888] font-medium">Unlock WPM</th>
                    <th className="text-left px-4 py-2.5 text-[#888888] font-medium">Text preview</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.slice(0, 20).map((lesson) => (
                    <tr key={lesson.id} className="border-b border-[#222222] last:border-0">
                      <td className="px-4 py-2.5 text-[#888888]">{lesson.id}</td>
                      <td className="px-4 py-2.5 text-[#888888]">{lesson.phase}</td>
                      <td className="px-4 py-2.5 text-[#F5F5F5]">{lesson.title}</td>
                      <td className="px-4 py-2.5 text-[#888888]">{lesson.unlock_wpm}</td>
                      <td className="px-4 py-2.5 text-[#888888] truncate max-w-xs">
                        {lesson.text.slice(0, 40)}…
                      </td>
                    </tr>
                  ))}
                  {lessons.length > 20 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-2.5 text-[#888888] text-center">
                        +{lessons.length - 20} more lessons
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Importing */}
        {status === "importing" && (
          <div className="py-12 text-center text-sm text-[#888888]">
            Importing {lessons.length} lessons to Supabase...
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="text-3xl" aria-hidden="true">✅</div>
            <p className="text-sm text-[#1DB97A]">
              {lessons.length} lessons imported successfully
            </p>
            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-[#6C63FF] text-white text-sm rounded-sm hover:bg-[#5b54e0] transition-colors"
              >
                View lessons
              </Link>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-[#222222] text-sm text-[#888888] rounded-sm hover:border-[#444444] hover:text-[#F5F5F5] transition-colors"
              >
                Import more
              </button>
            </div>
          </div>
        )}

        {/* Format reference */}
        <div className="mt-10 border-t border-[#222222] pt-8">
          <h2 className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-4">
            Expected format
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#888888] mb-2">CSV</p>
              <pre className="text-xs font-mono bg-[#141414] border border-[#222222] rounded-sm p-4 text-[#888888] overflow-x-auto">
{`id,phase,phase_name,order,title,text,unlock_wpm,description
1,1,Home Row,1,Lesson 1: F & J,fjfj jfjf...,0,Place fingers on F and J`}
              </pre>
            </div>
            <div>
              <p className="text-xs text-[#888888] mb-2">JSON</p>
              <pre className="text-xs font-mono bg-[#141414] border border-[#222222] rounded-sm p-4 text-[#888888] overflow-x-auto">
{`[{
  "id": 1,
  "phase": 1,
  "phase_name": "Home Row",
  "order": 1,
  "title": "Lesson 1: F & J",
  "text": "fjfj jfjf...",
  "unlock_wpm": 0,
  "description": "Place fingers on F and J"
}]`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
