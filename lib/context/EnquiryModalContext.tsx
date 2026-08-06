"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export interface EnquiryModalContextValue {
  isOpen: boolean;
  /** Optional product slug to lock the form to, when opened from a
   * product-specific trigger rather than a generic "Request a quote". */
  lockedProduct: string | undefined;
  open: (lockedProduct?: string) => void;
  close: () => void;
}

const EnquiryModalContext = createContext<EnquiryModalContextValue | null>(null);

export function EnquiryModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lockedProduct, setLockedProduct] = useState<string | undefined>(undefined);

  const open = useCallback((slug?: string) => {
    setLockedProduct(slug);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, lockedProduct, open, close }),
    [isOpen, lockedProduct, open, close],
  );

  return <EnquiryModalContext.Provider value={value}>{children}</EnquiryModalContext.Provider>;
}

export function useEnquiryModal(): EnquiryModalContextValue {
  const ctx = useContext(EnquiryModalContext);
  if (!ctx) {
    throw new Error("useEnquiryModal must be used within an EnquiryModalProvider");
  }
  return ctx;
}
