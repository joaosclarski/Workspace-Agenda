import { BookingPass } from "./booking-pass";
import { SearchBar } from "./search-bar";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_30%_0%,var(--color-accent-soft),transparent)]"
      />
      {/* Mobile: texto → busca → passe (a busca fica perto do topo). Desktop: texto e passe lado a lado, busca embaixo. */}
      <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-4 pt-14 pb-4 sm:px-6 sm:pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:pt-24">
        <div className="lg:col-start-1 lg:row-start-1">
          <h1
            id="hero-title"
            className="text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl"
          >
            O espaço certo para trabalhar, na hora que você precisa.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted text-pretty sm:text-xl">
            Salas de reunião e co-working por hora, sem mensalidade nem contrato. Reserve em segundos e faça o
            check-in com um QR Code.
          </p>
        </div>

        <div className="lg:col-span-2 lg:row-start-2">
          <SearchBar />
        </div>

        <BookingPass className="lg:col-start-2 lg:row-start-1 lg:rotate-2" />
      </div>
    </section>
  );
}
