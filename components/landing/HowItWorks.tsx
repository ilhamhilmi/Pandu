import SectionHeading from "./SectionHeading";
import { STEPS, type Step } from "./content";

export interface StepCardProps {
  step: Step;
}

export function StepCard({ step }: StepCardProps) {
  return (
    <div className="relative rounded-2xl border border-border bg-white p-6">
      <span className="font-inter text-4xl font-bold text-primary/30">{step.step}</span>
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
    <section id="cara-kerja" className="scroll-mt-20 border-t border-border bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 font-inter">
        <SectionHeading
          eyebrow="Cara Kerja"
          title="Mulai belajar dalam 4 langkah sederhana"
          subtitle="Dari bingung “harus mulai dari mana” jadi punya rencana harian yang jelas."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((step) => (
            <StepCard key={step.step} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
