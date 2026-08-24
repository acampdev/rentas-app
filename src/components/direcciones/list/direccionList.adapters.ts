import type { DireccionData } from "../../../services/direccionService";
import type { DireccionOrder, DireccionSortKey } from "./direccionList.types";

const searchableValue = (value: unknown): string =>
  String(value ?? "").toLocaleLowerCase("es");

export const filterDirecciones = (
  direcciones: DireccionData[],
  searchTerm: string,
): DireccionData[] => {
  const term = searchTerm.trim().toLocaleLowerCase("es");
  if (!term) return [...direcciones];
  return direcciones.filter((direccion) =>
    [
      direccion.descripcion,
      direccion.rutaNombre,
      direccion.zonaNombre,
      direccion.ubicacionAreaVerdeNombre,
      direccion.codigo,
    ].some((value) => searchableValue(value).includes(term)),
  );
};

export const sortDirecciones = (
  direcciones: DireccionData[],
  orderBy: DireccionSortKey,
  order: DireccionOrder,
): DireccionData[] =>
  [...direcciones].sort((left, right) => {
    const leftValue = left[orderBy];
    const rightValue = right[orderBy];
    if (leftValue == null && rightValue == null) return 0;
    if (leftValue == null) return order === "asc" ? 1 : -1;
    if (rightValue == null) return order === "asc" ? -1 : 1;
    const comparison = String(leftValue).localeCompare(
      String(rightValue),
      "es",
      {
        numeric: true,
        sensitivity: "base",
      },
    );
    return order === "asc" ? comparison : -comparison;
  });

export const paginateDirecciones = (
  direcciones: DireccionData[],
  page: number,
  rowsPerPage: number,
): DireccionData[] =>
  direcciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
