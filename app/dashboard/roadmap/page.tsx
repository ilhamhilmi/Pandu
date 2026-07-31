"use client";

import React, { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiCircle,
  FiRefreshCw,
  FiBookOpen,
} from "react-icons/fi";
import { SkeletonRoadmap } from "@/components/ui/skeleton";

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

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  async function fetchRoadmap() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/roadmap");
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.data);
      } else if (res.status === 404) {
        setRoadmap(null);
      } else {
        setError("Gagal memuat roadmap");
      }
    } catch {
      setError("Gagal memuat roadmap");
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
        <SkeletonRoadmap />
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
            onClick={fetchRoadmap}
            className="font-inter inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <FiRefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // No roadmap
  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-inter text-2xl sm:text-3xl font-bold text-foreground">
            Roadmap Belajar 🗺️
          </h1>
        </div>
        <div className="bg-white rounded-xl border border-border p-8 sm:p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FiBookOpen className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-inter text-xl font-bold text-foreground mb-2">
            Roadmap Belum Dibuat
          </h2>
          <p className="font-inter text-sm text-muted-foreground mb-6">
            Selesaikan onboarding dulu untuk membuat roadmap belajar kamu.
          </p>
        </div>
      </div>
    );
  }

  const phases = roadmap.phases || [];
  const totalTopics = phases.reduce((acc, phase) => acc + phase.topics.length, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-inter text-2xl sm:text-3xl font-bold text-foreground">
          Roadmap Belajar 🗺️
        </h1>
        <p className="font-inter text-sm text-muted-foreground mt-1">
          Target: {roadmap.goal} — {roadmap.targetDays} Hari
        </p>
      </div>

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