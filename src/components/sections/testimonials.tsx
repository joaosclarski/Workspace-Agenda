import { SectionHeading } from "@/components/ui/section-heading";
import { StarRating } from "@/components/ui/star-rating";
import { TESTIMONIALS } from "@/data/content";

const AVATAR_COLORS = ["bg-teal-100 text-teal-800", "bg-amber-100 text-amber-800", "bg-sky-100 text-sky-800"];

const initials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export function Testimonials() {
  return (
    <section id="depoimentos" aria-labelledby="depoimentos-title" className="scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="depoimentos-title"
          title="Quem trabalha com a Zenith recomenda"
        />
        <p className="mt-3 text-sm text-muted">Depoimentos ilustrativos: a Zenith ainda é um protótipo.</p>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <li key={t.name}>
              <figure className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6">
                <StarRating value={t.rating} />
                <blockquote className="mt-4 flex-1 text-pretty">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`grid size-11 shrink-0 place-items-center rounded-full text-sm font-semibold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                  >
                    {initials(t.name)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-sm text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
