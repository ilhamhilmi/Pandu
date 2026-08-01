"use client";

import React from "react";
import { cn } from "@/lib/utils";

function SkeletonPageHeader({
  titleWidth = "w-48",
  descriptionWidth = "w-32",
}: {
  titleWidth?: string;
  descriptionWidth?: string;
}) {
  return (
    <div className="mb-6">
      <div
        className={`h-8 ${titleWidth} bg-muted rounded animate-pulse`}
      />
      <div
        className={`h-4 ${descriptionWidth} bg-muted rounded animate-pulse mt-2`}
      />
    </div>
  );
}

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

function SkeletonLibrary() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border p-5 animate-pulse"
            >
              <div className="h-10 w-10 rounded-lg bg-muted mb-3" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded mt-2" />
              <div className="h-3 w-2/3 bg-muted rounded mt-1" />
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-3 w-10 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export {
  SkeletonPageHeader,
  SkeletonCard,
  SkeletonLine,
  SkeletonAvatar,
  SkeletonStatsGrid,
  SkeletonTodoList,
  SkeletonRoadmap,
  SkeletonLibrary,
};
