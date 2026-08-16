"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiCheckSquare,
  FiCalendar,
  FiTrendingUp,
  FiArrowRight,
  FiYoutube,
  FiExternalLink,
  FiLock,
  FiInfo,
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import {
  SkeletonStatsGrid,
  SkeletonTodoList,
  SkeletonPageHeader,
} from "@/components/ui/skeleton";
import PageHeader from "@/components/dashboard/page-header";
import ErrorState from "@/components/dashboard/error-state";
import EmptyState from "@/components/dashboard/empty-state";
import StatCard from "@/components/dashboard/stat-card";
import ProgressBar from "@/components/dashboard/progress-bar";
import ConfirmationModal from "@/components/dashboard/confirmation-modal";
import DifficultyModal from "@/components/dashboard/difficulty-modal";
import { useRouter } from "next/navigation";

interface TaskResource {
  type: "video" | "article";
  title: string;
  url: string;
}

interface TaskItem {
  title: string;
  duration_minutes: number;
  resources: TaskResource[];
  completed?: boolean;
}

interface DayTasks {
  day: number;
  tasks: TaskItem[];
}

interface ProgressData {
  hasPreference: boolean;
  hasRoadmap: boolean;
  currentDay: number;
  targetDays: number;
  lastGeneratedDay: number;
  totalTasks: number;
  totalCompleted: number;
  progressPercent: number;
  streak: number;
  goal: string | null;
}

