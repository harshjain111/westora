"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconBadge } from "@/components/ui/IconBadge";
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
    // The bar itself is a transparent full-width shell; everything
    // visible lives on the inner "island". At the top of the hero that
    // island is edge-to-edge and completely transparent, so the hero
    // video runs unbroken to the top of the page. Past the hero it
    // contracts into a floating rounded pill with a blurred fill.
    //
    // The blur is deliberately only applied in the scrolled state: a
    // permanently-mounted backdrop-blur is recomputed every scroll frame
    // across the whole site, which is the mobile jank this file used to
    // carry. Here it is absent for the entire hero and only switches on
    // once the island has shrunk to ~1100px, so the blurred area is
    // small and bounded.
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5">
      <Container
        as="nav"
        aria-label="Primary"
        className={cn(
          "flex items-center justify-between",
          "transition-[max-width,margin,padding,background-color,box-shadow,border-color,border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isScrolled
            ? "mt-3 max-w-[1120px] rounded-full border border-rule bg-surface-raised/80 px-5 py-2 shadow-[0_10px_40px_rgba(43,32,21,0.14)] backdrop-blur-xl lg:px-6"
            : "mt-0 max-w-[1320px] rounded-none border border-transparent bg-transparent px-6 py-6 shadow-none md:px-10 lg:px-16",
        )}
      >
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
          <Image
            src="/images/logo-full.png"
            alt="Westora Global"
            width={140}
            height={102}
            priority
            className={cn(
              "w-auto transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isScrolled ? "h-11" : "h-[72px]",
            )}
          />
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

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Button
              variant="primary"
              className="gap-3 rounded-full bg-brand-deep pl-7 pr-2 text-on-deep hover:brightness-125"
              onClick={() => openEnquiry()}
            >
              Request a quote
              <IconBadge icon="arrowRight" size="sm" filled className="h-8 w-8 bg-surface-raised text-ink" />
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={isDrawerOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
          >
            <svg width="18" height="13" viewBox="0 0 18 13" fill="none" aria-hidden="true">
              <path d="M0 1H18" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 6.5H18" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 12H18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
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
