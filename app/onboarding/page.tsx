"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CiClock2, CiCalendarDate, CiStar, CiCalendar } from "react-icons/ci";
import { FiLoader } from "react-icons/fi";
import { supabase } from "@/lib/supabase/client";
import { SkeletonCard } from "@/components/ui/skeleton";

const GOAL_OPTIONS = [
  { value: "Web Developer", label: "Web Developer" },
  { value: "Mobile Developer", label: "Mobile Developer" },
  { value: "Data Science", label: "Data Science" },
  { value: "Frontend Developer", label: "Frontend Developer" },
  { value: "Backend Developer", label: "Backend Developer" },
  { value: "lainnya", label: "Lainnya" },
];

const TARGET_DAYS = [7, 30, 60];

const SKILL_OPTIONS = [
  { value: "belum tahu apa-apa", label: "Belum tahu apa-apa" },
  { value: "html & css", label: "HTML / CSS" },
  { value: "basic logic programming", label: "Basic logic programming" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "git / version control", label: "Git / Version Control" },
  { value: "database (sql)", label: "Database (SQL)" },
  { value: "framework (react, vue, dll)", label: "Framework (React, Vue, dll)" },
  { value: "API / backend", label: "API / Backend" },
];

export default function Onboarding() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [goalCustom, setGoalCustom] = useState("");
  const [targetDays, setTargetDays] = useState<number | "">(30);
  const [targetDaysCustom, setTargetDaysCustom] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [hoursPerDay, setHoursPerDay] = useState<number | "">(1);
  const [aiNote, setAiNote] = useState("");
  const [useCustomDays, setUseCustomDays] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "generating">("form");
  const [generateProgress, setGenerateProgress] = useState("");

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) => {
      if (skill === "belum tahu apa-apa") {
        return prev.includes(skill) ? [] : ["belum tahu apa-apa"];
      }
      if (prev.includes("belum tahu apa-apa")) {
        return prev
          .filter((s) => s !== "belum tahu apa-apa")
          .concat(prev.includes(skill) ? [] : [skill]);
      }
      return prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill];
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate
    if (!goal) {
      setError("Pilih goal belajar kamu");
      return;
    }
    if (goal === "lainnya" && !goalCustom.trim()) {
      setError("Tulis goal kamu");
      return;
    }
    const finalTargetDays = useCustomDays
      ? parseInt(targetDaysCustom)
      : targetDays;
    if (!finalTargetDays || finalTargetDays <= 0) {
      setError("Atur target waktu belajar");
      return;
    }
    if (selectedSkills.length === 0) {
      setError("Pilih minimal satu skill");
      return;
    }

    setIsSubmitting(true);
    setStep("generating");
    setGenerateProgress("Menyimpan preferensi...");

    try {
      // Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError("Sesi habis, silakan login ulang");
        setIsSubmitting(false);
        setStep("form");
        return;
      }

      // Step 1: Save preferences
      const prefRes = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          goalCustom: goal === "lainnya" ? goalCustom.trim() : undefined,
          targetDays: finalTargetDays,
          selectedSkills,
          hoursPerDay: hoursPerDay || null,
          aiNote: aiNote.trim() || undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!prefRes.ok) {
        const prefData = await prefRes.json();
        setError(prefData.error || "Gagal menyimpan preferensi");
        setIsSubmitting(false);
        setStep("form");
        return;
      }

      // Step 2: Generate roadmap
      setGenerateProgress("AI sedang membuat roadmap belajar kamu...");
      const roadmapRes = await fetch("/api/ai/generate-roadmap", {
        method: "POST",
      });

      if (!roadmapRes.ok) {
        const roadmapData = await roadmapRes.json();
        setError(roadmapData.error || "Gagal generate roadmap");
        setIsSubmitting(false);
        setStep("form");
        return;
      }

      // Step 3: Generate all daily tasks
      setGenerateProgress("AI sedang membuat task harian untuk setiap hari...");
      const tasksRes = await fetch("/api/ai/generate-tasks", {
        method: "POST",
      });

      if (!tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setError(tasksData.error || "Gagal generate task harian");
        setIsSubmitting(false);
        setStep("form");
        return;
      }

      // Success - redirect to dashboard
      setGenerateProgress("Selesai! Mengarahkan ke dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 500);
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi");
      setIsSubmitting(false);
      setStep("form");
    }
  }

  // Loading/Generating Screen
  if (step === "generating") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Spinner */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <FiLoader className="h-8 w-8 text-primary animate-spin" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="font-inter text-xl font-bold text-foreground">
              Tunggu ya, AI Lagi Siapin Roadmap Belajar Buat Kamu
            </h1>
            <p className="font-inter text-sm text-muted-foreground mt-2">
              {generateProgress}
            </p>
          </div>

          {/* Skeleton Previews */}
          <div className="space-y-3 mt-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>

          <p className="font-inter text-xs text-muted-foreground">
            Proses ini membutuhkan waktu beberapa saat...
          </p>
        </div>
      </main>
    );
  }

  // Form Screen
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="flex mb-2">
          <h2 className="text-primary font-inter uppercase tracking-widest">
            | Mulai belajar
          </h2>
        </div>
        <div className="text-start">
          <h1 className="font-inter text-4xl xl:text-5xl font-bold text-foreground tracking-wider">
            Atur{" "}
            <span className="text-primary">preferensi</span> kamu
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-inter">
            Jawab beberapa pertanyaan biar kami bisa bikin roadmap
            belajar yang pas buat kamu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Goal Belajar */}
          <div className="space-y-3">
            <label className="font-inter block text-sm font-medium text-foreground">
              <span className="inline-flex items-center gap-2">
                <CiCalendarDate className="h-5 w-5 text-primary" />
                Goal belajar
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {GOAL_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setGoal(option.value)}
                  className={`font-inter rounded-lg border px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                    goal === option.value
                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                      : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {goal === "lainnya" && (
              <input
                type="text"
                value={goalCustom}
                onChange={(e) => setGoalCustom(e.target.value)}
                placeholder="Tulis goal kamu, misal: Game Developer"
                className="font-inter mt-2 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            )}
          </div>

          {/* Target Waktu */}
          <div className="space-y-3">
            <label className="font-inter block text-sm font-medium text-foreground">
              <span className="inline-flex items-center gap-2">
                <CiCalendar className="h-5 w-5 text-primary" />
                Target waktu
              </span>
            </label>
            {!useCustomDays ? (
              <>
                <div className="flex flex-wrap gap-3">
                  {TARGET_DAYS.map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setTargetDays(days)}
                      className={`font-inter rounded-lg border px-5 py-3 text-sm font-medium transition-all cursor-pointer ${
                        targetDays === days
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                          : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      {days} hari
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUseCustomDays(true);
                    setTargetDays("");
                  }}
                  className="font-inter text-sm text-primary hover:text-primary-hover transition-colors cursor-pointer"
                >
                  Atur sendiri →
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={targetDaysCustom}
                  onChange={(e) => setTargetDaysCustom(e.target.value)}
                  placeholder="Masukkan jumlah hari, misal: 45"
                  className="font-inter block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUseCustomDays(false);
                    setTargetDays(30);
                  }}
                  className="font-inter text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Pakai preset
                </button>
              </div>
            )}
          </div>

          {/* Skill Saat Ini */}
          <div className="space-y-3">
            <label className="font-inter block text-sm font-medium text-foreground">
              <span className="inline-flex items-center gap-2">
                <CiStar className="h-5 w-5 text-primary" />
                Skill saat ini
              </span>
              <span className="ml-1 text-xs text-muted-foreground font-normal">
                (pilih semua yang sesuai)
              </span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {SKILL_OPTIONS.map((skill) => (
                <button
                  key={skill.value}
                  type="button"
                  onClick={() => toggleSkill(skill.value)}
                  className={`font-inter flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-all cursor-pointer ${
                    selectedSkills.includes(skill.value)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs transition-all ${
                      selectedSkills.includes(skill.value)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background"
                    }`}
                  >
                    {selectedSkills.includes(skill.value) && (
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  {skill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Jam Belajar Per Hari (Opsional) */}
          <div className="space-y-3">
            <label className="font-inter block text-sm font-medium text-foreground">
              <span className="inline-flex items-center gap-2">
                <CiClock2 className="h-5 w-5 text-primary" />
                Jam belajar per hari
              </span>
              <span className="ml-1 text-xs text-muted-foreground font-normal">
                (opsional)
              </span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0.5"
                max="12"
                step="0.5"
                value={hoursPerDay}
                onChange={(e) =>
                  setHoursPerDay(
                    e.target.value ? parseFloat(e.target.value) : ""
                  )
                }
                placeholder="1"
                className="font-inter w-24 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="font-inter text-sm text-muted-foreground">
                jam / hari
              </span>
            </div>
            <p className="font-inter text-xs text-muted-foreground">
              Biar kami bisa atur jumlah task yang pas setiap harinya
            </p>
          </div>

          {/* Catatan untuk AI (Opsional) */}
          <div className="space-y-3">
            <label className="font-inter block text-sm font-medium text-foreground">
              <span className="inline-flex items-center gap-2">
                <CiStar className="h-5 w-5 text-primary" />
                Catatan untuk AI
              </span>
              <span className="ml-1 text-xs text-muted-foreground font-normal">
                (opsional)
              </span>
            </label>
            <textarea
              rows={4}
              value={aiNote}
              onChange={(e) => setAiNote(e.target.value)}
              placeholder="Jelaskan preferensi belajarmu lebih detail, misal: gaya belajar, materi yang ingin difokuskan, hal-hal yang kamu sukai atau hindari, dll."
              className="font-inter block w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <p className="font-inter text-xs text-muted-foreground">
              Semakin detail, semakin pas roadmap & task yang AI buat untukmu
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="font-inter rounded-lg border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="font-inter w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Menyimpan..." : "Buat Roadmap Belajar"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="font-inter w-full text-sm cursor-pointer text-muted-foreground hover:text-accent-foreground duration-200"
          >
            Atur nanti
          </button>
        </form>
      </div>
    </main>
  );
}