export default function DashboardPage() {
  const [allDayTasks, setAllDayTasks] = useState<DayTasks[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);
  const [generatingNext, setGeneratingNext] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [reasoning, setReasoning] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      // Fetch progress
      const progressRes = await fetch("/api/user/progress");
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData.data);
      }

      // Fetch ALL tasks
      const tasksRes = await fetch("/api/tasks");
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setAllDayTasks(tasksData.data.tasksByDay);
        setReasoning(tasksData.data.reasoning || "");
      }
    } catch {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateNextBatch(difficultyFeedback?: string) {
    if (!progress || generatingNext) return;

    const nextStartDay = (progress.lastGeneratedDay || 0) + 1;
    if (nextStartDay > progress.targetDays) return;

    setGeneratingNext(true);
    try {
      const res = await fetch("/api/ai/generate-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDay: nextStartDay,
          difficultyFeedback: difficultyFeedback || "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal generate fase berikutnya");
      } else {
        await fetchData();
      }
    } catch {
      setError("Gagal generate fase berikutnya");
    } finally {
      setGeneratingNext(false);
    }
  }

  async function toggleTodo(day: number, taskIndex: number) {
    const taskKey = `${day}-${taskIndex}`;
    setUpdatingTask(taskKey);

    // Find the day's tasks
    const dayData = allDayTasks.find((d) => d.day === day);
    if (!dayData) return;

    const newCompleted = !dayData.tasks[taskIndex].completed;

    // Optimistic update
    setAllDayTasks((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
            ...d,
            tasks: d.tasks.map((t, i) =>
              i === taskIndex ? { ...t, completed: newCompleted } : t
            ),
          }
          : d
      )
    );

    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day,
          taskIndex,
          completed: newCompleted,
        }),
      });

      if (!res.ok) {
        // Revert on error
        await fetchData();
      } else {
        // Refresh progress to update stats
        const progressRes = await fetch("/api/user/progress");
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData.data);
        }
      }
    } catch {
      await fetchData();
    } finally {
      setUpdatingTask(null);
    }
  }

  // Check if a day is accessible (day 1 always accessible, others only if previous day is fully completed)
  function isDayAccessible(day: number): boolean {
    if (day === 1) return true;

    const prevDay = allDayTasks.find((d) => d.day === day - 1);
    if (!prevDay) return false;

    return prevDay.tasks.length > 0 && prevDay.tasks.every((t) => t.completed);
  }

  // Check if ALL generated days are fully completed (required to unlock next phase)
  const allGeneratedDaysCompleted =
    allDayTasks.length > 0 &&
    allDayTasks.every(
      (d) => d.tasks.length > 0 && d.tasks.every((t) => t.completed)
    );

  // Get today's date in Indonesian
  const today = new Date();
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const dateString = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]
    } ${today.getFullYear()}`;

  // Loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SkeletonPageHeader titleWidth="w-64" descriptionWidth="w-48" />
        <SkeletonStatsGrid />
        <div className="mt-6">
          <SkeletonTodoList />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader title="Dashboard" />
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  // Empty state - no preference
  if (!progress?.hasPreference) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader title="Halo, Selamat datang!" description={dateString} />
        <EmptyState
          icon={<FiTrendingUp className="h-10 w-10 text-primary" />}
          title="Mulai Petualangan Belajar Kamu!"
          description="Atur preferensi belajar kamu, dan biarkan AI membuatkan roadmap personalized serta to-do harian yang sesuai dengan goal kamu."
          actionLabel="Mulai Sekarang"
          actionHref="/onboarding"
        />
      </div>
    );
  }

  // Empty state - has preference but no roadmap
  if (!progress?.hasRoadmap) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader title="Halo, Selamat datang!" description={dateString} />
        <EmptyState
          icon={<FiTrendingUp className="h-10 w-10 text-primary" />}
          title="Roadmap Belum Dibuat"
          description="Preferensi kamu sudah disimpan. Sekarang saatnya AI membuatkan roadmap belajar personalized untuk kamu!"
          actionLabel="Generate Roadmap Sekarang"
          onAction={async () => {
            setLoading(true);
            try {
              await fetch("/api/ai/generate-roadmap", { method: "POST" });
              await fetch("/api/ai/generate-tasks", { method: "POST" });
              await fetchData();
            } catch {
              setError("Gagal generate roadmap");
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>
    );
  }

  // Main dashboard with data
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Greeting */}
      <PageHeader title="Halo, Selamat belajar!" description={dateString} />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard
          icon={<FaFire className="h-5 w-5" />}
          label="Streak"
          value={String(progress?.streak || 0)}
          unit="hari"
          color="text-orange-500"
          bg="bg-orange-100"
        />
        <StatCard
          icon={<FiCheckSquare className="h-5 w-5" />}
          label="Tugas Selesai"
          value={String(progress?.totalCompleted || 0)}
          unit="task"
          color="text-emerald-500"
          bg="bg-emerald-100"
        />
        <StatCard
          icon={<FiCalendar className="h-5 w-5" />}
          label="Hari ke-"
          value={String(progress?.currentDay || 1)}
          unit={`dari ${progress?.targetDays || 30}`}
          color="text-blue-500"
          bg="bg-blue-100"
        />
        <StatCard
          icon={<FiTrendingUp className="h-5 w-5" />}
          label="Progress"
          value={`${progress?.progressPercent || 0}%`}
          unit="selesai"
          color="text-primary"
          bg="bg-primary/10"
        />
      </div>

      {/* Progress Bar Keseluruhan */}
      <ProgressBar
        percent={progress?.progressPercent || 0}
        label="Progress Keseluruhan"
      />

      {/* Info: sumber belajar di Perpustakaan */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 mb-6 sm:mb-8">
        <span className="mt-0.5 shrink-0 text-primary">
          <FiInfo className="h-5 w-5" />
        </span>
        <p className="font-inter text-sm text-foreground">
          Kalau link sumber belajar tidak bisa diakses, coba temukan di halaman {" "}
          <Link href="/dashboard/library" className="underline">Perpustakaan</Link> ya.
        </p>
      </div>

      {/* AI Reasoning: mengapa AI menyarankan tugas ini */}
      {reasoning && (
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 mb-6 sm:mb-8">
          <span className="mt-0.5 shrink-0 text-primary">
            <FiInfo className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-inter text-sm font-semibold text-foreground mb-1">
              Mengapa kami menyarankan kamu untuk belajar ini?
            </h2>
            <p className="font-inter text-sm text-muted-foreground leading-relaxed">
              {reasoning}
            </p>
          </div>
        </div>
      )}

      {/* All Day Cards */}
      <div className="space-y-4">
        {allDayTasks.map((dayData) => {
          const accessible = isDayAccessible(dayData.day);
          const dayCompleted = dayData.tasks.filter((t) => t.completed).length;
          const dayTotal = dayData.tasks.length;
          const isCurrentDay = progress?.currentDay === dayData.day;

          return (
            <div
              key={dayData.day}
              className={`bg-white rounded-xl border p-4 sm:p-5 ${isCurrentDay
                ? "border-primary ring-1 ring-primary/20"
                : "border-border"
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-inter text-base font-semibold text-foreground">
                  Hari ke-{dayData.day}
                  {isCurrentDay && (
                    <span className="ml-2 text-xs font-normal text-primary">
                      (Sedang berjalan)
                    </span>
                  )}
                </h2>
                <span className="font-inter text-xs text-muted-foreground">
                  {dayCompleted}/{dayTotal} selesai
                </span>
              </div>

              {/* Day is locked */}
              {!accessible && (
                <div className="text-center py-8">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <FiLock className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h3 className="font-inter text-sm font-semibold text-foreground mb-1">
                    Selesaikan hari ke-{dayData.day - 1} dulu
                  </h3>
                  <p className="font-inter text-xs text-muted-foreground">
                    Task untuk hari ini akan terbuka setelah semua task hari
                    sebelumnya selesai
                  </p>
                </div>
              )}

              {/* Todo List */}
              {accessible && dayData.tasks.length > 0 && (
                <div className="space-y-3">
                  {dayData.tasks.map((todo, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-4 transition-all ${todo.completed
                        ? "border-primary/20 bg-primary/5"
                        : "border-border bg-white hover:border-primary/30"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTodo(dayData.day, index)}
                          disabled={updatingTask === `${dayData.day}-${index}`}
                          className={`mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 ${todo.completed
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30 hover:border-primary"
                            }`}
                        >
                          {todo.completed && (
                            <svg
                              className="h-3 w-3 text-primary-foreground"
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
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-inter text-sm font-medium ${todo.completed
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                              }`}
                          >
                            {todo.title}
                          </p>
                          <p className="font-inter text-xs text-muted-foreground mt-0.5">
                            ~{todo.duration_minutes} menit
                          </p>

                          {/* Resources */}
                          {todo.resources && todo.resources.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {todo.resources.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-inter inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                                >
                                  {resource.type === "video" ? (
                                    <FiYoutube className="h-3 w-3 text-red-500" />
                                  ) : (
                                    <FiExternalLink className="h-3 w-3 text-blue-500" />
                                  )}
                                  {resource.title}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Day completed badge */}
              {accessible &&
                dayTotal > 0 &&
                dayCompleted === dayTotal && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                    <FiCheckSquare className="h-4 w-4" />
                    <span className="font-inter font-medium">
                      Hari selesai!
                    </span>
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {/* Mulai Fase Berikutnya */}
      {progress &&
        progress.lastGeneratedDay > 0 &&
        progress.lastGeneratedDay < progress.targetDays && (
          <div className="mt-6 bg-white rounded-xl border border-border p-5 sm:p-6 text-center">
            <div
              className={`h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4 ${allGeneratedDaysCompleted
                ? "bg-primary/10"
                : "bg-muted"
                }`}
            >
              {allGeneratedDaysCompleted ? (
                <FiArrowRight className="h-7 w-7 text-primary" />
              ) : (
                <FiLock className="h-7 w-7 text-muted-foreground" />
              )}
            </div>
            <h3 className="font-inter text-base font-semibold text-foreground mb-1">
              {allGeneratedDaysCompleted
                ? "Fase Berikutnya Siap!"
                : "Fase Berikutnya Terkunci"}
            </h3>
            <p className="font-inter text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              {allGeneratedDaysCompleted ? (
                <>
                  Kamu sudah punya task sampai hari ke-
                  {progress.lastGeneratedDay}. Generate task untuk hari ke-
                  {progress.lastGeneratedDay + 1}
                  {Math.min(
                    progress.lastGeneratedDay + 7,
                    progress.targetDays
                  ) >
                    progress.lastGeneratedDay + 1 &&
                    ` sampai hari ke-${Math.min(
                      progress.lastGeneratedDay + 7,
                      progress.targetDays
                    )}`}{" "}
                  sekarang.
                </>
              ) : (
                <>
                  Selesaikan semua task dari hari ke-1 sampai hari ke-
                  {progress.lastGeneratedDay} untuk membuka fase berikutnya.
                </>
              )}
            </p>
            <button
              onClick={() => setShowDifficultyModal(true)}
              disabled={generatingNext || !allGeneratedDaysCompleted}
              className="font-inter inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generatingNext ? (
                <>
                  <FiArrowRight className="h-4 w-4 animate-spin" />
                  Tunggu ya, lagi dibuat nih..
                </>
              ) : (
                <>
                  Lanjut ke level berikutnya
                  <FiArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}

      {/* Quick Actions */}
      <div className="mt-6 flex gap-3">
        <Link
          href="/dashboard/roadmap"
          className="font-inter flex items-center justify-center gap-2 bg-white border border-border rounded-xl px-5 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Lihat Kemajuan Belajar Kamu
          <FiArrowRight className="h-4 w-4" />
        </Link>

        <button
          onClick={() => setShowConfirmModal(true)}
          className="font-inter flex items-center justify-center gap-2 bg-primary border border-primary rounded-xl px-5 py-3 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Mulai petualangan belajar baru
          <FiArrowRight className="h-4 w-4" />
        </button>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={() => {
          setShowConfirmModal(false);
          router.push("/onboarding");
        }}
        onCancel={() => setShowConfirmModal(false)}
        title="Mulai Petualangan Belajar Baru?"
        message="Progress kamu akan terhapus, termasuk roadmap dan semua task yang sudah selesai. Kamu yakin mau mulai petualangan belajar baru?"
        confirmText="Ya, Mulai Baru"
        cancelText="Batal"
      />

      <DifficultyModal
        isOpen={showDifficultyModal}
        processing={generatingNext}
        onCancel={() => setShowDifficultyModal(false)}
        onConfirm={(feedback) => {
          setShowDifficultyModal(false);
          handleGenerateNextBatch(feedback);
        }}
      />
    </div>
  );
}