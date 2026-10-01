import { useSyncExternalStore } from "react";
import { todayISO } from "./format";

const noopSubscribe = () => () => {};

/**
 * Data de hoje (YYYY-MM-DD) no fuso do visitante.
 * No servidor e na hidratação retorna `undefined`, pois a página é pré-renderizada no build.
 */
export const useToday = (): string | undefined =>
  useSyncExternalStore(noopSubscribe, todayISO, () => undefined);
