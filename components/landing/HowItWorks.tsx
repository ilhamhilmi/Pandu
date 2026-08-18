import SectionHeading from "./SectionHeading";
import { STEPS, type Step } from "./content";

export interface StepCardProps {
  step: Step;
  numberClass?: string;
}

const STEP_NUMBERS = [
  "text-orange-500",
  "text-violet-500",
  "text-amber-500",
  "text-sky-500",
];

export function StepCard({ step, numberClass }: StepCardProps) {
  return (
    <div className="relative rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
      <span className={`font-inter text-4xl font-bold ${numberClass}`}>{step.step}</span>
      <h3 className="font-inter mt-4 text-lg font-bold text-foreground">{step.title}</h3>
      <p className="font-inter mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
    </div>
  );
}

interface HowItWorksProps {
  steps?: Step[];
}

export default function HowItWorks({ steps = STEPS }: HowItWorksProps) {
  return (
    <section id="cara-kerja" className="scroll-mt-20 border-t border-border bg-gradient-to-r from-violet-50/50 via-orange-50/50 to-sky-50/50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 font-inter">
        <SectionHeading
          eyebrow="Cara Kerja"
          title="Mulai belajar dalam 4 langkah sederhana"
          subtitle="Dari bingung “harus mulai dari mana” jadi punya rencana harian yang jelas."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((step, i) => (
            <StepCard key={step.step} step={step} numberClass={STEP_NUMBERS[i % STEP_NUMBERS.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}
