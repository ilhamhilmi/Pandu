"use client";

import React from "react";
import { FiYoutube } from "react-icons/fi";

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  duration: string;
}

interface VideoCardProps {
  video: VideoItem;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl border border-border overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        <img
          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-0.5 rounded">
          {video.duration}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-inter text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="font-inter text-xs text-muted-foreground truncate">
            {video.channel}
          </p>
          <FiYoutube className="h-4 w-4 text-red-500 shrink-0 ml-2" />
        </div>
      </div>
    </a>
  );
}