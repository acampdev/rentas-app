import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useConstantesOptions } from "../../hooks/useConstantesOptions";
import { constanteService } from "../../services";
import type {
  ConsultaFiltersState,
  Contribuyente,
  ContribuyenteConsultaFiltro,
} from "./contribuyenteConsulta.types";

const initialFilters: ConsultaFiltersState = {
  texto: "",
  codigo: "",
  tipo: "",
  exonerado: "",
  pensionista: "",
};

export const useContribuyenteConsultaView = (
  rows: Contribuyente[],
  onSearch: (filter: ContribuyenteConsultaFiltro) => void,
) => {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const { options: contributorTypes } = useConstantesOptions(
    "tipos-contribuyente",
    () => constanteService.obtenerTiposContribuyente(),
  );

  const updateFilter = (field: keyof ConsultaFiltersState, value: string) =>
    setFilters((current) => ({ ...current, [field]: value }));
  const toggleFilter = (field: "exonerado" | "pensionista", value: string) =>
    setFilters((current) => ({
      ...current,
      [field]: current[field] === value ? "" : value,
    }));
  const search = () => {
    onSearch({
      parametroBusqueda: filters.texto.trim(),
      codigoContribuyente: filters.codigo.trim(),
      codTipoContribuyente: filters.tipo,
      esExonerado: filters.exonerado,
      esPensionista: filters.pensionista,
    });
    setPage(0);
  };
  const clear = () => {
    setFilters(initialFilters);
    onSearch({});
    setPage(0);
  };
  const changeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const orderedRows = useMemo(
    () =>
      [...rows].sort((left, right) => {
        const leftCode = Number(left.codigo);
        const rightCode = Number(right.codigo);

        if (Number.isFinite(leftCode) && Number.isFinite(rightCode)) {
          return rightCode - leftCode;
        }

        return String(right.codigo).localeCompare(String(left.codigo), "es", {
          numeric: true,
        });
      }),
    [rows],
  );

  const visibleRows = useMemo(
    () =>
      orderedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [orderedRows, page, rowsPerPage],
  );

  return {
    filters,
    contributorTypes,
    page,
    rowsPerPage,
    visibleRows,
    setPage,
    updateFilter,
    toggleFilter,
    search,
    clear,
    changeRowsPerPage,
  };
};
