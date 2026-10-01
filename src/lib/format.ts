const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatPrice = (value: number): string => currency.format(value);

/** Data local no formato YYYY-MM-DD, usado como valor de `<input type="date">`. */
export const todayISO = (): string => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

/** "1 de outubro": mês por extenso evita o ponto da abreviação colidindo com o fim da frase. */
export const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "long" });

export const formatHour = (hour: number): string => `${String(hour).padStart(2, "0")}:00`;

export const formatHours = (hours: number): string => (hours === 1 ? "1 hora" : `${hours} horas`);

export const formatPeople = (people: number): string => (people === 1 ? "1 pessoa" : `${people} pessoas`);

/** Preposição correta antes do nome da cidade ("no Rio de Janeiro", "em São Paulo"). */
export const inCity = (city: string): string => (city === "Rio de Janeiro" ? `no ${city}` : `em ${city}`);

export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(" ");
