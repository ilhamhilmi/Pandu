import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import TargetUsers from "@/components/landing/TargetUsers";
import Marquee from "@/components/landing/Marquee";
import Faq from "@/components/landing/Faq";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Pandu — Belajar Programming Jadi Terarah",
  description:
    "Roadmap belajar programming yang dipersonalisasi dengan AI. Susun rencana belajar harian yang terstruktur dan progresif, lalu belajar hari demi hari tanpa bingung mulai dari mana.",
  openGraph: {
    title: "Pandu — Belajar Programming Jadi Terarah",
    description:
      "Roadmap belajar programming yang dipersonalisasi dengan AI. Belajar dengan terarah dan progresif.",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <TargetUsers />
        <Marquee />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}

