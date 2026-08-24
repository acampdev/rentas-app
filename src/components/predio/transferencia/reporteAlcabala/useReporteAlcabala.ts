import { useState } from "react";
import { format, startOfYear } from "date-fns";
import type { Predio } from "../../../../models/Predio";
import { logger } from "../../../../utils/logger";
import type {
  FiltroReporteAlcabala,
  ReporteAlcabalaItem,
} from "./reporteAlcabala.types";

const createInitialFilters = (): FiltroReporteAlcabala => ({
  predio: null,
  codigoPredio: "",
  fechaDesde: startOfYear(new Date()),
  fechaHasta: new Date(),
});

const logFilters = (action: string, filters: FiltroReporteAlcabala): void => {
  logger.log(action, {
    codigoPredio: filters.codigoPredio,
    fechaDesde: filters.fechaDesde
      ? format(filters.fechaDesde, "dd/MM/yyyy")
      : null,
    fechaHasta: filters.fechaHasta
      ? format(filters.fechaHasta, "dd/MM/yyyy")
      : null,
  });
};

export function useReporteAlcabala() {
  const [filters, setFilters] = useState(createInitialFilters);
  const [results, setResults] = useState<ReporteAlcabalaItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  const selectPredio = (predio: Predio): void => {
    const codigoPredio =
      predio.codPredioBase ?? predio.codigoPredio ?? predio.codPredio ?? "";
    setFilters((previous) => ({
      ...previous,
      predio,
      codigoPredio: String(codigoPredio),
    }));
    setSelectorOpen(false);
  };

  const reset = (): void => {
    setFilters(createInitialFilters());
    setResults([]);
    setHasSearched(false);
    logger.log("Formulario limpiado - listo para nueva busqueda");
  };

  const search = (): void => {
    logFilters("Buscando con filtros:", filters);
    setHasSearched(true);
    setResults([]);
  };

  const print = (): void =>
    logFilters("Imprimiendo reporte con filtros:", filters);

  return {
    filters,
    setFilters,
    results,
    hasSearched,
    selectorOpen,
    setSelectorOpen,
    selectPredio,
    reset,
    search,
    print,
  };
}
