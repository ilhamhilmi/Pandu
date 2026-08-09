"use client";

import React, { useState, useEffect } from "react";
import {
  FiBookOpen,
  FiCalendar,
  FiCheckSquare,
  FiClock,
  FiFlag,
  FiMap,
  FiTarget,
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { SkeletonRoadmap, SkeletonPageHeader } from "@/components/ui/skeleton";
import PageHeader from "@/components/dashboard/page-header";
import ErrorState from "@/components/dashboard/error-state";
import EmptyState from "@/components/dashboard/empty-state";
import StatCard from "@/components/dashboard/stat-card";
import ProgressBar from "@/components/dashboard/progress-bar";

interface RoadmapPhase {
  title: string;
  week: string;
  order: number;
  topics: string[];
  duration: string;
}

interface RoadmapData {
  id: string;
  goal: string;
  targetDays: number;
  phases: RoadmapPhase[];
  createdAt: string;
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

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      // Fetch roadmap
      const roadmapRes = await fetch("/api/roadmap");
      if (roadmapRes.ok) {
        const roadmapData = await roadmapRes.json();
        setRoadmap(roadmapData.data);
      } else if (roadmapRes.status === 404) {
        setRoadmap(null);
      } else {
        setError("Gagal memuat roadmap");
      }

      // Fetch progress
      const progressRes = await fetch("/api/user/progress");
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData.data);
      }
    } catch {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SkeletonPageHeader titleWidth="w-56" descriptionWidth="w-40" />
        <SkeletonRoadmap />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader title="Roadmap & Progress Belajar" />
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  // No roadmap
  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader title="Roadmap & Progress Belajar" />
        <EmptyState
          icon={<FiBookOpen className="h-10 w-10 text-primary" />}
          title="Roadmap Belum Dibuat"
          description="Selesaikan onboarding dulu untuk membuat roadmap belajar kamu."
        />
      </div>
    );
  }

  const phases = roadmap.phases || [];
  const totalTopics = phases.reduce((acc, phase) => acc + phase.topics.length, 0);

  const totalRemaining = progress
    ? progress.totalTasks - progress.totalCompleted
    : 0;

  const stats = [
    {
      icon: <FiCheckSquare className="h-5 w-5" />,
      label: "Total Tugas",
      value: String(progress?.totalTasks ?? 0),
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      icon: <FiCheckSquare className="h-5 w-5" />,
      label: "Selesai",
      value: String(progress?.totalCompleted ?? 0),
      color: "text-emerald-500",
      bg: "bg-emerald-100",
    },
    {
      icon: <FiClock className="h-5 w-5" />,
      label: "Sisa Tugas",
      value: String(totalRemaining),
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      icon: <FiTarget className="h-5 w-5" />,
      label: "Total Progress",
      value: `${progress?.progressPercent ?? 0}%`,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <PageHeader
        title="Roadmap & Progress Belajar"
        description={`Target: ${roadmap.goal} — ${roadmap.targetDays} Hari`}
      />

      {/* ==================== PROGRESS ==================== */}
      {progress?.hasRoadmap && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                color={stat.color}
                bg={stat.bg}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <ProgressBar
            percent={progress.progressPercent}
            label="Progress Keseluruhan"
          />

          {/* Streak Info */}
          <div className="bg-white rounded-xl border border-border p-4 sm:p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <FaFire className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h2 className="font-inter text-base font-semibold text-foreground">
                  Streak Belajar
                </h2>
                <p className="font-inter text-xs text-muted-foreground">
                  {progress.streak > 0
                    ? "Tetap konsisten ya!"
                    : "Ayo mulai belajar hari ini!"}
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
        </>
      )}

      {/* ==================== ROADMAP TIMELINE ==================== */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm">
          <FiMap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-inter text-lg font-bold text-foreground">
            Fase Perjalanan Belajar
          </h2>
          <p className="font-inter text-sm text-muted-foreground">
            {totalTopics} topik · {phases.length} fase · target{" "}
            {roadmap.targetDays} hari
          </p>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="relative">
        {/* Spine penghubung antar fase */}
        <div
          aria-hidden
          className="absolute left-[19px] top-3 bottom-4 w-0.5 bg-gradient-to-b from-primary via-primary-light to-primary/30"
        />

        <div className="space-y-6">
          {phases.map((phase, index) => (
            <div
              key={index}
              className="relative flex items-start gap-4 sm:gap-5"
            >
              {/* Node fase */}
              <div className="relative z-10 h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center text-white shadow-md ring-4 ring-primary/10 transition-transform duration-200 hover:scale-110">
                <span className="font-inter text-sm font-bold">
                  {index + 1}
                </span>
              </div>

              {/* Card fase */}
              <div className="flex-1 min-w-0 bg-white rounded-xl border border-border border-l-[3px] border-l-primary/70 overflow-hidden hover:shadow-md hover:border-primary/40 transition-all duration-200">
                <div className="p-4 sm:p-5">
                  {/* Header fase */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <h3 className="font-inter text-base sm:text-lg font-semibold text-foreground">
                      {phase.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary font-inter">
                        <FiCalendar className="h-3 w-3" />
                        {phase.week}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground font-inter">
                        <FiClock className="h-3 w-3" />
                        {phase.duration}
                      </span>
                    </div>
                  </div>

                  {/* Topik fase */}
                  <div className="flex flex-wrap gap-2">
                    {phase.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground font-inter"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Penanda tujuan akhir */}
          <div className="relative flex items-start gap-4 sm:gap-5 pt-1">
            <div className="relative z-10 h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg ring-4 ring-amber-100">
              <FiFlag className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0 bg-gradient-to-br from-primary/10 via-teal-50/60 to-white rounded-xl border border-primary/30 p-4 sm:p-5">
              <h3 className="font-inter text-base sm:text-lg font-bold text-primary">
                🎉 Goal Tercapai!
              </h3>
              <p className="font-inter text-sm text-muted-foreground mt-1">
                Selesaikan {phases.length} fase ({roadmap.targetDays} hari) untuk
                mencapai target: {roadmap.goal}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}