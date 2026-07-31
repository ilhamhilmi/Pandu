"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBookOpen,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiZap,
} from "react-icons/fi";

const NAV_ITEMS = [
  { icon: FiHome, label: "Dashboard", href: "/dashboard" },
  { icon: FiBookOpen, label: "Roadmap", href: "/dashboard/roadmap" },
  { icon: FiBarChart2, label: "Progress", href: "/dashboard/progress" },
  { icon: FiSettings, label: "Pengaturan", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-border z-30">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <FiZap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-inter text-lg font-bold text-foreground">
            LearnPath AI
          </span>
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
                className={`font-inter flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
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
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-inter text-sm font-semibold text-primary">
                AI
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-inter text-sm font-medium text-foreground truncate">
                Pengguna AI
              </p>
              <p className="font-inter text-xs text-muted-foreground truncate">
                pengguna@email.com
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
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
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <FiZap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-inter text-base font-bold text-foreground">
              LearnPath AI
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-inter text-xs font-semibold text-primary">
              AI
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
                className={`font-inter flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
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
    </div>
  );
}