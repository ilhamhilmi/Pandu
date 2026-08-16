import type { ReactNode } from "react";
import {
  FiBookOpen,
  FiTarget,
  FiSettings,
  FiSmile,
  FiMap,
  FiCalendar,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";
import { FaFire, FaRobot, FaGraduationCap, FaCompass } from "react-icons/fa";

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Untuk Siapa", href: "#untuk-siapa" },
  { label: "FAQ", href: "#faq" },
];

export interface Stat {
  icon: ReactNode;
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { icon: <FiMap className="h-5 w-5" />, value: "Roadmap Relevan", label: "Disusun oleh AI sesuai goal kamu" },
  { icon: <FiCalendar className="h-5 w-5" />, value: "Tugas per 7 hari", label: "To-do harian yang relevan" },
  { icon: <FiTrendingUp className="h-5 w-5" />, value: "Streak & progress", label: "Pantau perkembangan setiap hari" },
  { icon: <FiBookOpen className="h-5 w-5" />, value: "Sumber belajar", label: "Artikel & video terpercaya" },
];

export interface Feature {
  icon: ReactNode;
  title: string;
  desc: string;
}

export const FEATURES: Feature[] = [
  {
    icon: <FaRobot className="h-6 w-6" />,
    title: "AI Roadmap",
    desc: "AI (Gemini 3.6 Flash) menyusun roadmap berfase dari preferensimu — goal, target waktu, skill saat ini, dan jam belajar per hari.",
  },
  {
    icon: <FiCheckCircle className="h-6 w-6" />,
    title: "To-do Harian yang Relevan",
    desc: "Task harian yang jelas, lengkap dengan estimasi durasi dan sumber belajar. Hari berikutnya terbuka setelah semuanya selesai.",
  },
  {
    icon: <FaFire className="h-6 w-6" />,
    title: "Streak & Progress",
    desc: "Jaga motivasi dengan streak harian, hari ke-, dan progress keseluruhan yang tampil visual di dashboard.",
  },
  {
    icon: <FiBookOpen className="h-6 w-6" />,
    title: "Perpustakaan Belajar",
    desc: "Koleksi video & artikel belajar dari sumber tepercaya seperti w3schools, MDN, dan channel YouTube pilihan.",
  },
  {
    icon: <FiTarget className="h-6 w-6" />,
    title: "Latihan Sintaks",
    desc: "Soal latihan coding yang dibuat AI sesuai roadmapmu untuk menguji pemahaman kamu.",
  },
  {
    icon: <FiSettings className="h-6 w-6" />,
    title: "Personalisasi",
    desc: "Cukup isi preferensi — Pandu akan menyesuaikan To-do harian, kepadatan task, dan target durasi harianmu.",
  },
];

export interface Step {
  step: string;
  title: string;
  desc: string;
}

export const STEPS: Step[] = [
  {
    step: "01",
    title: "Isi Preferensi",
    desc: "Pilih goal belajar, target waktu, skill saat ini, dan jam belajar per hari.",
  },
  {
    step: "02",
    title: "AI Bikin Roadmap",
    desc: "AI menyusun roadmap berfase berdasarkan preferensimu, langkah demi langkah.",
  },
  {
    step: "03",
    title: "Task Harian Muncul",
    desc: "AI buatin kamu to-do list per 7 hari, lengkap dengan durasi dan sumber belajar yang actionable.",
  },
  {
    step: "04",
    title: "Belajar & Pantau",
    desc: "Kerjakan task, jaga streak, coba latihan dan lihat progress kamu naik setiap hari. Lanjut ke fase berikutnya saat siap.",
  },
];

export interface Persona {
  icon: ReactNode;
  title: string;
  desc: string;
}

export const PERSONAS: Persona[] = [
  {
    icon: <FiSmile className="h-6 w-6" />,
    title: "Pemula Total",
    desc: "Belum pernah coding sama sekali dan bingung harus mulai dari mana. Pandu kasih peta yang jelas dari nol.",
  },
  {
    icon: <FaCompass className="h-6 w-6" />,
    title: "Belajar Tidak Terarah",
    desc: "Sudah belajar sedikit tapi tidak terstruktur, sering “tutorial hopping”. Pandu merapikan semuanya buat kamu.",
  },
  {
    icon: <FaGraduationCap className="h-6 w-6" />,
    title: "Pindah Bidang",
    desc: "Ingin pindah bidang ke tech lain namun kebingungan untuk memulai darimana dan apa saja yang harus dipelajari.",
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    q: "Apakah Pandu gratis?",
    a: "Ya, kamu bisa bikin akun gratis tanpa kartu kredit dan langsung mulai belajar. Cukup daftar lewat email & password atau pakai akun Google.",
  },
  {
    q: "Apakah saya perlu sudah bisa coding?",
    a: "Tidak perlu. Pandu menyusun roadmap dari level kamu saat ini — bahkan dari “belum tahu apa-apa” sekalipun. Kamu tinggal mengikuti langkah demi langkah.",
  },
  {
    q: "Bagaimana Pandu menyusun roadmap?",
    a: "Kamu mengisi preferensi belajar (goal, target waktu, skill, jam belajar/hari). AI kemudian membuat roadmap berfase serta task harian yang actionable, lengkap dengan estimasi durasi dan sumber belajar.",
  },
  {
    q: "Apakah Pandu membuat konten belajar?",
    a: "Tidak. Pandu adalah kurator & perencana — ia mengarahkanmu ke sumber belajar yang sudah ada di internet seperti w3schools, MDN, dan YouTube. Kamu fokus belajar, bukan mencari materi.",
  },
  {
    q: "Bagaimana sistem unlock hari berikutnya?",
    a: "Berbasis penyelesaian (completion-based). Fase/hari berikutnya terbuka setelah semua task pada fase sebelumnya selesai, bukan berdasarkan kalender — jadi kamu bisa belajar sesuai ritme sendiri.",
  },
];
