"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useEnquiryModal } from "@/lib/context/EnquiryModalContext";
import { cn } from "@/lib/utils/cn";

// #faq was dropped — the FAQ section only renders once data/faq.ts has real
// question/answer copy (CLAUDE.md §11), and it's empty right now, so no
// #faq element exists on the page. #origin replaces it as the fourth link.
const NAV_LINKS = [
  { href: "#catalogue", label: "Catalogue" },
  { href: "#quality", label: "Quality" },
  { href: "#about", label: "About" },
  { href: "#origin", label: "Origin" },
] as const;

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

export function Nav() {
  const { open: openEnquiry } = useEnquiryModal();
  const pathname = usePathname();
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
        // A 20px backdrop-blur on a fixed header that's always mounted
        // meant the browser recomputed it on every scroll frame across
        // the whole site — a real mobile jank source. bg-surface-raised
        // was already 96% opaque, so the blur was doing almost no visual
        // work for its cost; dropped in favour of a near-solid fill.
        "fixed inset-x-0 top-0 z-50 border-b bg-surface-raised/98 transition-shadow duration-200",
        isScrolled ? "border-b-rule shadow-[0_1px_0_0_rgba(0,0,0,0.02)]" : "border-b-transparent",
      )}
    >
      <Container as="nav" aria-label="Primary" className="flex h-[88px] items-center justify-between">
        <Link
          href="/"
          aria-label="Westora Global — back to top"
          className="shrink-0"
          onClick={(event) => {
            if (pathname === "/") {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Image src="/images/logo-full.png" alt="Westora Global" width={140} height={102} className="h-12 w-auto" priority />
        </Link>

        <ul className="hidden items-center gap-12 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={activeSection === link.href.slice(1) ? "true" : undefined}
                className={cn(
                  "group relative inline-block py-1 font-mono text-small tracking-mono-label uppercase text-ink-muted transition-colors hover:text-brand-deep",
                  activeSection === link.href.slice(1) && "text-accent",
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-brand-deep transition-transform duration-200 group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button variant="primary" onClick={() => openEnquiry()}>
            Request a quote
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open menu"
          aria-expanded={isDrawerOpen}
          className="flex h-11 w-11 items-center justify-center text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
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
                variant="primary"
                size="lg"
                className="w-full focus-visible:outline-accent-on-deep"
                onClick={() => {
                  setIsDrawerOpen(false);
                  openEnquiry();
                }}
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
