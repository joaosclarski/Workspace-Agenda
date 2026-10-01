"use client";

import { CalendarDays, Loader2, MapPin, Search, Users } from "lucide-react";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { matchesSearch, useSearch } from "@/components/search-context";
import { Button } from "@/components/ui/button";
import { CITIES, SPACES } from "@/data/spaces";
import { formatDate, formatPeople, inCity } from "@/lib/format";
import { useToday } from "@/lib/use-today";
import type { SearchQuery } from "@/types";

const PEOPLE_OPTIONS = [1, 2, 4, 6, 8, 10];

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-3 transition-[background-color,box-shadow] hover:bg-stone-50 has-[:focus-visible]:bg-stone-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent">
      <span className="text-muted" aria-hidden>
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-medium text-muted">{label}</span>
        {children}
      </span>
    </label>
  );
}

// 16px no mobile: o iOS Safari dá zoom ao focar campos menores que isso.
const inputClass = "w-full bg-transparent text-base font-medium text-ink outline-none sm:text-sm";

export function SearchBar() {
  const { filters, setFilters } = useSearch();
  // Enquanto o visitante não escolhe uma data, o campo mostra a data de hoje.
  const [draft, setDraft] = useState<SearchQuery>({ location: "", date: "", people: 2 });
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const today = useToday();
  const query: SearchQuery = { ...draft, date: draft.date || (today ?? "") };
  const count = filters ? SPACES.filter((space) => matchesSearch(space, filters)).length : 0;

  const update = <K extends keyof SearchQuery>(key: K, value: SearchQuery[K]) =>
    setDraft((q) => ({ ...q, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    // Busca simulada: filtra os dados locais após um pequeno atraso.
    window.setTimeout(() => {
      setFilters(query);
      setLoading(false);
      // No celular o resultado nasce abaixo da dobra; rola só o necessário para mostrá-lo.
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
    }, 700);
  };

  return (
    <div>
      <form
        id="busca"
        onSubmit={handleSubmit}
        role="search"
        aria-label="Buscar espaços"
        className="scroll-mt-24 flex flex-col gap-1 rounded-3xl border border-line bg-surface p-2 shadow-[0_8px_30px_rgb(0_0_0/0.06)] md:flex-row md:items-center"
      >
        <Field label="Localização" icon={<MapPin className="size-5" />}>
          <select
            value={query.location}
            onChange={(e) => update("location", e.target.value)}
            className={`${inputClass} cursor-pointer appearance-none`}
          >
            <option value="">Todas as cidades</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </Field>
        <div className="hidden h-10 w-px bg-line md:block" aria-hidden />
        <Field label="Data" icon={<CalendarDays className="size-5" />}>
          <input
            type="date"
            required
            min={today}
            value={query.date}
            onChange={(e) => update("date", e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="hidden h-10 w-px bg-line md:block" aria-hidden />
        <Field label="Pessoas" icon={<Users className="size-5" />}>
          <select
            value={query.people}
            onChange={(e) => update("people", Number(e.target.value))}
            className={`${inputClass} cursor-pointer appearance-none`}
          >
            {PEOPLE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {formatPeople(n)}
              </option>
            ))}
          </select>
        </Field>
        <Button type="submit" disabled={loading} className="h-14 rounded-2xl px-7 md:h-16">
          {loading ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Search className="size-5" aria-hidden />}
          Buscar
        </Button>
      </form>

      <div ref={resultRef} aria-live="polite" className="min-h-12 scroll-mb-4 pt-4 text-sm">
        {filters && (
          // `key` reinicia a animação de entrada a cada nova busca.
          <p key={JSON.stringify(filters)} className="animate-result-in text-muted">
            {count > 0 ? (
              <>
                <span className="font-medium text-ink">
                  {count === 1 ? "1 espaço" : `${count} espaços`} para {formatPeople(filters.people)}
                </span>{" "}
                {filters.location ? inCity(filters.location) : "em qualquer cidade"}
                {filters.date && `, em ${formatDate(filters.date)}`}.{" "}
                <a href="#espacos" className="font-medium text-accent underline-offset-4 hover:underline">
                  Ver resultados
                </a>
              </>
            ) : (
              <>
                Nenhum espaço comporta {formatPeople(filters.people)}{" "}
                {filters.location ? inCity(filters.location) : "nas cidades atendidas"}.{" "}
                <button
                  type="button"
                  onClick={() => setFilters(null)}
                  className="font-medium text-accent underline-offset-4 hover:underline"
                >
                  Ver todos os espaços
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
