"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiTarget,
  FiCalendar,
  FiStar,
  FiClock,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { supabase } from "@/lib/supabase/client";
import ConfirmationModal from "@/components/dashboard/confirmation-modal";
import PageHeader from "@/components/dashboard/page-header";
import ErrorState from "@/components/dashboard/error-state";
import { SkeletonCard, SkeletonPageHeader } from "@/components/ui/skeleton";

interface PreferenceData {
  goal: string;
  goalCustom: string | null;
  targetDays: number;
  selectedSkills: string[];
  hoursPerDay: number | null;
}

interface UserData {
  email: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [preference, setPreference] = useState<PreferenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      // Get user from Supabase
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ email: authUser.email ?? null });
      }

      // Get preference from API
      const res = await fetch("/api/user/progress");
      if (res.ok) {
        const data = await res.json();
        if (data.data.hasPreference) {
          // Fetch preference details
          const prefRes = await fetch("/api/preference");
          if (prefRes.ok) {
            const prefData = await prefRes.json();
            setPreference(prefData.data);
          }
        }
      }
    } catch {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SkeletonPageHeader titleWidth="w-48" descriptionWidth="w-32" />
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader title="Pengaturan ⚙️" />
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  const goalLabel =
    preference?.goal === "lainnya"
      ? preference.goalCustom
      : preference?.goal;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <PageHeader
        title="Pengaturan"
        description="Kelola profil dan preferensi belajar kamu"
      />

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5 mb-4">
        <h2 className="font-inter text-base font-semibold text-foreground mb-4">
          Profil
        </h2>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-inter text-lg font-semibold text-primary">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FiUser className="h-4 w-4 text-muted-foreground" />
              <span className="font-inter text-sm font-medium text-foreground">
                {user?.email?.split("@")[0] || "Pengguna"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="h-4 w-4 text-muted-foreground" />
              <span className="font-inter text-sm text-muted-foreground">
                {user?.email || "email@tidakdiketahui.com"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preference Card */}
      {preference && (
        <div className="bg-white rounded-xl border border-border p-4 sm:p-5 mb-4">
          <h2 className="font-inter text-base font-semibold text-foreground mb-4">
            Preferensi Belajar
          </h2>

          <div className="space-y-4">
            {/* Goal */}
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FiTarget className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-inter text-sm font-medium text-foreground">
                  Goal Belajar
                </p>
                <p className="font-inter text-sm text-muted-foreground capitalize">
                  {goalLabel || "Belum diatur"}
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Target Days */}
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <FiCalendar className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="font-inter text-sm font-medium text-foreground">
                  Target Waktu
                </p>
                <p className="font-inter text-sm text-muted-foreground">
                  {preference.targetDays} hari
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Skills */}
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <FiStar className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="font-inter text-sm font-medium text-foreground">
                  Skill Saat Ini
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {preference.selectedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="font-inter text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground capitalize"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Hours Per Day */}
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <FiClock className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="font-inter text-sm font-medium text-foreground">
                  Jam Belajar per Hari
                </p>
                <p className="font-inter text-sm text-muted-foreground">
                  {preference.hoursPerDay
                    ? `${preference.hoursPerDay} jam / hari`
                    : "Fleksibel"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {/* Ubah Preferensi */}
        <button
          onClick={() => setShowConfirmModal(true)}
          className="font-inter flex w-full items-center justify-between bg-white rounded-xl border border-border p-4 sm:p-5 hover:bg-muted transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <FiTarget className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-inter text-sm font-medium text-foreground">
                Ubah Preferensi Belajar
              </p>
              <p className="font-inter text-xs text-muted-foreground">
                Atur ulang goal, target, atau skill kamu
              </p>
            </div>
          </div>
          <FiChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="font-inter flex w-full items-center justify-between bg-white rounded-xl border border-border p-4 sm:p-5 hover:bg-red-50 hover:border-red-200 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-red-100 flex items-center justify-center">
              <FiLogOut className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-left">
              <p className="font-inter text-sm font-medium text-foreground group-hover:text-red-600 transition-colors">
                Keluar
              </p>
              <p className="font-inter text-xs text-muted-foreground">
                Logout dari akun kamu
              </p>
            </div>
          </div>
          <FiChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Confirmation Modal - Ubah Preferensi */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={() => {
          setShowConfirmModal(false);
          router.push("/onboarding");
        }}
        onCancel={() => setShowConfirmModal(false)}
        title="Mulai Petualangan Belajar Baru?"
        message="Progress kamu akan terhapus, termasuk roadmap dan semua task yang sudah selesai. Kamu yakin mau mulai petualangan belajar baru?"
        confirmText="Ya, Mulai Baru"
        cancelText="Batal"
      />

      {/* Confirmation Modal - Logout */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
        onCancel={() => setShowLogoutModal(false)}
        title="Keluar dari Akun?"
        message="Kamu akan keluar dari akun kamu dan perlu login kembali untuk mengakses dashboard."
        confirmText="Ya, Keluar"
        cancelText="Batal"
      />
    </div>
  );
}