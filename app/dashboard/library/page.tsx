"use client";

import React, { useState, useEffect } from "react";
import { FiYoutube, FiExternalLink } from "react-icons/fi";
import { SkeletonLibrary, SkeletonPageHeader } from "@/components/ui/skeleton";
import PageHeader from "@/components/dashboard/page-header";
import ErrorState from "@/components/dashboard/error-state";
import EmptyState from "@/components/dashboard/empty-state";
import VideoCard, { VideoItem } from "@/components/dashboard/library/video-card";
import ArticleCard, {
  ArticleItem,
} from "@/components/dashboard/library/article-card";

interface LibraryData {
  videos: VideoItem[];
  articles: ArticleItem[];
}

type LibraryTab = "video" | "article";

export default function LibraryPage() {
  const [data, setData] = useState<LibraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LibraryTab>("video");

  useEffect(() => {
    fetchLibrary();
  }, []);

  async function fetchLibrary() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/library");
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      } else {
        setError("Gagal memuat perpustakaan");
      }
    } catch {
      setError("Gagal memuat perpustakaan");
    } finally {
      setLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SkeletonPageHeader titleWidth="w-56" descriptionWidth="w-40" />
        <SkeletonLibrary />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader title="Perpustakaan 📚" />
        <ErrorState message={error} onRetry={fetchLibrary} />
      </div>
    );
  }

  const videos = data?.videos || [];
  const articles = data?.articles || [];

  const TABS: { key: LibraryTab; label: string; icon: React.ReactNode }[] = [
    {
      key: "video",
      label: "Video",
      icon: <FiYoutube className="h-4 w-4 text-red-500" />,
    },
    {
      key: "article",
      label: "Artikel",
      icon: <FiExternalLink className="h-4 w-4 text-blue-500" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <PageHeader
        title="Perpustakaan 📚"
        description="Kumpulan video belajar dan artikel untuk mendukung perjalanan belajarmu."
      />

      {/* Toggle Video / Artikel */}
      <div className="flex items-center gap-2 mb-8">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-inter inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-white border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==================== VIDEO BELAJAR ==================== */}
      {activeTab === "video" && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <div className="h-9 w-9 rounded-lg bg-red-100 flex items-center justify-center">
              <FiYoutube className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="font-inter text-lg font-bold text-foreground">
                Video Belajar
              </h2>
              <p className="font-inter text-xs text-muted-foreground">
                {videos.length} video tersedia
              </p>
            </div>
          </div>

          {videos.length === 0 ? (
            <EmptyState
              icon={<FiYoutube className="h-10 w-10 text-red-500" />}
              title="Belum Ada Video"
              description="Belum ada video. Tambahkan di /api/library."
              iconBg="bg-red-100"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ==================== ARTIKEL ==================== */}
      {activeTab === "article" && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <FiExternalLink className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="font-inter text-lg font-bold text-foreground">
                Artikel
              </h2>
              <p className="font-inter text-xs text-muted-foreground">
                {articles.length} artikel tersedia
              </p>
            </div>
          </div>

          {articles.length === 0 ? (
            <EmptyState
              icon={<FiExternalLink className="h-10 w-10 text-blue-500" />}
              title="Belum Ada Artikel"
              description="Belum ada artikel. Tambahkan di /api/library."
              iconBg="bg-blue-100"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article, index) => (
                <ArticleCard key={index} article={article} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}