interface MarqueeItem {
  label: string;
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  { label: "Siswa SMK" },
  { label: "Siswa SMA" },
  { label: "Mahasiswa" },
  { label: "Mahasiswa Tingkat Akhir" },
  { label: "Fresh Graduate" },
  { label: "Career Switcher" },
  { label: "Job Seeker" },
  { label: "Intern" },
  { label: "Pekerja" },
  { label: "Profesional" },
  { label: "Freelancer" },
  { label: "Founder" },
  { label: "Entrepreneur" },
  { label: "Content Creator" },
  { label: "Guru / Dosen" },
  { label: "Belajar Otodidak" },
  { label: "Pemula" },
  { label: "Programmer" },
  { label: "UI/UX Designer" },
  { label: "Data Analyst" },
  { label: "Data Scientist" },
  { label: "AI Engineer" },
  { label: "DevOps Engineer" },
  { label: "Product Manager" },
  { label: "Belum Bekerja" },
  { label: "Lainnya" },
];

/**
 * Full-width infinite marquee acting as a visual divider between landing
 * sections. Content is rendered twice so the `translateX(-50%)` loop in
 * `globals.css` (--animate-marquee) cycles seamlessly without a jump.
 */
export default function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden border-y border-border bg-primary py-4"
    >
      <div className="flex w-max animate-marquee items-center gap-8">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-8 font-inter"
            aria-hidden={i === 1}
          >
            {MARQUEE_ITEMS.map((item) => (
              <div key={item.label} className="flex shrink-0 items-center gap-8">
                <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-primary-foreground">
                  {item.label}
                </span>
                <span className="text-primary-foreground/60">•</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
