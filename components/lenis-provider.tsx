"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

interface LenisProviderProps {
  children: ReactNode;
}

/**
 * Global smooth-scroll wrapper powered by Lenis.
 * Mounted once in the root layout and applied to the document scroll.
 */
export default function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      {children}
    </ReactLenis>
  );
}
