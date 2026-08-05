"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import Logo from "./Logo";
import { NAV_LINKS, type NavLink } from "./content";

interface NavbarProps {
  links?: NavLink[];
}

/** Sticky landing page navbar with desktop links, CTAs, and mobile menu. */
export default function Navbar({ links = NAV_LINKS }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          </div>
        </div>
      )}
    </header>
  );
}
