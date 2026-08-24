import { useState } from "react";
import { useTransferencia } from "../../../../hooks/useTransferencia";
import type { BuscarTransferenciaPredioParams } from "../../../../services/transferenciaService";
import { NotificationService } from "../../../utils/Notification";
import {
  INITIAL_TRANSFER_FILTERS,
  type TransferenciaFilters,
} from "./consultaTransferencia.types";

const optionalNumber = (value: string): number | undefined =>
  value ? Number(value) : undefined;

export function useConsultaTransferencia() {
  const [filters, setFilters] = useState<TransferenciaFilters>({
    ...INITIAL_TRANSFER_FILTERS,
  });
  const { transferencias, buscarTransferencias, isSearching } =
    useTransferencia();

  const changeFilter = <Key extends keyof TransferenciaFilters>(
    field: Key,
    value: TransferenciaFilters[Key],
  ) => setFilters((previous) => ({ ...previous, [field]: value }));

  const search = async (): Promise<void> => {
    if (!Object.values(filters).some((value) => value.trim())) {
      NotificationService.warning(
        "Ingrese al menos un filtro para realizar la búsqueda",
      );
      return;
    }
    const params: BuscarTransferenciaPredioParams = {
      codTransferencia: optionalNumber(filters.codigoTransferencia),
      codPredio: filters.codigoPredio || undefined,
      anio: optionalNumber(filters.anio),
      codContribuyenteVenta: optionalNumber(filters.codContribuyenteVenta),
      codContribuyenteCompra: optionalNumber(filters.codContribuyenteCompra),
    };
    try {
      await buscarTransferencias(params);
    } finally {
      setFilters({ ...INITIAL_TRANSFER_FILTERS });
    }
  };

  return { filters, changeFilter, transferencias, isSearching, search };
}
