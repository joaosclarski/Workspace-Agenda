"use client";

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { CalendarPlus, CheckCircle2, Loader2, MapPin, QrCode } from "lucide-react";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { OPENING_HOURS } from "@/data/spaces";
import { cn, formatDate, formatHour, formatHours, formatPrice } from "@/lib/format";
import { useToday } from "@/lib/use-today";
import type { Space } from "@/types";

interface BookingModalProps {
  space: Space;
  open: boolean;
  onClose: () => void;
  /** Data escolhida na busca do hero, se houver. */
  initialDate?: string;
}

// Quatro durações cobrem os usos comuns sem virar uma lista longa de opções.
const DURATIONS = [1, 2, 4, 8];
const PREFERRED_START = 9;

type Phase = { kind: "form" } | { kind: "submitting" } | { kind: "confirmed"; code: string; ics: string };

// 16px no mobile: o iOS Safari dá zoom ao focar campos menores que isso.
const fieldClass =
  "mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-base outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25 sm:text-sm";

// Desaceleração natural (expo-out) para chegadas; sem molas com rebote.
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// Ref de identidade estável: move o foco para o elemento assim que ele é montado.
const focusOnMount = (el: HTMLElement | null) => el?.focus();

const range = (from: number, to: number): number[] =>
  Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);

const icsTime = (date: string, hour: number) => `${date.replaceAll("-", "")}T${String(hour).padStart(2, "0")}0000`;
const icsText = (text: string) => text.replace(/([,;\\])/g, "\\$1");

