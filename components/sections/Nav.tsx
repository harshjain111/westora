"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "#catalogue", label: "Catalogue" },
  { href: "#quality", label: "Quality" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
] as const;

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Focus trap + ESC close for the mobile drawer.
  useEffect(() => {
    if (!isDrawerOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusable?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [isDrawerOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-b-transparent transition-[background-color,border-color] duration-200",
        isScrolled && "bg-brand-deep border-b-rule",
      )}
    >
      <Container as="nav" aria-label="Primary" className="flex h-20 items-center justify-between">
        <a href="#" className="text-on-deep" aria-label="Westora Global — back to top">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={activeSection === link.href.slice(1) ? "true" : undefined}
                className={cn(
                  "font-mono text-small tracking-mono-label uppercase text-on-deep-muted transition-colors hover:text-on-deep",
                  activeSection === link.href.slice(1) && "text-on-deep",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          {/* Nav always sits on a dark ground (hero photo or brand-deep
              solid), so the primary variant's focus ring needs the
              on-deep accent here even though the variant itself doesn't
              assume that context. */}
          <Button
            as="a"
            href="#enquiry"
            variant="primary"
            className="focus-visible:outline-accent-on-deep"
          >
            Request a quote
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open menu"
          aria-expanded={isDrawerOpen}
          className="flex h-11 w-11 items-center justify-center text-on-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-on-deep md:hidden"
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
            <path d="M0 1H22" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0 8H22" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0 15H22" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </Container>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-ink/60"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-[360px] flex-col bg-brand-deep p-6"
          >
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center text-on-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-on-deep"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            <ul className="mt-8 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className="font-display text-h3 text-on-deep"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <Button
                as="a"
                href="#enquiry"
                variant="primary"
                size="lg"
                className="w-full focus-visible:outline-accent-on-deep"
                onClick={() => setIsDrawerOpen(false)}
              >
                Request a quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
