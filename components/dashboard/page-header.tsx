"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="font-inter text-2xl sm:text-3xl font-bold text-foreground">
        {title}
      </h1>
      {description && (
        <p className="font-inter text-sm text-muted-foreground mt-1">
          {description}
        </p>
      )}
    </div>
  );
}