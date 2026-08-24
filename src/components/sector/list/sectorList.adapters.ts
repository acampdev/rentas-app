import type { Sector } from "../../../models/Sector";
import type { SectorOrder, SectorSortKey } from "./sectorList.types";

const compareValues = (left: unknown, right: unknown): number => {
  if (left == null) return 1;
  if (right == null) return -1;
  return String(left).localeCompare(String(right), "es", {
    numeric: true,
    sensitivity: "base",
  });
};

export const filterAndSortSectors = (
  sectors: Sector[],
  searchTerm: string,
  orderBy: SectorSortKey,
  order: SectorOrder,
  applyLocalFilter: boolean,
): Sector[] => {
  const normalizedTerm = searchTerm.trim().toLocaleLowerCase("es");
  const filtered =
    applyLocalFilter && normalizedTerm
      ? sectors.filter((sector) =>
          sector.nombre.toLocaleLowerCase("es").includes(normalizedTerm),
        )
      : [...sectors];

  return filtered.sort((left, right) => {
    const result = compareValues(left[orderBy], right[orderBy]);
    return order === "asc" ? result : -result;
  });
};

export const paginateSectors = (
  sectors: Sector[],
  page: number,
  rowsPerPage: number,
): Sector[] =>
  sectors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
