"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiBookOpen,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiX,
} from "react-icons/fi";
import Logo from "./Logo";
import { supabase } from "@/lib/supabase/client";
import ConfirmationModal from "@/components/dashboard/confirmation-modal";
import { NAV_LINKS, type NavLink } from "./content";

interface NavbarProps {
  links?: NavLink[];
}

/** Sticky landing page navbar with desktop links, CTAs, and mobile menu. */
export default function Navbar({ links = NAV_LINKS }: NavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ email: string | null } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close the account dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  const initial = user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo priority widthClassName="w-[6rem] sm:w-[7.5rem]" />
        </Link>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 mr-5">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-inter text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          {user ? (
            /* Logged in: profile avatar with account dropdown */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer"
                aria-label="Menu akun"
              >
                <span className="font-inter text-sm font-semibold text-primary">
                  {initial}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-white shadow-lg py-2 animate-in fade-in zoom-in origin-top-right">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMenuOpen(false)}
                    className="font-inter flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <FiSettings className="h-4 w-4 shrink-0 text-muted-foreground" />
                    Pengaturan
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="font-inter flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <FiBookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                    Ruang Belajar
                  </Link>
                  <div className="my-2 border-t border-border" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="font-inter flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <FiLogOut className="h-4 w-4 shrink-0" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="font-inter text-sm font-semibold text-foreground px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
              >
                Masuk
              </Link>
              <Link
                href="/sign-up"
                className="font-inter inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
              >
                Bikin akun gratis
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border text-foreground cursor-pointer"
          aria-label="Menu"
        >
          {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block font-inter text-sm font-medium text-foreground px-3 py-2.5 rounded-lg hover:bg-muted"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="font-inter inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
              >
                <FiBookOpen className="h-4 w-4" />
                Ruang Belajar
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="font-inter text-center text-sm font-semibold text-foreground px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="font-inter inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
                >
                  Bikin akun gratis
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
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
    </header>
  );
}
