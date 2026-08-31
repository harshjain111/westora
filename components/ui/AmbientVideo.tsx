"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/**
 * Silent looping background footage that upgrades a still, rather than
 * replacing it.
 *
 * The poster is a real next/image and is the only thing that renders on
 * first paint — so it, not the video, is the LCP candidate and PRD §2's
 * "LCP (mobile, 4G) ≤ 2.5s" target is unaffected. The <video> is only
 * given a src once ALL of these hold:
 *
 *   1. the visitor has not asked for reduced motion,
 *   2. the viewport is at least `minWidth` (default 1024) — phones never
 *      download the file at all, they keep the poster,
 *   3. the element has actually scrolled into view.
 *
 * Once loaded it plays only while on screen and pauses otherwise, so a
 * page with several of these never has more than the visible ones
 * decoding. The video fades up over the poster on `canplay`, which also
 * means a failed or slow load degrades to exactly the still image that
 * was there before — never a black box.
 */

export interface AmbientVideoProps {
  /** Path under /public, e.g. "/video/hero-origin.mp4". Omit to render
   *  the poster alone — lets a caller treat footage-backed and
   *  still-only slots identically instead of branching at the call site. */
  src?: string;
  /** Statically imported still. Renders immediately and is the fallback. */
  poster: StaticImageData;
  alt: string;
  /** next/image sizes hint for the poster. */
  sizes?: string;
  /** Poster gets priority (above-the-fold only). */
  priority?: boolean;
  /** Min viewport width in px before the video is fetched at all. */
  minWidth?: number;
  className?: string;
  /** object-position utility applied to BOTH poster and video. */
  objectPosition?: string;
}

export function AmbientVideo({
  src,
  poster,
  alt,
  sizes = "50vw",
  priority = false,
  minWidth = 1024,
  className,
  objectPosition = "object-center",
}: AmbientVideoProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Gate 1 + 2 + 3: motion preference, viewport width, and intersection.
  useEffect(() => {
    if (!src) return;
    if (prefersReducedMotion) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia(`(min-width: ${minWidth}px)`).matches) return;

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [src, prefersReducedMotion, minWidth]);

  // Play only while on screen. A paused off-screen video costs nothing;
  // several decoding at once on a long page costs a great deal.
  useEffect(() => {
    if (!shouldLoad) return;
    const node = containerRef.current;
    const video = videoRef.current;
    if (!node || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void video.play().catch(() => {
              /* autoplay refused — poster stays, nothing to recover */
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <Image
        src={poster}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", objectPosition)}
      />

      {shouldLoad && src && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          onCanPlay={() => setIsReady(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            objectPosition,
            isReady ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
