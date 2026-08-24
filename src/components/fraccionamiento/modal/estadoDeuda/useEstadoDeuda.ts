import { useEffect, useMemo, useState } from "react";
import {
  cuentaCorrienteService,
  type EstadoCuentaAnual,
} from "../../../../services/cuentaCorrienteService";
import {
  buildIdentity,
  calculateTotals,
  groupAnnualDebts,
} from "./estadoDeuda.adapters";
import type { EstadoDeudaProps } from "./estadoDeuda.types";

export function useEstadoDeuda({
  open,
  fraccionamiento,
  contribuyente,
}: Omit<EstadoDeudaProps, "onClose">) {
  const [debts, setDebts] = useState<EstadoCuentaAnual[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contributorCode =
    fraccionamiento?.codContribuyente ?? contribuyente?.codigo;

  useEffect(() => {
    if (!open || !contributorCode) {
      setDebts([]);
      setError(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    void cuentaCorrienteService
      .listarEstadoCuenta(contributorCode)
      .then((data) => {
        if (active) setDebts(data ?? []);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setDebts([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudo cargar el estado de deuda",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, contributorCode]);

  const rows = useMemo(() => groupAnnualDebts(debts), [debts]);
  const totals = useMemo(() => calculateTotals(rows), [rows]);
  const identity = useMemo(
    () => buildIdentity(fraccionamiento, contribuyente),
    [fraccionamiento, contribuyente],
  );
  return { rows, totals, identity, loading, error };
}
