"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import SectionHeading from "./SectionHeading";
import { FAQS, type FaqItem } from "./content";

interface FaqProps {
  items?: FaqItem[];
}

export default function Faq({ items = FAQS }: FaqProps) {
  const [openItem, setOpenItem] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 border-t border-border bg-gradient-to-r from-sky-50/50 via-white to-teal-50/50 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 font-inter">
        <SectionHeading eyebrow="FAQ" title="Pertanyaan yang Sering Diajukan" />

        <div className="mt-10 space-y-3">
          {items.map((faq, i) => {
            const isOpen = openItem === i;
            return (
              <div key={faq.q} className="rounded-xl border border-border bg-white overflow-hidden">
                <button
                  onClick={() => setOpenItem(isOpen ? null : i)}
                  className="font-inter flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  {faq.q}
                  <FiChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="font-inter px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
