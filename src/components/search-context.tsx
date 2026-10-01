"use client";

import { createContext, use, useState, type ReactNode } from "react";
import type { SearchQuery, Space } from "@/types";

interface SearchState {
  /** Filtros da última busca; `null` mostra todos os espaços. */
  filters: SearchQuery | null;
  setFilters: (filters: SearchQuery | null) => void;
}

const SearchContext = createContext<SearchState | null>(null);

/** Liga a busca do hero à grade de espaços e ao modal de reserva. */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SearchQuery | null>(null);
  return <SearchContext value={{ filters, setFilters }}>{children}</SearchContext>;
}

export function useSearch(): SearchState {
  const context = use(SearchContext);
  if (!context) throw new Error("useSearch precisa estar dentro de <SearchProvider>");
  return context;
}

export const matchesSearch = (space: Space, filters: SearchQuery): boolean =>
  (!filters.location || space.city === filters.location) && space.capacity >= filters.people;
