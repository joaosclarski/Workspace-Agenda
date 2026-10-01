"use client";

import { AnimatePresence, motion, useDragControls, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Recebe o id que o título visível deve usar; ele vira o nome acessível do diálogo. */
  children: (titleId: string) => ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  return <AnimatePresence>{open && <Dialog onClose={onClose}>{children}</Dialog>}</AnimatePresence>;
}

function Dialog({ onClose, children }: Omit<ModalProps, "open">) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const dragControls = useDragControls();

  // Bottom sheet do mobile: arrastar a alça para baixo fecha, como nos apps nativos.
  const handleDragEnd = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) onClose();
  };

  // `showModal()` deixa o resto da página inerte, prende o foco e trata o Esc nativamente.
  useEffect(() => {
    const dialog = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <motion.dialog
      ref={ref}
      aria-labelledby={titleId}
      // Esc: deixa o AnimatePresence animar a saída em vez de fechar na hora.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // Se o navegador forçar o fechamento (ex.: Esc repetido), sincroniza o estado.
      onClose={onClose}
      // O próprio <dialog> só recebe o clique quando ele cai no backdrop.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-md overflow-visible bg-transparent p-0 backdrop:bg-stone-950/40 backdrop:backdrop-blur-sm max-sm:mb-0 max-sm:w-full max-sm:max-w-none"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      // A saída é mais rápida que a entrada: fechar não deve parecer lento.
      exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.15, ease: "easeIn" } }}
      transition={{ type: "spring", damping: 28, stiffness: 320 }}
      // O arraste só começa pela alça, então a rolagem do conteúdo continua funcionando.
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.6 }}
      onDragEnd={handleDragEnd}
    >
      <div className="relative max-h-[90dvh] overflow-y-auto rounded-t-3xl bg-surface p-6 shadow-xl max-sm:pt-8 sm:rounded-3xl">
        <div
          aria-hidden
          onPointerDown={(event) => dragControls.start(event)}
          className="absolute inset-x-0 top-0 flex h-8 cursor-grab touch-none justify-center pt-2.5 sm:hidden"
        >
          <span className="h-1.5 w-10 rounded-full bg-stone-300" />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-stone-100 hover:text-ink"
        >
          <X className="size-5" aria-hidden />
        </button>
        {children(titleId)}
      </div>
    </motion.dialog>
  );
}
