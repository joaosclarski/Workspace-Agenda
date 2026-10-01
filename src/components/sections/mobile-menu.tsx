"use client";

import { Menu } from "lucide-react";
import { useRef } from "react";

interface MobileMenuProps {
  links: ReadonlyArray<{ href: string; label: string }>;
}

/**
 * Menu do mobile com a Popover API nativa: Esc, clique fora e foco já vêm do navegador.
 * O JS só fecha o menu quando um link é escolhido.
 */
export function MobileMenu({ links }: MobileMenuProps) {
  const menuRef = useRef<HTMLElement>(null);

  return (
    <>
      <button
        type="button"
        popoverTarget="menu-mobile"
        aria-label="Abrir menu"
        className="grid size-11 place-items-center rounded-xl text-ink transition-colors hover:bg-stone-100 md:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>
      <nav
        ref={menuRef}
        id="menu-mobile"
        popover="auto"
        aria-label="Seções"
        className="fixed inset-x-4 top-[4.5rem] bottom-auto m-0 w-auto rounded-2xl border border-line bg-surface p-2 shadow-[0_12px_40px_rgb(0_0_0/0.12)]"
      >
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => menuRef.current?.hidePopover()}
                className="flex min-h-12 items-center rounded-xl px-4 text-base font-medium text-ink transition-colors active:bg-stone-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
