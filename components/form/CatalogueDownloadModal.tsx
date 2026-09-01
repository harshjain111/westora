"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/form/Field";
import { inputClassName } from "@/components/form/inputStyles";
import {
  catalogueDownloadSchema,
  type CatalogueDownloadValues,
} from "@/lib/schemas/catalogueDownload";
import { requestCatalogueDownload } from "@/lib/actions/catalogueDownload";
import { track } from "@/lib/analytics/track";

const EXIT_DURATION_MS = 250;

export interface CatalogueDownloadTriggerProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Renders the trigger (a plain button styled like the link it replaces)
 * and the gate modal together, so Footer.tsx — a Server Component — only
 * needs to mount one client island rather than lifting this into shared
 * state (there's exactly one place this is used).
 */
export function CatalogueDownloadTrigger({ href, className, children }: CatalogueDownloadTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const unmountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CatalogueDownloadValues>({
    resolver: zodResolver(catalogueDownloadSchema),
    defaultValues: { fullName: "", phone: "", email: "", companyWebsite: "" },
  });

  const close = () => setIsOpen(false);

  // Same manual mount/unmount as ProductModal/EnquiryModal — Framer
  // Motion's AnimatePresence proved unreliable to unmount in this stack.
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
        setIsDownloaded(false);
        setServerError(null);
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
      if (event.key !== "Tab") return;
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
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const triggerDownload = () => {
    const link = document.createElement("a");
    link.href = href;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSubmit = async (values: CatalogueDownloadValues) => {
    setServerError(null);
    const result = await requestCatalogueDownload(values);

    if (result.success) {
      track("catalogue_pdf_download");
      triggerDownload();
      setIsDownloaded(true);
    } else {
      setServerError(result.error);
    }
  };

  const dialogHidden = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 };
  const dialogShown = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>

      {isMounted && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
            aria-labelledby="catalogue-download-title"
            className="relative w-full max-w-[440px] overflow-hidden rounded-photo bg-surface-raised p-6 sm:p-8"
            initial={dialogHidden}
            animate={isVisible ? dialogShown : dialogHidden}
            transition={{ duration: EXIT_DURATION_MS / 1000 }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              data-autofocus={isDownloaded ? true : undefined}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {isDownloaded ? (
              <div role="status">
                <p id="catalogue-download-title" className="font-display text-h3 text-ink">
                  Your download has started.
                </p>
                <p className="mt-3 text-body text-ink-muted">
                  If it didn&apos;t open automatically,{" "}
                  <a href={href} download className="text-accent underline underline-offset-2">
                    click here
                  </a>
                  .
                </p>
              </div>
            ) : (
              <>
                <h2 id="catalogue-download-title" className="font-display text-h3 text-ink">
                  Download the catalogue
                </h2>
                <p className="mt-2 text-small text-ink-muted">
                  Tell us who to send it to and the PDF downloads right away.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-5">
                  <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="catalogue-company-website">Leave this field blank</label>
                    <input
                      id="catalogue-company-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("companyWebsite")}
                    />
                  </div>

                  <Field label="Full name" htmlFor="catalogue-fullName" required error={errors.fullName?.message}>
                    <input
                      id="catalogue-fullName"
                      data-autofocus
                      className={inputClassName}
                      {...register("fullName")}
                    />
                  </Field>

                  <Field label="Phone / WhatsApp" htmlFor="catalogue-phone" required error={errors.phone?.message}>
                    <input
                      id="catalogue-phone"
                      type="tel"
                      className={inputClassName}
                      {...register("phone")}
                    />
                  </Field>

                  <Field label="Email" htmlFor="catalogue-email" error={errors.email?.message} hint="Optional">
                    <input
                      id="catalogue-email"
                      type="email"
                      className={inputClassName}
                      {...register("email")}
                    />
                  </Field>

                  {serverError && (
                    <p role="alert" className="text-small font-medium text-ink">
                      — {serverError}
                    </p>
                  )}

                  <Button type="submit" variant="primary" loading={isSubmitting} loadingLabel="Preparing…">
                    Download catalogue
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
