import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export interface MotifProps {
  /** "a" is the upper branch cluster, "b" the lower — cropped independently
   * from the same source illustration so they can be placed in different
   * corners without dragging the whole composition along. "full" is the
   * uncropped source (both clusters, one in each corner) for filling a
   * large stretch of a section rather than a single corner accent. */
  variant?: "a" | "b" | "full";
  /** "default" is recoloured with --color-accent (for light/surface
   * grounds); "on-deep" uses --color-accent-on-deep so it stays visible
   * against bg-brand-deep instead of going muddy. */
  tone?: "default" | "on-deep";
  /** Use next/image `fill` (parent must be `relative` with a defined size)
   * instead of intrinsic width/height — for spanning a whole section. */
  fill?: boolean;
  className?: string;
}

const SOURCE = {
  default: {
    a: { src: "/images/motif-branch-a.png", width: 694, height: 536 },
    b: { src: "/images/motif-branch-b.png", width: 592, height: 590 },
    full: { src: "/images/motif-full.png", width: 1536, height: 1024 },
  },
  "on-deep": {
    a: { src: "/images/motif-branch-a-on-deep.png", width: 694, height: 536 },
    b: { src: "/images/motif-branch-b-on-deep.png", width: 592, height: 590 },
    full: { src: "/images/motif-full-on-deep.png", width: 1536, height: 1024 },
  },
} as const;

/** Purely decorative botanical line art — recoloured to an accent token so
 * it always tracks the palette. Low-opacity filler for open whitespace;
 * never load-bearing content, always aria-hidden. */
export function Motif({ variant = "a", tone = "default", fill = false, className }: MotifProps) {
  const { src, width, height } = SOURCE[tone][variant];

  if (fill) {
    return (
      <Image
        src={src}
        alt=""
        fill
        aria-hidden="true"
        sizes="100vw"
        className={cn("pointer-events-none select-none object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
    />
  );
}
