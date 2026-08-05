import { STATS, type Stat } from "./content";

interface StatsProps {
  stats?: Stat[];
}

/** Strip of quick-win stats shown under the hero. */
export default function Stats({ stats = STATS }: StatsProps) {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {stats.map((s) => (
          <div key={s.value} className="flex flex-col items-center gap-1.5">
            <span className="text-primary">{s.icon}</span>
            <span className="font-inter font-bold text-foreground">{s.value}</span>
            <span className="font-inter text-sm text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
