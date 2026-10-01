"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { matchesSearch, useSearch } from "@/components/search-context";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SPACES } from "@/data/spaces";
import { formatDate, formatPeople, inCity } from "@/lib/format";
import type { Space } from "@/types";
import { SpaceCard } from "./space-card";

// O modal é o único usuário do Framer Motion: fica fora do JS inicial da página
// e é baixado quando o navegador está ocioso, antes do primeiro clique.
const loadBookingModal = () => import("./booking-modal").then((mod) => mod.BookingModal);
const BookingModal = dynamic(loadBookingModal, { ssr: false });

const whenIdle = (task: () => void): (() => void) => {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task);
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(task, 1500); // Safari sem requestIdleCallback
  return () => window.clearTimeout(id);
};

export function FeaturedSpaces() {
  const { filters, setFilters } = useSearch();
  // O espaço selecionado permanece montado durante a animação de saída do modal.
  const [selected, setSelected] = useState<Space | null>(null);
  const [open, setOpen] = useState(false);
  const visible = filters ? SPACES.filter((space) => matchesSearch(space, filters)) : SPACES;

  const handleBook = useCallback((space: Space) => {
    setSelected(space);
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => whenIdle(() => void loadBookingModal()), []);

  return (
    <section id="espacos" aria-labelledby="espacos-title" className="scroll-mt-16 pt-12 pb-16 sm:pt-16 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="espacos-title"
          title="Escolhidos a dedo para o seu próximo encontro"
          description="Todo espaço é verificado: fotos, internet e comodidades conferidas pessoalmente antes de entrar na plataforma."
        />

        <div aria-live="polite" className="mt-10 min-h-11">
          {filters && visible.length > 0 && (
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span>
                Mostrando <span className="font-medium text-ink">{visible.length}</span> de {SPACES.length} ·{" "}
                {filters.location || "Todas as cidades"} · {formatPeople(filters.people)}
                {filters.date && ` · ${formatDate(filters.date)}`}
              </span>
              <button
                type="button"
                onClick={() => setFilters(null)}
                className="inline-flex min-h-11 items-center font-medium text-accent underline-offset-4 hover:underline"
              >
                Limpar filtros
              </button>
            </p>
          )}
        </div>

        {filters && visible.length === 0 ? (
          <div className="mt-2 rounded-3xl border border-dashed border-line px-6 py-14 text-center">
            <p className="text-lg font-semibold tracking-tight">Nenhum espaço com esses filtros</p>
            <p className="mx-auto mt-2 max-w-md text-muted text-pretty">
              Nenhum espaço comporta {formatPeople(filters.people)}{" "}
              {filters.location ? inCity(filters.location) : "nas cidades atendidas"}. Tente outra cidade ou um grupo
              menor.
            </p>
            <Button variant="secondary" onClick={() => setFilters(null)} className="mt-6">
              Ver todos os espaços
            </Button>
          </div>
        ) : (
          <div className="mt-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((space) => (
              <SpaceCard key={space.id} space={space} onBook={handleBook} />
            ))}
          </div>
        )}
      </div>
      {selected && (
        <BookingModal space={selected} open={open} onClose={handleClose} initialDate={filters?.date} />
      )}
    </section>
  );
}
