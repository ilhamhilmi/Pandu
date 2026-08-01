"use client";

import React from "react";
import { FiExternalLink } from "react-icons/fi";

export interface ArticleItem {
  title: string;
  url: string;
  source: string;
  description: string;
}

interface ArticleCardProps {
  article: ArticleItem;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl border border-border p-5 group hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
    >
      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
        <FiExternalLink className="h-5 w-5 text-blue-500" />
      </div>
      <h3 className="font-inter text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
        {article.title}
      </h3>
      <p className="font-inter text-xs text-muted-foreground mt-2 line-clamp-3 flex-1">
        {article.description}
      </p>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <span className="font-inter text-xs text-muted-foreground">
          {article.source}
        </span>
        <span className="font-inter text-xs font-medium text-primary inline-flex items-center gap-1">
          Baca
          <FiExternalLink className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}