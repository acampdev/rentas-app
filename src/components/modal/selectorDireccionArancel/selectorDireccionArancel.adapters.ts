import type { ArancelData } from "../../../services/arancelService";

export const filterAranceles = (
  values: ArancelData[],
  searchTerm: string,
  selectedYear: number | null,
): ArancelData[] => {
  const term = searchTerm.trim().toLowerCase();
  return values.filter((value) => {
    const matchesTerm =
      !term ||
      (value.direccionCompleta ?? "").toLowerCase().includes(term) ||
      String(value.anio ?? "").includes(term) ||
      String(value.costoArancel ?? "").includes(term);
    const matchesYear = !selectedYear || value.anio === selectedYear;
    return matchesTerm && matchesYear;
  });
};

export const isSameArancel = (
  selected: ArancelData | null,
  candidate: ArancelData,
): boolean => {
  if (!selected) return false;
  if (selected.codArancel && candidate.codArancel) {
    return selected.codArancel === candidate.codArancel;
  }
  return (
    !selected.codArancel &&
    !candidate.codArancel &&
    selected.anio === candidate.anio &&
    selected.codDireccion === candidate.codDireccion &&
    selected.costoArancel === candidate.costoArancel
  );
};

export const getArancelRowKey = (value: ArancelData, index: number): string =>
  String(value.codArancel ?? `${value.anio}-${value.codDireccion}-${index}`);

export const parseOptionalPositiveInteger = (value: string): number | null => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};
