"use client";

import React from "react";
import { cn } from "@/lib/utils";

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-border p-4 sm:p-5 animate-pulse",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-5 w-24 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

function SkeletonLine({
  width,
  className,
}: {
  width?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("h-4 bg-muted rounded animate-pulse", className)}
      style={{ width: width || "100%" }}
    />
  );
}

function SkeletonAvatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-10 w-10 rounded-full bg-muted animate-pulse",
        className
      )}
    />
  );
}

function SkeletonStatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function SkeletonTodoList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-border p-4 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-md bg-muted shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
              <div className="flex gap-2 mt-2">
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-6 w-28 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonRoadmap({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-border p-5 animate-pulse mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
        <div className="h-2.5 w-full bg-muted rounded-full" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-border animate-pulse"
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            </div>
            <div className="h-4 w-12 bg-muted rounded" />
          </div>
          <div className="px-5 py-3 space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-muted" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonProgress() {
  return (
    <div className="space-y-6">
      <SkeletonStatsGrid />
      <div className="bg-white rounded-xl border border-border p-5 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="flex gap-3">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        </div>
        <div className="flex items-end justify-between gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="h-3 w-10 bg-muted rounded" />
              <div
                className="w-full max-w-[32px] bg-muted rounded-lg"
                style={{ height: `${Math.random() * 80 + 20}px` }}
              />
              <div className="h-3 w-8 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export {
  SkeletonCard,
  SkeletonLine,
  SkeletonAvatar,
  SkeletonStatsGrid,
  SkeletonTodoList,
  SkeletonRoadmap,
  SkeletonProgress,
};