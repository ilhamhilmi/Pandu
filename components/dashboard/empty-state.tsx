"use client";

import React from "react";
import Link from "next/link";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  iconBg?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  iconBg = "bg-primary/10",
}: EmptyStateProps) {
  const renderAction = () => {
    if (!actionLabel) return null;
    const className =
      "font-inter inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer";
    if (actionHref) {
      return (
        <Link href={actionHref} className={className}>
          {actionLabel}
        </Link>
      );
    }
    return (
      <button onClick={onAction} className={className}>
        {actionLabel}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-border p-8 sm:p-12 text-center">
      <div
        className={`h-20 w-20 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-6`}
      >
        {icon}
      </div>
      <h2 className="font-inter text-xl font-bold text-foreground mb-2">
        {title}
      </h2>
      {description && (
        <p className="font-inter text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {renderAction()}
    </div>
  );
}