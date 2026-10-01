import { BadgeCheck, CalendarDays, QrCode } from "lucide-react";
import { SPACES } from "@/data/spaces";
import { formatHour, formatPrice } from "@/lib/format";

// Exemplo fixo, montado com um espaço real dos dados para os números baterem com a grade.
const EXAMPLE = { spaceId: "faria-lima-focus", start: 14, hours: 2, code: "ZW-4K7Q2" } as const;

/**
 * Artefato do produto no hero: o "passe" que o visitante recebe ao reservar.
 * Torna concretos os três diferenciais: preço por hora, confirmação na hora e check-in por QR Code.
 */
export function BookingPass({ className = "" }: { className?: string }) {
  const space = SPACES.find((s) => s.id === EXAMPLE.spaceId);
  if (!space) return null;
  const total = space.pricePerHour * EXAMPLE.hours;

  return (
    <figure
      aria-label="Exemplo de passe de reserva"
      className={`relative mx-auto w-full max-w-sm rounded-3xl border border-line bg-surface shadow-[0_24px_60px_-20px_rgb(28_25_23/0.25)] ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <figcaption className="text-xs font-medium text-muted">Exemplo de reserva</figcaption>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
            <BadgeCheck className="size-3.5" aria-hidden />
            Confirmada na hora
          </span>
        </div>

        <p className="mt-5 text-xl font-semibold tracking-tight">{space.name}</p>
        <p className="text-sm text-muted">
          {space.neighborhood}, {space.city}
        </p>

        <p className="mt-5 flex items-center gap-2 text-sm font-medium">
          <CalendarDays className="size-4 text-muted" aria-hidden />
          Hoje, {formatHour(EXAMPLE.start)} – {formatHour(EXAMPLE.start + EXAMPLE.hours)}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4 rounded-2xl bg-canvas px-4 py-3">
          <span className="text-sm text-muted tabular-nums">
            {EXAMPLE.hours} h × {formatPrice(space.pricePerHour)}
          </span>
          <span className="text-2xl font-semibold tracking-tight tabular-nums">{formatPrice(total)}</span>
        </div>
        <p className="mt-2 text-xs text-muted">Sem mensalidade: você paga só essas duas horas.</p>
      </div>

      {/* Picote do canhoto: linha tracejada com recortes nas bordas, como um ingresso. */}
      <div aria-hidden className="relative h-px border-t border-dashed border-line">
        <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full border border-line bg-canvas [clip-path:inset(0_0_0_50%)]" />
        <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full border border-line bg-canvas [clip-path:inset(0_50%_0_0)]" />
      </div>

      <div className="flex items-center gap-4 p-6">
        <QrCode className="size-16 shrink-0 text-ink" strokeWidth={1.25} aria-hidden />
        <div>
          <p className="text-sm font-medium">Check-in na recepção</p>
          <p className="text-sm text-muted">Mostre o QR Code e entre.</p>
          <p className="mt-1 font-mono text-xs tracking-widest text-muted">{EXAMPLE.code}</p>
        </div>
      </div>
    </figure>
  );
}
