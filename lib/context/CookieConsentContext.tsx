"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ConsentChoice = "allowed" | "denied";

const STORAGE_KEY = "westora-cookie-consent";

export interface CookieConsentContextValue {
  /** null = not yet answered (or not yet read from storage) — anything
   * that gates on consent MUST treat null the same as "denied" (fail
   * closed), never as implicit permission. Only an explicit "allowed"
   * should ever enable tracking. */
  consent: ConsentChoice | null;
  /** False for one tick while localStorage hasn't been read yet — the
   * banner uses this (not just `consent === null`) so a returning user
   * who already answered doesn't see it flash before the stored choice
   * loads. */
  hasCheckedStorage: boolean;
  setConsent: (choice: ConsentChoice) => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  // Starts null on both server and first client render so hydration
  // matches; the real stored value (if any) is read once after mount.
  const [consent, setConsentState] = useState<ConsentChoice | null>(null);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "allowed" || stored === "denied") setConsentState(stored);
    setHasCheckedStorage(true);
  }, []);

  const setConsent = (choice: ConsentChoice) => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setConsentState(choice);
  };

  return (
    <CookieConsentContext.Provider value={{ consent, hasCheckedStorage, setConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return ctx;
}
