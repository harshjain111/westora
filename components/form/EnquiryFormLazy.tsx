"use client";

import dynamic from "next/dynamic";
import type { EnquiryFormProps } from "@/components/form/EnquiryForm";

// react-hook-form + the Zod resolver + the 249-entry country list are the
// single biggest contributor to First Load JS (PRD §11 / CLAUDE.md §14
// target: <150KB gzipped) — EnquiryForm renders below the fold on every
// page that has one, or inside a modal that starts closed, so there's no
// reason to ship it in the initial bundle. This code-splits it into its
// own chunk, loaded when the section/modal actually mounts.
export const EnquiryFormLazy = dynamic<EnquiryFormProps>(
  () => import("@/components/form/EnquiryForm").then((mod) => mod.EnquiryForm),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="h-[900px] w-full animate-pulse rounded-input border border-rule bg-surface-raised"
      />
    ),
  },
);
