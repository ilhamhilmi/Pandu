"use client";

import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
  bg?: string;
  unit?: string;
  /** Override kelas wadah ikon (default: h-10 w-10 rounded-lg) */
  iconClassName?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  color = "text-primary",
  bg = "bg-primary/10",
  unit,
  iconClassName,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div
          className={`${iconClassName ?? "h-10 w-10 rounded-lg"} ${bg} flex items-center justify-center`}
        >
          <span className={`${color}`}>{icon}</span>
        </div>
        <div>
          <p className="font-inter text-xs text-muted-foreground">{label}</p>
          <p className="font-inter text-xl sm:text-2xl font-bold text-foreground">
            {value}
            {unit && (
              <span className="text-xs font-normal text-muted-foreground ml-1">
                {unit}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}