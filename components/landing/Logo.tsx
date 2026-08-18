import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** CSS width of the logo container (default 6.5rem) */
  widthClassName?: string;
  priority?: boolean;
}

/**
 * Reusable Pandu wordmark logo using /icon/Pandu-new.svg.
 * The image uses object-contain so the aspect ratio is preserved regardless
 * of the container width/height.
 */
export default function Logo({
  className,
  widthClassName = "w-[6.5rem]",
  priority = false,
}: LogoProps) {
  return (
    <div
      className={cn("relative h-9", widthClassName, className)}
      aria-label="Pandu - Belajar Programming Jadi Terarah"
      role="img"
    >
      <Image
        src="/icon/Pandu-new.svg"
        alt="Pandu - Belajar Programming Jadi Terarah"
        fill
        priority={priority}
        sizes={widthClassName}
        style={{ objectFit: "contain", objectPosition: "left center" }}
      />
    </div>
  );
}
