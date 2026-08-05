import { FiArrowRight, FiCheckCircle, FiChevronDown } from "react-icons/fi";
import { FaFire, FaRobot } from "react-icons/fa";
import Link from "next/link";

interface HeroTask {
  title: string;
  minutes: number;
  done: boolean;
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <FaRobot className="h-4 w-4" />
          Roadmap belajar programming, dipersonalisasi dengan AI
        </div>

        <h1 className="font-inter mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
          Belajar Programming Jadi <span className="text-primary">Terarah</span>, Tanpa Bingung
          <br className="hidden sm:block" /> Mulai dari Mana
        </h1>

        <p className="font-inter mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground">
          Pandu menyusun <strong className="text-foreground">roadmap belajar harian yang terstruktur dan progresif</strong>{" "}
          sesuai tujuan, target waktu, dan jam belajarmu. Kamu tinggal belajar hari demi hari —
          Pandu yang merencanakan.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/sign-up"
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
          Gratis tanpa kartu kredit · Email atau Google · Selesai setup dalam 5 menit
        </p>

        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  const tasks: HeroTask[] = [
    { title: "Belajar struktur HTML", minutes: 45, done: true },
    { title: "CSS dasar: selektor & properti", minutes: 60, done: false },
    { title: "Bangun halaman pertama", minutes: 50, done: false },
  ];

  return (
    <div className="pointer-events-none mx-auto mt-14 max-w-3xl text-left">
      <div className="rounded-2xl border border-border bg-white p-5 shadow-2xl shadow-primary/10">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
              🌟 Goal: Web Developer · 30 hari
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-600">
              <FaFire className="h-4 w-4" /> Streak 7
            </span>
            <span className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">
              43%
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="font-inter rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
            Task Hari ke-7
          </span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[70%] rounded-full bg-primary" />
          </div>
          <span className="font-inter text-xs text-muted-foreground">2/3 selesai</span>
        </div>

        <div className="mt-4 space-y-3">
          {tasks.map((t) => (
            <div key={t.title} className="flex items-center gap-3 rounded-xl border border-border p-3.5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                  t.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40 bg-white"
                }`}
              >
                {t.done && <FiCheckCircle className="h-4 w-4" />}
              </span>
              <span
                className={`font-inter text-sm font-medium ${
                  t.done ? "text-muted-foreground line-through" : "text-foreground"
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
    </div>
  );
}
