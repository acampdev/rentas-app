import { useEffect, useState } from "react";
import type { ContribuyenteOption } from "../../../models/Caja";
import { cuentaCorrienteService, type EstadoCuentaDetalle } from "../../../services/cuentaCorrienteService";

export interface DeudaAnualDetalle {
  year: number;
  details: EstadoCuentaDetalle[];
}

export const useDeudaCuentaCorriente = (open: boolean, contributor: ContribuyenteOption | null) => {
  const contributorCode = contributor?.codigo || contributor?.codigoPredio;
  const [details, setDetails] = useState<DeudaAnualDetalle[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!open || !contributorCode) {
        setDetails([]);
        setYears([]);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const annual = await cuentaCorrienteService.listarEstadoCuenta(contributorCode);
        const availableYears = [...new Set(annual.map((item) => Number(item.anio)).filter(Boolean))].sort((a, b) => b - a);
        const annualDetails = await Promise.all(availableYears.map(async (year) => ({ year, details: await cuentaCorrienteService.listarDetalleEstadoCuenta(contributorCode, year) })));
        if (active) {
          setYears(availableYears);
          setDetails(annualDetails);
        }
      } catch (loadError) {
        if (active) {
          setDetails([]);
          setYears([]);
          setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el estado de cuenta");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [contributorCode, open]);

  return { details, years, loading, error };
};
