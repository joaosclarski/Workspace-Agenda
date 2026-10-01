import { CITIES } from "@/data/spaces";

const LINKS = [
  { href: "#busca", label: "Buscar espaço" },
  { href: "#espacos", label: "Espaços" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#depoimentos", label: "Depoimentos" },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-semibold tracking-tight">Zenith Workspace</p>
          <p className="mt-2 max-w-sm text-sm text-muted text-pretty">
            Salas de reunião e co-working por hora, com check-in por QR Code.
          </p>
          <p className="mt-4 max-w-sm text-xs text-muted text-pretty">
            Protótipo: espaços, preços, avaliações e depoimentos são ilustrativos.
          </p>
        </div>
        <nav aria-label="Rodapé">
          <p className="text-sm font-medium">Navegação</p>
          <ul className="mt-2 text-sm text-muted">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-flex min-h-11 items-center transition-colors hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-medium">Cidades</p>
          <ul className="mt-2 text-sm text-muted">
            {CITIES.map((city) => (
              <li key={city} className="flex min-h-11 items-center">
                {city}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted sm:px-6">
          © {new Date().getFullYear()} Zenith Workspace.
        </p>
      </div>
    </footer>
  );
}
