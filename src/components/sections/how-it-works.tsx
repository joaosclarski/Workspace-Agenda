import { CheckCircle2, MapPin, QrCode, Search, Users } from "lucide-react";
import type { ReactNode } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { STEPS } from "@/data/content";
import { SPACES } from "@/data/spaces";
import { formatPrice } from "@/lib/format";

// Cada passo mostra o artefato real daquele momento (busca, preço, passe), não um ícone genérico.
const example = SPACES.find((s) => s.id === "faria-lima-focus") ?? SPACES[0];

const ARTIFACTS: ReactNode[] = [
  <div key="busca" className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-1.5 pl-3 text-sm">
    <MapPin className="size-4 text-muted" aria-hidden />
    <span className="font-medium">São Paulo</span>
    <span className="text-line">|</span>
    <Users className="size-4 text-muted" aria-hidden />
    <span className="font-medium">4 pessoas</span>
    <span className="ml-auto grid size-8 place-items-center rounded-xl bg-ink text-white">
      <Search className="size-4" />
    </span>
  </div>,
  <div key="preco" className="rounded-2xl border border-line bg-surface p-3 text-sm tabular-nums">
    <div className="flex justify-between text-muted">
      <span>2 h × {example && formatPrice(example.pricePerHour)}</span>
      <span>{example && formatPrice(example.pricePerHour * 2)}</span>
    </div>
    <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
      <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
        <CheckCircle2 className="size-3.5" />
        Confirmada
      </span>
      <span className="font-semibold">{example && formatPrice(example.pricePerHour * 2)}</span>
    </div>
  </div>,
  <div key="passe" className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
    <QrCode className="size-12 shrink-0" strokeWidth={1.25} />
    <div className="text-sm">
      <p className="font-medium">Check-in</p>
      <p className="font-mono text-xs tracking-widest text-muted">ZW-4K7Q2</p>
    </div>
  </div>,
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-title"
      className="scroll-mt-16 border-y border-line bg-surface py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="como-funciona-title" title="Do clique à sala pronta em três passos" />
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map(({ title, description }, index) => (
            <li key={title} className="flex flex-col">
              {/* Ilustração: o texto do passo já descreve o mesmo conteúdo. */}
              <div aria-hidden className="flex h-36 items-center rounded-3xl bg-canvas px-5">
                <div className="w-full">{ARTIFACTS[index]}</div>
              </div>
              <h3 className="mt-6 flex items-baseline gap-3 text-lg font-semibold tracking-tight">
                <span className="text-sm font-medium text-muted tabular-nums">{index + 1}</span>
                {title}
              </h3>
              <p className="mt-2 text-muted text-pretty">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
