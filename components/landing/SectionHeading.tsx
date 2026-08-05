import type { ReactNode } from "react";
import { FiZap } from "react-icons/fi";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

/** Reusable centered section heading with an optional eyebrow pill. */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  icon = <FiZap className="h-4 w-4" />,
}: SectionHeadingProps) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
        {icon}
        {eyebrow}
      </div>
      <h2 className="font-inter mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="font-inter mt-4 text-base text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
