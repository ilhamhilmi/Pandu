import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

interface CtaBannerProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/** Full-width call-to-action banner with brand-colored background. */
export default function CtaBanner({
  title = "Siap mulai belajar programming dengan terarah?",
  subtitle = "Bikin akun gratis, isi preferensimu, biarkan Pandu menyusun roadmap belajar pertamamu dan mulai petualangan belajar otodidak kamu.",
  ctaLabel = "Bikin akun gratis",
  ctaHref = "/sign-up",
}: CtaBannerProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-16 text-center">
          <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <h2 className="font-inter text-3xl sm:text-4xl font-bold text-primary-foreground">{title}</h2>
            <p className="font-inter mx-auto mt-4 max-w-xl text-primary-foreground/90">{subtitle}</p>
            <Link
              href={ctaHref}
              className="font-inter mt-8 inline-flex items-center gap-2 bg-primary-foreground text-primary px-7 py-3.5 rounded-xl text-base font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              {ctaLabel}
              <FiArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
