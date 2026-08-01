"use client";

import React from "react";
import { FiRefreshCw } from "react-icons/fi";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Terjadi kesalahan",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-8 text-center">
      <p className="font-inter text-sm text-muted-foreground mb-4">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="font-inter inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
        >
          <FiRefreshCw className="h-4 w-4" />
          Coba Lagi
        </button>
      )}
    </div>
  );
}