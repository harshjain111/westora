"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Chip } from "@/components/ui/Chip";
import { EnquiryFormLazy as EnquiryForm } from "@/components/form/EnquiryFormLazy";
import { ProductSpecTable } from "@/components/product/ProductSpecTable";
import { ProvenanceLine } from "@/components/product/ProvenanceLine";
import type { Product } from "@/data/products";
import { useProducts } from "@/lib/context/ProductsContext";
import type { CategoryKey } from "@/components/product/CategoryFilter";

export interface ProductModalProps {
  slug: string | null;
  category: CategoryKey;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

const EXIT_DURATION_MS = 250;

export function ProductModal({ slug, category, onClose, onNavigate }: ProductModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const { getBySlug, getByCategory } = useProducts();
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  const product = slug ? getBySlug(slug) : undefined;

  // Kept mounted for EXIT_DURATION_MS after `product` goes away so the exit
  // transition can finish before the node leaves the DOM. Framer Motion's
  // AnimatePresence proved unreliable to unmount in this stack (exit
  // animation completes but the node is never removed), so this is managed
  // by hand instead.
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const unmountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The product actually rendered — stays on the last open product through
  // the closing transition, since `product` itself goes null immediately.
  const lastProductRef = useRef<Product | undefined>(undefined);
  if (product) lastProductRef.current = product;
  const displayProduct = product ?? lastProductRef.current;

  const list = getByCategory(category);
  const displayIndex = displayProduct
    ? list.findIndex((item) => item.slug === displayProduct.slug)
    : -1;
  const prevProduct =
    displayIndex > -1 ? list[(displayIndex - 1 + list.length) % list.length] : undefined;
  const nextProduct = displayIndex > -1 ? list[(displayIndex + 1) % list.length] : undefined;

  useEffect(() => {
    if (product) {
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
  }, [product]);

  useEffect(
    () => () => {
      if (unmountTimeoutRef.current) clearTimeout(unmountTimeoutRef.current);
    },
    [],
  );

  const isFirstUrlSync = useRef(true);
  useEffect(() => {
    // Skip the mount run: the URL is already correct as loaded (it's the
    // thing Catalogue reads to decide whether to open this modal at all),
    // and writing here first would race that read and clear it.
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }
    const url = new URL(window.location.href);
    if (product) {
      url.searchParams.set("product", product.slug);
    } else {
      url.searchParams.delete("product");
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }, [product]);

  useEffect(() => {
    if (!product) return;

    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowRight" && nextProduct) {
        onNavigate(nextProduct.slug);
        return;
      }
      if (event.key === "ArrowLeft" && prevProduct) {
        onNavigate(prevProduct.slug);
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
  }, [product, onClose, onNavigate, nextProduct, prevProduct]);

  if (!isMounted || !displayProduct) return null;

  const dialogHidden = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.97 };
  const dialogShown = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6">
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        initial={false}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: EXIT_DURATION_MS / 1000 }}
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="relative flex h-[92svh] w-full max-w-[1100px] flex-col overflow-hidden bg-surface-raised md:h-auto md:max-h-[88svh] md:flex-row md:rounded-photo"
        initial={dialogHidden}
        animate={isVisible ? dialogShown : dialogHidden}
        transition={{ duration: EXIT_DURATION_MS / 1000 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          data-autofocus
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface-raised/90 text-ink shadow-[0_1px_8px_color-mix(in_srgb,var(--color-brand-deep)_14%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:right-6 md:top-6"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        {prevProduct && (
          <button
            type="button"
            onClick={() => onNavigate(prevProduct.slug)}
            aria-label={`Previous product — ${prevProduct.name}`}
            className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface-raised/90 text-ink shadow-[0_1px_8px_color-mix(in_srgb,var(--color-brand-deep)_14%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:flex"
          >
            ←
          </button>
        )}
        {nextProduct && (
          <button
            type="button"
            onClick={() => onNavigate(nextProduct.slug)}
            aria-label={`Next product — ${nextProduct.name}`}
            className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface-raised/90 text-ink shadow-[0_1px_8px_color-mix(in_srgb,var(--color-brand-deep)_14%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:right-20 md:flex"
          >
            →
          </button>
        )}

        <div className="overflow-y-auto p-4 md:w-1/2 md:overflow-y-visible md:p-6">
          <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-photo">
            {displayProduct.images[0] && (
              <Image
                src={displayProduct.images[0].src}
                alt={displayProduct.images[0].alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
          {displayProduct.images.length > 1 && (
            <div className="flex gap-2 p-4">
              {displayProduct.images.map((image) => (
                <div key={image.src} className="relative h-16 w-16 shrink-0 overflow-hidden">
                  <Image src={image.src} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-y-auto p-6 md:w-1/2 md:p-10">
          <h2 id="product-modal-title" className="font-display text-h3 text-ink">
            {displayProduct.name}
          </h2>
          <p className="mt-2 flex flex-wrap items-center gap-2 font-mono text-small tracking-mono-label text-ink-muted">
            <span>
              {displayProduct.origin}
              {displayProduct.botanical ? ` · ${displayProduct.botanical}` : ""}
            </span>
            {displayProduct.hasGI && <Chip variant="accent">GI</Chip>}
          </p>

          <p className="mt-6 text-lead text-ink">{displayProduct.heroLine}</p>
          <p className="mt-4 text-body text-ink-muted">{displayProduct.description}</p>

          <div className="mt-8">
            <ProductSpecTable specs={displayProduct.specs} />
          </div>

          {displayProduct.forms.length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                Forms available
              </p>
              <p className="mt-2 text-body text-ink">{displayProduct.forms.join(" · ")}</p>
            </div>
          )}

          {displayProduct.packaging.length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                Packaging
              </p>
              <p className="mt-2 text-body text-ink">{displayProduct.packaging.join(" · ")}</p>
            </div>
          )}

          <div className="mt-10">
            <ProvenanceLine nodes={displayProduct.provenance} size="inline" className="text-ink" />
          </div>

          <div className="mt-10 border-t border-rule pt-8">
            {/* key resets the form (and its locked product) when the
                user navigates to a different product via prev/next —
                otherwise react-hook-form's defaultValues would stick to
                whichever product first mounted the component. */}
            <EnquiryForm
              key={displayProduct.slug}
              variant="compact"
              lockedProduct={displayProduct.slug}
              sourceSection="modal"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
