import SectionHeading from "./SectionHeading";
import { FEATURES, type Feature } from "./content";

export interface FeatureCardProps {
  feature: Feature;
  chipClass?: string;
}

const CARD_CHIPS = [
  "bg-teal-100 text-teal-600",
  "bg-violet-100 text-violet-600",
  "bg-amber-100 text-amber-600",
  "bg-sky-100 text-sky-600",
  "bg-rose-100 text-rose-500",
  "bg-emerald-100 text-emerald-600",
];

export function FeatureCard({ feature, chipClass }: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${chipClass}`}>
        {feature.icon}
      </div>
      <h3 className="font-inter mt-5 text-lg font-bold text-foreground">{feature.title}</h3>
      <p className="font-inter mt-2 text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
    </div>
  );
}

interface FeaturesProps {
  features?: Feature[];
}

export default function Features({ features = FEATURES }: FeaturesProps) {
  return (
    <section id="fitur" className="scroll-mt-20 bg-gradient-to-b from-white to-teal-50/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 font-inter">
        <SectionHeading
          eyebrow="Fitur Utama"
          title="Semua yang kamu butuhkan untuk belajar konsisten"
          subtitle="Pandu adalah kurator & perencana — mengarahkanmu ke sumber belajar terbaik, bukan membuat kontennya."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} chipClass={CARD_CHIPS[i % CARD_CHIPS.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}