/** Arquivo .ics com horário local "flutuante": abre no fuso de quem importa. */
function buildIcs(space: Space, date: string, start: number, hours: number, code: string): string {
  const stamp = `${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Zenith Workspace//Prototipo//PT-BR",
    "BEGIN:VEVENT",
    `UID:${code}@zenith-workspace.example`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${icsTime(date, start)}`,
    `DTEND:${icsTime(date, start + hours)}`,
    `SUMMARY:${icsText(`Reserva Zenith: ${space.name}`)}`,
    `LOCATION:${icsText(`${space.neighborhood}, ${space.city}`)}`,
    `DESCRIPTION:${icsText(`Código ${code}. Check-in por QR Code na recepção.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function BookingModal({ space, open, onClose, initialDate }: BookingModalProps) {
  return (
    // Com `prefers-reduced-motion`, o Framer Motion deixa de animar deslocamento e escala,
    // mas mantém os fades: a mudança de estado continua visível.
    <MotionConfig reducedMotion="user">
      <Modal open={open} onClose={onClose}>
        {(titleId) => (
          // `key` reinicia o formulário a cada novo espaço ou nova data vinda da busca.
          <BookingContent
            key={`${space.id}-${initialDate ?? ""}`}
            space={space}
            initialDate={initialDate}
            titleId={titleId}
            onClose={onClose}
          />
        )}
      </Modal>
    </MotionConfig>
  );
}

interface BookingContentProps {
  space: Space;
  initialDate?: string;
  titleId: string;
  onClose: () => void;
}

function BookingContent({ space, initialDate, titleId, onClose }: BookingContentProps) {
  const today = useToday();
  // Lido uma vez ao abrir: horários que já passaram hoje ficam indisponíveis.
  const [nowHour] = useState(() => new Date().getHours());
  const [pickedDate, setPickedDate] = useState(initialDate ?? "");
  const [pickedStart, setPickedStart] = useState<number | null>(null);
  const [pickedHours, setPickedHours] = useState(2);
  const [phase, setPhase] = useState<Phase>({ kind: "form" });

  // Tudo abaixo é derivado: trocar a data ou o início nunca deixa uma combinação inválida selecionada.
  const date = pickedDate || (today ?? "");
  const earliest = date === today ? Math.max(OPENING_HOURS.open, nowHour + 1) : OPENING_HOURS.open;
  const startOptions = range(earliest, OPENING_HOURS.close - 1);
  const start =
    pickedStart !== null && startOptions.includes(pickedStart)
      ? pickedStart
      : (startOptions.find((h) => h >= PREFERRED_START) ?? startOptions[0]);
  const maxHours = start === undefined ? 0 : OPENING_HOURS.close - start;
  const hours = DURATIONS.filter((d) => d <= maxHours && d <= pickedHours).at(-1) ?? 1;
  const end = start === undefined ? undefined : start + hours;
  const total = space.pricePerHour * hours;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (start === undefined) return;
    setPhase({ kind: "submitting" });
    // Confirmação simulada: em produção, aqui entraria a chamada à API de reservas.
    window.setTimeout(() => {
      const code = `ZW-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      setPhase({ kind: "confirmed", code, ics: buildIcs(space, date, start, hours, code) });
    }, 900);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {phase.kind !== "confirmed" ? (
        <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center gap-4 pr-10">
            <Image
              src={space.image}
              alt=""
              width={128}
              height={128}
              sizes="64px"
              className="size-16 shrink-0 rounded-xl bg-stone-100 object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm text-muted">{space.kind}</p>
              <h2 id={titleId} className="text-xl font-semibold tracking-tight break-words">
                {space.name}
              </h2>
              <p className="text-sm text-muted">
                {space.neighborhood}, {space.city} · {formatPrice(space.pricePerHour)}/hora
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="text-sm font-medium">
              Data
              <input
                type="date"
                required
                min={today}
                value={date}
                onChange={(e) => setPickedDate(e.target.value)}
                className={fieldClass}
              />
            </label>

            {start === undefined ? (
              <p role="alert" className="rounded-xl bg-stone-50 p-3 text-sm text-muted">
                Não há mais horários hoje: o funcionamento é das {OPENING_HOURS.open}h às {OPENING_HOURS.close}h.
                Escolha outra data.
              </p>
            ) : (
              <>
                <label className="text-sm font-medium">
                  Início
                  <select value={start} onChange={(e) => setPickedStart(Number(e.target.value))} className={fieldClass}>
                    {startOptions.map((h) => (
                      <option key={h} value={h}>
                        {formatHour(h)}
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-xs font-normal text-muted">
                    Funcionamento: {OPENING_HOURS.open}h às {OPENING_HOURS.close}h
                  </span>
                </label>

                <fieldset>
                  <legend className="text-sm font-medium">Duração</legend>
                  <div className="mt-1 grid grid-cols-4 gap-2">
                    {DURATIONS.map((d) => (
                      <label
                        key={d}
                        className={cn(
                          "flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-line text-sm font-medium transition-colors",
                          "hover:border-stone-300 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white",
                          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2",
                          "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40 has-[:disabled]:hover:border-line",
                        )}
                      >
                        <input
                          type="radio"
                          name="duracao"
                          value={d}
                          checked={hours === d}
                          disabled={d > maxHours}
                          onChange={() => setPickedHours(d)}
                          className="sr-only"
                        />
                        {d} h
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            )}
          </div>

          {start !== undefined && end !== undefined && (
            <dl className="mt-6 space-y-2 rounded-2xl bg-stone-50 p-4 text-sm tabular-nums">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Horário</dt>
                <dd className="font-medium">
                  {formatHour(start)} – {formatHour(end)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-muted">
                <dt>
                  {formatPrice(space.pricePerHour)} × {formatHours(hours)}
                </dt>
                <dd>{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-muted">
                <dt>Taxa de serviço</dt>
                <dd>Grátis</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
          )}

          <Button type="submit" disabled={start === undefined || phase.kind === "submitting"} className="mt-6 w-full">
            {phase.kind === "submitting" && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {phase.kind === "submitting" ? "Confirmando reserva…" : "Confirmar reserva"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted">Cancelamento grátis até 24 h antes do início.</p>
        </motion.form>
      ) : (
        <motion.div
          key="confirmed"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: 0.05 }}
            className="mx-auto grid size-14 place-items-center rounded-full bg-accent-soft text-accent"
          >
            <CheckCircle2 className="size-7" aria-hidden />
          </motion.div>
          {/* O botão "Confirmar" desmontou; o foco vai para o título para o leitor de tela não se perder. */}
          <h2
            id={titleId}
            ref={focusOnMount}
            tabIndex={-1}
            className="mt-4 text-xl font-semibold tracking-tight outline-none"
          >
            Reserva confirmada!
          </h2>
          {start !== undefined && end !== undefined && (
            <p className="mt-2 text-sm font-medium tabular-nums">
              {space.name} · {formatDate(date)}, {formatHour(start)} – {formatHour(end)}
            </p>
          )}
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted">
            <MapPin className="size-4" aria-hidden />
            {space.neighborhood}, {space.city}
          </p>

          <div className="mx-auto mt-6 flex w-fit flex-col items-center gap-2 rounded-2xl border border-dashed border-line p-5">
            <QrReveal />
            <span className="text-xs text-muted">Código da reserva</span>
            <span className="font-mono text-sm font-medium tracking-widest">{phase.code}</span>
          </div>
          <p className="mt-4 text-sm text-muted text-pretty">
            QR Code de exemplo. No produto final, ele chegaria por e-mail para ser mostrado na recepção.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-[auto_1fr]">
            <a
              href={`data:text/calendar;charset=utf-8,${encodeURIComponent(phase.ics)}`}
              download={`reserva-${phase.code}.ics`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-stone-300 hover:bg-stone-50"
            >
              <CalendarPlus className="size-4" aria-hidden />
              Adicionar ao calendário
            </a>
            <Button onClick={onClose}>Concluir</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Momento focal da página: o QR Code do check-in "é impresso" de cima para baixo,
 * acompanhado por uma linha de leitura. Com `prefers-reduced-motion`, só aparece com fade.
 */
function QrReveal() {
  const reduceMotion = useReducedMotion();
  const timing = { duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.25 };

  if (reduceMotion) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.1 }}>
        <QrCode className="size-24 text-ink" strokeWidth={1.25} aria-hidden />
      </motion.div>
    );
  }

  return (
    <div className="relative size-24">
      <motion.div
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={timing}
      >
        <QrCode className="size-24 text-ink" strokeWidth={1.25} aria-hidden />
      </motion.div>
      {/* A linha usa a mesma curva do recorte, então acompanha a borda que está sendo revelada. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-x-2 top-0 h-0.5 rounded-full bg-accent"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 96, opacity: 0 }}
        transition={{ y: timing, opacity: { duration: 0.2, delay: timing.delay + timing.duration } }}
      />
    </div>
  );
}
