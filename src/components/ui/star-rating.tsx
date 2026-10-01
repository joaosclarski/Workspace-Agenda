import { Star } from "lucide-react";
import { cn } from "@/lib/format";

export function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Avaliação: ${value} de ${max} estrelas`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn("size-4", i < value ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200")}
        />
      ))}
    </div>
  );
}
