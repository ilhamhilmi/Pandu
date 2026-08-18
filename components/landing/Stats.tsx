import { STATS, type Stat } from "./content";

interface StatsProps {
  stats?: Stat[];
}

const ICON_TINTS = [
  "bg-orange-100 text-orange-600",
  "bg-violet-100 text-violet-600",
  "bg-amber-100 text-amber-600",
  "bg-sky-100 text-sky-600",
];

/** Strip of quick-win stats shown under the hero. */
export default function Stats({ stats = STATS }: StatsProps) {
  return (
    <section className="border-y border-border bg-gradient-to-r from-orange-50/70 via-violet-50/40 to-sky-50/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <div key={s.value} className="flex flex-col items-center gap-1.5">
            <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${ICON_TINTS[i % ICON_TINTS.length]}`}>
              {s.icon}
            </span>
            <span className="font-inter font-bold text-foreground">{s.value}</span>
            <span className="font-inter text-sm text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
