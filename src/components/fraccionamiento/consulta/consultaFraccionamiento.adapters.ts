import type { Fraccionamiento } from "../../../types/fraccionamiento.types";

export const formatMoney = (value?: number): string =>
  `S/ ${(value ?? 0).toFixed(2)}`;

export const formatPercentage = (value?: number): string =>
  `${(value ?? 0).toFixed(2)} %`;

export const paginateFraccionamientos = (
  rows: Fraccionamiento[],
  page: number,
  rowsPerPage: number,
): Fraccionamiento[] =>
  rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

export const isSelectedFraccionamiento = (
  selected: Fraccionamiento | null,
  row: Fraccionamiento,
): boolean => {
  if (!selected) return false;
  if (selected.id !== undefined && row.id !== undefined) {
    return selected.id === row.id;
  }
  return selected === row;
};
