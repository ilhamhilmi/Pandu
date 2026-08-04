"use client";

import React from "react";
import { FiYoutube } from "react-icons/fi";

export interface VideoItem {
  url: string;
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
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl border border-border p-5 group hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
    >
      <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center mb-3">
        <FiYoutube className="h-5 w-5 text-red-500" />
      </div>
      <h3 className="font-inter text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
        {video.title}
      </h3>
      <div className="flex items-center justify-between mt-2 flex-1">
        <p className="font-inter text-xs text-muted-foreground truncate">
          {video.channel}
        </p>
        <span className="font-inter text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0 ml-2">
          {video.duration}
        </span>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <span className="font-inter text-xs text-muted-foreground">
          YouTube
        </span>
        <span className="font-inter text-xs font-medium text-red-600 inline-flex items-center gap-1">
          Tonton
          <FiYoutube className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}