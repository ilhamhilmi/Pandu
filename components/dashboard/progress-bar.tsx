"use client";

import React from "react";

interface ProgressBarProps {
  percent: number;
  label: string;
}

export default function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="bg-white rounded-xl border border-border p-4 sm:p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-inter text-sm font-semibold text-foreground">
          {label}
        </h2>
        <span className="font-inter text-sm font-medium text-primary">
          {clamped}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}