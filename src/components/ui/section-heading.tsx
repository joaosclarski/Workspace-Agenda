import type { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  title: string;
  description?: ReactNode;
}

// Sem rótulo acima do título: o próprio H2 carrega a seção.
export function SectionHeading({ id, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <h2 id={id} className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-lg text-muted text-pretty">{description}</p>}
    </div>
  );
}
