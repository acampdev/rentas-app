import type { UITData } from "../../../services/uitService";

const MIN_UIT_YEAR = 1990;
const MAX_UIT_YEAR = 2100;

export const formatUitNumber = (value: number): string =>
  new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const parseUitSearchYear = (value: string): number | null => {
  const normalized = value.trim();
  if (!/^\d{4}$/.test(normalized)) return null;

  const year = Number(normalized);
  return year >= MIN_UIT_YEAR && year <= MAX_UIT_YEAR ? year : null;
};

export const filterUits = (uits: UITData[], searchTerm: string): UITData[] => {
  const term = searchTerm.trim();
  if (!term) return uits;

  return uits.filter(
    (uit) =>
      String(uit.anio).includes(term) ||
      String(uit.valorUit ?? uit.valor ?? "").includes(term),
  );
};
