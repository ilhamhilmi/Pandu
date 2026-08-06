import SectionHeading from "./SectionHeading";
import { PERSONAS, type Persona } from "./content";

export interface PersonaCardProps {
  persona: Persona;
  chipClass?: string;
}

const PERSONA_CHIPS = [
  "bg-teal-100 text-teal-600",
  "bg-violet-100 text-violet-600",
  "bg-amber-100 text-amber-600",
];

export function PersonaCard({ persona, chipClass }: PersonaCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
      <div className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl ${chipClass}`}>
        {persona.icon}
      </div>
      <h3 className="font-inter mt-5 text-lg font-bold text-foreground">{persona.title}</h3>
      <p className="font-inter mt-2 text-sm text-muted-foreground leading-relaxed">{persona.desc}</p>
    </div>
  );
}

interface TargetUsersProps {
  personas?: Persona[];
}

export default function TargetUsers({ personas = PERSONAS }: TargetUsersProps) {
  return (
    <section id="untuk-siapa" className="scroll-mt-20 bg-gradient-to-b from-teal-50/40 to-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 font-inter">
        <SectionHeading
          eyebrow="Untuk Siapa"
          title="Pandu hadir untuk perjalanan belajarmu"
          subtitle="Apapun titik awalmu, Pandu akan menyesuaikan rencana belajar dengan kondisi kamu."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {personas.map((persona, i) => (
            <PersonaCard key={persona.title} persona={persona} chipClass={PERSONA_CHIPS[i % PERSONA_CHIPS.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}
