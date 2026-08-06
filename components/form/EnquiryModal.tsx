"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { EnquiryFormLazy as EnquiryForm } from "@/components/form/EnquiryFormLazy";
import { useEnquiryModal } from "@/lib/context/EnquiryModalContext";
import { company } from "@/data/company";

const COMMITMENTS = ["Samples in 7 days", "MOQ from 500 kg", "Reply within one working day"];
const EXIT_DURATION_MS = 250;

export function EnquiryModal() {
  const { isOpen, lockedProduct, close } = useEnquiryModal();
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  // Same manual mount/unmount as ProductModal — Framer Motion's
  // AnimatePresence proved unreliable to unmount in this stack (see
  // ProductModal.tsx for the full note).
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const unmountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (unmountTimeoutRef.current) {
        clearTimeout(unmountTimeoutRef.current);
        unmountTimeoutRef.current = null;
      }
      if (!isMounted) triggerRef.current = document.activeElement;
      setIsMounted(true);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    if (isMounted) {
      setIsVisible(false);
      unmountTimeoutRef.current = setTimeout(() => {
        setIsMounted(false);
        const el = triggerRef.current;
        if (el instanceof HTMLElement) el.focus();
      }, EXIT_DURATION_MS);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(
    () => () => {
      if (unmountTimeoutRef.current) clearTimeout(unmountTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key === "Tab") {
        const focusable = dialog?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isMounted) return null;

  const dialogHidden = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 };
  const dialogShown = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6">
      <motion.button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        initial={false}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: EXIT_DURATION_MS / 1000 }}
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        className="relative flex h-[92svh] w-full max-w-[1100px] flex-col overflow-hidden bg-surface-raised md:h-auto md:max-h-[88svh] md:flex-row md:rounded-photo"
        initial={dialogHidden}
        animate={isVisible ? dialogShown : dialogHidden}
        transition={{ duration: EXIT_DURATION_MS / 1000 }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          data-autofocus
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface-raised/90 text-ink shadow-[0_1px_8px_color-mix(in_srgb,var(--color-brand-deep)_14%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:right-6 md:top-6"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <div className="relative flex shrink-0 flex-col justify-center overflow-hidden bg-brand-deep p-8 md:w-[38%] md:p-10">
          <Image
            src="/images/products/king-chilli-bhut-jolokia.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 38vw, 100vw"
            className="object-cover opacity-[0.16]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/95 to-brand-deep/70" />

          <div className="relative">
            <Eyebrow tone="on-deep" as="p">
              Start here
            </Eyebrow>
            <Heading level={3} id="enquiry-modal-title" className="mt-3 text-on-deep">
              Tell us what you need.
            </Heading>
            <p className="mt-3 text-body text-on-deep-muted">
              One form reaches the same team that sources, tests and ships every lot.
            </p>

            <ul className="mt-8 flex flex-col gap-2 border-t border-on-deep-muted pt-6">
              {COMMITMENTS.map((line) => (
                <li key={line} className="font-mono text-small tracking-mono-label text-on-deep-muted">
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-2 border-t border-on-deep-muted pt-6 text-small text-on-deep-muted">
              <a href={`mailto:${company.contact.email}`} className="hover:text-on-deep">
                {company.contact.email}
              </a>
              <a href={`tel:${company.contact.phone.replace(/\s/g, "")}`} className="hover:text-on-deep">
                {company.contact.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto p-6 md:w-[62%] md:p-10">
          <EnquiryForm variant="full" lockedProduct={lockedProduct} sourceSection="main_form" />
        </div>
      </motion.div>
    </div>
  );
}
