import { BadgeCheck, MapPin, Star, Users } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AMENITIES } from "@/data/amenities";
import { formatPeople, formatPrice } from "@/lib/format";
import type { Space } from "@/types";

interface SpaceCardProps {
  space: Space;
  onBook: (space: Space) => void;
}

export function SpaceCard({ space, onBook }: SpaceCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_12px_40px_rgb(0_0_0/0.08)] motion-safe:hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={space.image}
          alt={space.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium backdrop-blur">
          {space.kind}
        </span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium text-accent backdrop-blur">
          <BadgeCheck className="size-3.5" aria-hidden />
          Verificado
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-lg font-semibold tracking-tight break-words">{space.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium tabular-nums">
            <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
            <span className="sr-only">Avaliação</span>
            {space.rating.toLocaleString("pt-BR")}
            <span className="font-normal text-muted">
              ({space.reviews}
              <span className="sr-only"> avaliações</span>)
            </span>
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1">
            <MapPin className="size-4" aria-hidden />
            {space.neighborhood}, {space.city}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-4" aria-hidden />
            {space.capacity === 1 ? "1 pessoa" : `Até ${formatPeople(space.capacity)}`}
          </span>
        </div>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Comodidades">
          {space.amenities.map((key) => {
            const { label, icon: Icon } = AMENITIES[key];
            return (
              <li
                key={key}
                className="flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
              >
                <Icon className="size-3.5" aria-hidden />
                {label}
              </li>
            );
          })}
        </ul>

        {/* Se botão e preço não cabem lado a lado, o botão desce e ocupa a largura toda. */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
          <p className="whitespace-nowrap">
            <span className="text-2xl font-semibold tracking-tight">{formatPrice(space.pricePerHour)}</span>
            <span className="text-sm text-muted"> /hora</span>
          </p>
          <Button
            onClick={() => onBook(space)}
            aria-label={`Reservar agora: ${space.name}`}
            className="grow whitespace-nowrap"
          >
            Reservar agora
          </Button>
        </div>
      </div>
    </article>
  );
}
