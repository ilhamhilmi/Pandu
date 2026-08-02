"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiBookOpen,
  FiSettings,
  FiLogOut,
  FiZap,
  FiBook,
} from "react-icons/fi";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import ConfirmationModal from "@/components/dashboard/confirmation-modal";

const NAV_ITEMS = [
  { icon: FiHome, label: "Beranda", href: "/dashboard" },
  { icon: FiBookOpen, label: "Roadmap", href: "/dashboard/roadmap" },
  { icon: FiBook, label: "Perpustakaan", href: "/dashboard/library" },
  { icon: FiSettings, label: "Pengaturan", href: "/dashboard/settings" },
];

interface UserProfile {
  email: string | null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (authUser) {
        setUser({ email: authUser.email ?? null });
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  const initial = user?.email?.[0]?.toUpperCase() || "U";
  const displayName = user?.email?.split("@")[0] || "Pengguna";
  const email = user?.email || "email@tidakdiketahui.com";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-border z-30">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
          <div className="bg-white flex items-center justify-center">
            <Image src="/icon/Pandu_Icon.png" alt="Icon" width={25} height={25} />
          </div>
          <h1 className="font-inter uppercase border rounded-full py-1 px-2.5 text-sm font-semibold border-primary/10 bg-primary/10 text-primary">Ruang Belajar</h1>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-inter flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                  ? "border border-primary bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="px-3 py-4 border-t border-border">
          {/* User Card */}
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="font-inter text-sm font-semibold text-primary">
                {initial}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-inter text-sm font-medium text-foreground truncate">
                {displayName}
              </p>
              <p className="font-inter text-xs text-muted-foreground truncate">
                {email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="font-inter flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
          >
            <FiLogOut className="h-5 w-5 shrink-0" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-white">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 flex items-center justify-center">
              <Image src="/icon/Pandu_Icon.png" alt="Icon" width={25} height={25} />
            </div>
            <h1 className="font-inter uppercase border rounded-full py-1 px-2.5 text-sm font-semibold border-primary/10 bg-primary/10 text-primary">Ruang Belajar</h1>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-inter text-xs font-semibold text-primary">
              {initial}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Bottom Navbar Mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border z-30">
        <div className="flex items-center justify-around px-2 py-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-inter flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

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