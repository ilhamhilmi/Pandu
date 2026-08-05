"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiArrowRight, FiCheck, FiChevronDown } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface HeroTask {
  id: number;
  title: string;
  minutes: number;
  done: boolean;
}

const INITIAL_TASKS: HeroTask[] = [
  { id: 1, title: "Pelajari dasar HTML", minutes: 45, done: true },
  { id: 2, title: "CSS dasar: Pelajari konsep Flexbox pada CSS", minutes: 60, done: false },
  { id: 3, title: "Pelajari tipe data di Javascript", minutes: 50, done: false },
];

export default function Hero() {
  const [user, setUser] = useState<{ email: string | null } | null>(null);

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

  const primaryHref = user ? "/dashboard" : "/sign-up";

  return (
    <section className="relative overflow-hidden">
      {/* decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        {/* <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary font-inter">
          <FaRobot className="h-4 w-4" />
          Roadmap belajar programming, dipersonalisasi dengan AI
        </div> */}

        <h1 className="font-inter mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
          Belajar <span className="font-mono">Programming</span> Lebih <span className="text-primary">Terarah</span>, Tanpa Bingung
          <br className="hidden sm:block" /> Mulai dari Mana
        </h1>

        <p className="font-inter mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground">
          Pandu menyusun <strong className="text-foreground">roadmap belajar harian yang terstruktur dan progresif</strong>{" "}
          sesuai tujuan, target waktu, dan jam belajarmu. Kamu tinggal belajar hari demi hari —
          Pandu yang merencanakan.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={primaryHref}
            className="font-inter inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Mulai Belajar Gratis
            <FiArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#cara-kerja"
            className="font-inter inline-flex w-full sm:w-auto items-center justify-center gap-2 border border-border bg-background px-7 py-3.5 rounded-xl text-base font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Lihat Cara Kerjanya
            <FiChevronDown className="h-4 w-4" />
          </a>
        </div>

        <p className="font-inter mt-4 text-sm text-muted-foreground">
          Gratis · Email atau Google · Buat hanya dalam 5 menit
        </p>

        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  const [tasks, setTasks] = useState<HeroTask[]>(INITIAL_TASKS);

  const completed = tasks.filter((t) => t.done).length;
  const percent = Math.round((completed / tasks.length) * 100);

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  return (
    <motion.div
      animate={{
        y: [0, -12, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="mx-auto mt-14 max-w-3xl text-left">
      <div className="rounded-2xl border border-border bg-white p-5 shadow-2xl shadow-primary/10">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary font-inter">
              Goal: Web Developer · 30 hari
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-3 py-1.5 text-md font-bold text-orange-600 font-inter">
              <FaFire className="h-4 w-4" /> 7
            </span>
            <span
              className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-md font-bold text-emerald-600 min-w-[3rem] justify-center font-inter"
              aria-live="polite"
            >
              {percent}%
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="font-inter rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
            Tugas Hari ke-5
          </span>
          <div
            className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress tugas"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="font-inter text-xs text-muted-foreground" aria-live="polite">
            {completed}/{tasks.length} selesai
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-xl border border-border p-3.5 transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleTask(t.id)}
                aria-pressed={t.done}
                aria-label={`Tandai "${t.title}" ${t.done ? "belum selesai" : "selesai"}`}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer ${t.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40 bg-white hover:border-primary hover:bg-primary/10"
                  }`}
              >
                {t.done && <FiCheck className="h-4 w-4" strokeWidth={3} />}
              </button>
              <span
                className={`font-inter text-sm font-medium transition-colors ${t.done ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
              >
                {t.title}
              </span>
              <span className="font-inter ml-auto text-xs text-muted-foreground">
                ± {t.minutes} mnt
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
