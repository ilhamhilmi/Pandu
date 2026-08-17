"use client";

import React from "react";

interface CircularProgressProps {
  value: number; // 0-100
  size?: number; // diameter dalam px
  strokeWidth?: number; // ketebalan ring
  className?: string;
  label?: string;
}

/**
 * Circular progress bar (ring) berbasis SVG murni, tanpa library tambahan.
 * Digunakan sebagai pengganti ikon pada kartu progress di dashboard & roadmap.
 */
export default function CircularProgress({
  value,
  size = 44,
  strokeWidth = 4,
  className,
  label = "Progress",
}: CircularProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const percent = Math.round(clamped);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Trek (track) abu-abu */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="text-border"
          stroke="currentColor"
        />
        {/* Busur progress warna primary */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-500"
          stroke="currentColor"
        />
      </svg>
    </div>
  );
}
