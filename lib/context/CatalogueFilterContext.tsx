"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface CatalogueFilterContextValue {
  /** Product `origin` value to additionally filter the catalogue by, or
   * null for no state filter. Set by OriginMap, read by Catalogue. */
  stateFilter: string | null;
  setStateFilter: (state: string | null) => void;
}

const CatalogueFilterContext = createContext<CatalogueFilterContextValue | null>(null);

export function CatalogueFilterProvider({ children }: { children: ReactNode }) {
  const [stateFilter, setStateFilter] = useState<string | null>(null);
  const value = useMemo(() => ({ stateFilter, setStateFilter }), [stateFilter]);

  return (
    <CatalogueFilterContext.Provider value={value}>{children}</CatalogueFilterContext.Provider>
  );
}

export function useCatalogueFilter(): CatalogueFilterContextValue {
  const ctx = useContext(CatalogueFilterContext);
  if (!ctx) {
    throw new Error("useCatalogueFilter must be used within a CatalogueFilterProvider");
  }
  return ctx;
}
