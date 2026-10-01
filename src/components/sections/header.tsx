import { MobileMenu } from "./mobile-menu";

const NAV = [
  { href: "#espacos", label: "Espaços" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#depoimentos", label: "Depoimentos" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <a href="#" className="flex h-11 items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-ink text-xs font-bold text-white" aria-hidden>
            Z
          </span>
          Zenith Workspace
        </a>
        <nav aria-label="Principal" className="hidden gap-8 text-sm text-muted md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="py-3 transition-colors hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          {/* Leva à busca do hero. Abaixo de 380px não cabe ao lado da marca; "Espaços" fica no menu. */}
          <a
            href="#busca"
            className="hidden h-11 items-center rounded-xl bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-stone-800 min-[380px]:inline-flex"
          >
            Buscar
          </a>
          <MobileMenu links={NAV} />
        </div>
      </div>
    </header>
  );
}
