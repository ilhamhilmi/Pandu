"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiZap,
  FiCheckSquare,
  FiCalendar,
  FiTrendingUp,
  FiArrowRight,
  FiYoutube,
  FiExternalLink,
  FiLock,
  FiRefreshCw,
} from "react-icons/fi";
import {
  SkeletonStatsGrid,
  SkeletonTodoList,
  SkeletonCard,
} from "@/components/ui/skeleton";

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

interface ProgressData {
  hasPreference: boolean;
  hasRoadmap: boolean;
  currentDay: number;
  targetDays: number;
  totalTasks: number;
  totalCompleted: number;
  progressPercent: number;
  streak: number;
  goal: string | null;
}

interface TasksData {
  day: number;
  tasks: TaskItem[];
  isAccessible: boolean;
  unlockDate: string;
  targetDays: number;
}

export default function DashboardPage() {
  const [todos, setTodos] = useState<TaskItem[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [tasksData, setTasksData] = useState<TasksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [updatingTask, setUpdatingTask] = useState<number | null>(null);

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
        setCurrentDay(progressData.data.currentDay);
      }

      // Fetch tasks for current day
      const day = progress?.currentDay || 1;
      const tasksRes = await fetch(`/api/tasks?day=${day}`);
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasksData(tasksData.data);
        setTodos(tasksData.data.tasks);
      }
    } catch (err) {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  async function toggleTodo(index: number) {
    if (!tasksData) return;
    setUpdatingTask(index);

    const newCompleted = !todos[index].completed;

    // Optimistic update
    const updatedTodos = todos.map((t, i) =>
      i === index ? { ...t, completed: newCompleted } : t
    );
    setTodos(updatedTodos);

    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: tasksData.day,
          taskIndex: index,
          completed: newCompleted,
        }),
      });

      if (!res.ok) {
        // Revert on error
        setTodos(todos);
      }
    } catch {
      setTodos(todos);
    } finally {
      setUpdatingTask(null);
    }
  }

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const todoProgressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
  const dateString = `${days[today.getDay()]}, ${today.getDate()} ${
    months[today.getMonth()]
  } ${today.getFullYear()}`;

  // Loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse mt-2" />
        </div>
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
        <div className="bg-white rounded-xl border border-border p-8 text-center">
          <p className="font-inter text-sm text-muted-foreground mb-4">
            {error}
          </p>
          <button
            onClick={fetchData}
            className="font-inter inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <FiRefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty state - no preference
  if (!progress?.hasPreference) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="font-inter text-2xl sm:text-3xl font-bold text-foreground">
            Halo! Selamat datang 👋
          </h1>
          <p className="font-inter text-sm text-muted-foreground mt-1">
            {dateString}
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl border border-border p-8 sm:p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FiTrendingUp className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-inter text-xl font-bold text-foreground mb-2">
            Mulai Petualangan Belajar Kamu!
          </h2>
          <p className="font-inter text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Atur preferensi belajar kamu, dan biarkan AI membuatkan roadmap
            personalized serta to-do harian yang sesuai dengan goal kamu.
          </p>
          <Link
            href="/onboarding"
            className="font-inter inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Mulai Sekarang
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Empty state - has preference but no roadmap
  if (!progress?.hasRoadmap) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-inter text-2xl sm:text-3xl font-bold text-foreground">
            Halo! Selamat datang 👋
          </h1>
          <p className="font-inter text-sm text-muted-foreground mt-1">
            {dateString}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-border p-8 sm:p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FiTrendingUp className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-inter text-xl font-bold text-foreground mb-2">
            Roadmap Belum Dibuat
          </h2>
          <p className="font-inter text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Preferensi kamu sudah disimpan. Sekarang saatnya AI membuatkan
            roadmap belajar personalized untuk kamu!
          </p>
          <button
            onClick={async () => {
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
            className="font-inter inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Generate Roadmap Sekarang
            <FiArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard with data
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="font-inter text-2xl sm:text-3xl font-bold text-foreground">
          Halo! Selamat belajar 👋
        </h1>
        <p className="font-inter text-sm text-muted-foreground mt-1">
          {dateString}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {/* Streak */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <FiZap className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="font-inter text-xs text-muted-foreground">
                Streak
              </p>
              <p className="font-inter text-xl sm:text-2xl font-bold text-foreground">
                {progress?.streak || 0}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  hari
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Task Selesai */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <FiCheckSquare className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-inter text-xs text-muted-foreground">
                Task Selesai
              </p>
              <p className="font-inter text-xl sm:text-2xl font-bold text-foreground">
                {progress?.totalCompleted || 0}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  task
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Hari ke- */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FiCalendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-inter text-xs text-muted-foreground">
                Hari ke-
              </p>
              <p className="font-inter text-xl sm:text-2xl font-bold text-foreground">
                {currentDay}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  dari {progress?.targetDays || 30}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FiTrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-inter text-xs text-muted-foreground">
                Progress
              </p>
              <p className="font-inter text-xl sm:text-2xl font-bold text-foreground">
                {progress?.progressPercent || 0}%
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  selesai
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Keseluruhan */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-inter text-sm font-semibold text-foreground">
            Progress Keseluruhan
          </h2>
          <span className="font-inter text-sm font-medium text-primary">
            {progress?.progressPercent || 0}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress?.progressPercent || 0}%` }}
          />
        </div>
      </div>

      {/* To-Do Hari Ini */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-inter text-base font-semibold text-foreground">
            To-Do Hari Ini (Hari ke-{currentDay})
          </h2>
          <span className="font-inter text-xs text-muted-foreground">
            {completedCount}/{totalCount} selesai
          </span>
        </div>

        {/* Day is locked */}
        {tasksData && !tasksData.isAccessible && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FiLock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-inter text-base font-semibold text-foreground mb-1">
              Hari ke-{currentDay} Belum Tersedia
            </h3>
            <p className="font-inter text-sm text-muted-foreground">
              Task untuk hari ini akan terbuka pada jam 00:00
            </p>
          </div>
        )}

        {/* No tasks yet */}
        {tasksData && tasksData.isAccessible && todos.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FiCheckSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-inter text-base font-semibold text-foreground mb-1">
              Belum ada task untuk hari ini
            </h3>
            <p className="font-inter text-sm text-muted-foreground">
              Selamat menikmati hari libur! 🎉
            </p>
          </div>
        )}

        {/* Todo List */}
        {tasksData && tasksData.isAccessible && todos.length > 0 && (
          <div className="space-y-3">
            {todos.map((todo, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 transition-all ${
                  todo.completed
                    ? "border-primary/20 bg-primary/5"
                    : "border-border bg-white hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTodo(index)}
                    disabled={updatingTask === index}
                    className={`mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 ${
                      todo.completed
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
                      className={`font-inter text-sm font-medium ${
                        todo.completed
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
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/roadmap"
          className="font-inter flex items-center justify-center gap-2 bg-white border border-border rounded-xl px-5 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Lihat Roadmap
          <FiArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/dashboard/progress"
          className="font-inter flex items-center justify-center gap-2 bg-white border border-border rounded-xl px-5 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Lihat Progress
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}