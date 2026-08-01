"use client";

import React, { useState, useEffect } from "react";
import {
  FiCircle,
  FiBookOpen,
  FiCheckSquare,
  FiClock,
  FiTarget,
  FiZap,
} from "react-icons/fi";
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
        <PageHeader title="Roadmap Belajar 🗺️" />
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  // No roadmap
  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader title="Roadmap Belajar 🗺️" />
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
      label: "Total Task",
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
      label: "Sisa Task",
      value: String(totalRemaining),
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      icon: <FiTarget className="h-5 w-5" />,
      label: "Completion Rate",
      value: `${progress?.progressPercent ?? 0}%`,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <PageHeader
        title="Roadmap Belajar 🗺️"
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
        </>
      )}

      {/* Progress Overview */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-inter text-sm font-semibold text-foreground">
            Total Topik
          </h2>
          <span className="font-inter text-sm font-medium text-primary">
            {totalTopics} topik · {phases.length} fase
          </span>
        </div>
      </div>

      {/* Phase List */}
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-sm transition-shadow"
          >
            {/* Phase Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="font-inter text-sm font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="font-inter text-base font-semibold text-foreground">
                    {phase.title}
                  </h3>
                  <p className="font-inter text-xs text-muted-foreground">
                    {phase.week} · {phase.duration}
                  </p>
                </div>
              </div>
            </div>

            {/* Phase Topics */}
            <div className="px-4 sm:px-5 py-3 space-y-1">
              {phase.topics.map((topic, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2">
                  <FiCircle className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                  <span className="font-inter text-sm text-foreground">
                    {topic}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}