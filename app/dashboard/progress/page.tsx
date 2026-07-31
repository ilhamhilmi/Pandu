"use client";

import React, { useState, useEffect } from "react";
import {
  FiCheckSquare,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiZap,
  FiRefreshCw,
} from "react-icons/fi";
import { SkeletonProgress } from "@/components/ui/skeleton";

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

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  async function fetchProgress() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/progress");
      if (res.ok) {
        const data = await res.json();
        setProgress(data.data);
      } else {
        setError("Gagal memuat progress");
      }
    } catch {
      setError("Gagal memuat progress");
    } finally {
      setLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse mt-2" />
        </div>
        <SkeletonProgress />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-xl border border-border p-8 text-center">
          <p className="font-inter text-sm text-muted-foreground mb-4">
            {error}
          </p>
          <button
            onClick={fetchProgress}
            className="font-inter inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <FiRefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // No data
  if (!progress?.hasRoadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-inter text-2xl sm:text-3xl font-bold text-foreground">
            Progress Belajar 📈
          </h1>
        </div>
        <div className="bg-white rounded-xl border border-border p-8 sm:p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FiTrendingUp className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-inter text-xl font-bold text-foreground mb-2">
            Belum Ada Progress
          </h2>
          <p className="font-inter text-sm text-muted-foreground">
            Selesaikan onboarding dan buat roadmap dulu untuk mulai melacak progress.
          </p>
        </div>
      </div>
    );
  }

  const totalRemaining = progress.totalTasks - progress.totalCompleted;

  const MOCK_STATS = [
    {
      icon: FiCheckSquare,
      label: "Total Task",
      value: String(progress.totalTasks),
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      icon: FiCheckSquare,
      label: "Selesai",
      value: String(progress.totalCompleted),
      color: "text-emerald-500",
      bg: "bg-emerald-100",
    },
    {
      icon: FiClock,
      label: "Sisa Task",
      value: String(totalRemaining),
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      icon: FiTarget,
      label: "Completion Rate",
      value: `${progress.progressPercent}%`,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-inter text-2xl sm:text-3xl font-bold text-foreground">
          Progress Belajar 📈
        </h1>
        <p className="font-inter text-sm text-muted-foreground mt-1">
          Pantau perkembangan belajar kamu
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {MOCK_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-border p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="font-inter text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="font-inter text-xl sm:text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-inter text-sm font-semibold text-foreground">
            Progress Keseluruhan
          </h2>
          <span className="font-inter text-sm font-medium text-primary">
            {progress.progressPercent}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Streak Info */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <FiZap className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h2 className="font-inter text-base font-semibold text-foreground">
              Streak Belajar
            </h2>
            <p className="font-inter text-xs text-muted-foreground">
              {progress.streak > 0
                ? "Kamu sedang on fire! 🔥"
                : "Mulai belajar hari ini! 💪"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="font-inter text-3xl font-bold text-orange-500">
              {progress.streak}
            </p>
            <p className="font-inter text-xs text-muted-foreground">
              Hari Beruntun
            </p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="font-inter text-3xl font-bold text-foreground">
              {progress.currentDay}
            </p>
            <p className="font-inter text-xs text-muted-foreground">
              Hari Ke-
            </p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="font-inter text-3xl font-bold text-foreground">
              {progress.targetDays}
            </p>
            <p className="font-inter text-xs text-muted-foreground">
              Total Hari
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}