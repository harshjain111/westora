"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { useCatalogueFilter } from "@/lib/context/CatalogueFilterContext";
import { track } from "@/lib/analytics/track";
import { products } from "@/data/products";
import { cn } from "@/lib/utils/cn";

interface StateMarker {
  name: string;
  x: number; // percentage across the map container
  y: number; // percentage down the map container
}

// Positions are a hand-simplified, illustrative layout of the Northeast
// India "Seven Sisters" region — not a georeferenced map.
const STATES: StateMarker[] = [
  { name: "Arunachal Pradesh", x: 62, y: 14 },
  { name: "Assam", x: 44, y: 44 },
  { name: "Nagaland", x: 74, y: 42 },
  { name: "Meghalaya", x: 22, y: 56 },
  { name: "Manipur", x: 70, y: 68 },
  { name: "Mizoram", x: 54, y: 84 },
];

function cropsForState(state: string): string[] {
  return products.filter((product) => product.origin === state).map((product) => product.name);
}

export function OriginMap() {
  const { setStateFilter } = useCatalogueFilter();
  const [activeState, setActiveState] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleSelect = (state: string) => {
    track("origin_map_state_click", { state });
    setStateFilter(state);
    document
      .getElementById("catalogue")
      ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <section className="bg-brand-deep py-24 lg:py-40">
      <Container>
        <div className="max-w-[640px]">
          <Eyebrow tone="on-deep" as="p">
            Origin
          </Eyebrow>
          <Heading level={2} className="mt-4 text-on-deep">
            Six states, one region
          </Heading>
          <p className="mt-4 text-lead text-on-deep-muted">
            Select a state to see what we source from it.
          </p>
        </div>

        <div className="relative mx-auto mt-16 aspect-[4/5] w-full max-w-[560px]">
          {/* Hand-simplified, intentionally quiet — a spatial backdrop for
              the six markers, not an attempt at cartographic accuracy. The
              dots and tooltips carry the actual information; this recedes. */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 h-full w-full text-brand-mid"
            aria-hidden="true"
          >
            <path
              d="M110,170 C105,110 150,55 205,52 C270,48 315,95 315,150 C315,200 300,250 270,300 C240,345 190,355 150,320 C110,290 90,240 95,200 C97,185 103,178 110,170 Z"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
          </svg>

          {STATES.map((state) => {
            const crops = cropsForState(state.name);
            const isActive = activeState === state.name;

            return (
              <div
                key={state.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${state.x}%`, top: `${state.y}%` }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setActiveState(state.name)}
                  onMouseLeave={() => setActiveState(null)}
                  onFocus={() => setActiveState(state.name)}
                  onBlur={() => setActiveState(null)}
                  onClick={() => handleSelect(state.name)}
                  aria-label={`${state.name} — ${crops.length} product${crops.length === 1 ? "" : "s"}. View in catalogue.`}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-on-deep",
                  )}
                >
                  <span
                    className={cn(
                      "block h-2.5 w-2.5 rounded-full bg-accent-on-deep transition-transform duration-200",
                      isActive && "scale-150",
                    )}
                  />
                </button>

                {isActive && (
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute left-1/2 top-full z-10 w-max max-w-[220px] -translate-x-1/2 border border-on-deep-muted bg-brand-deep p-3 text-left"
                  >
                    <p className="font-mono text-eyebrow uppercase tracking-mono-label text-accent-on-deep">
                      {state.name}
                    </p>
                    <p className="mt-1 text-small text-on-deep-muted">
                      {crops.length > 0 ? crops.join(" · ") : "Northeast India origin"}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
