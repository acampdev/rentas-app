import { useEffect, useMemo, useState } from "react";
import { fraccionamientoService } from "../../../services/fraccionamientoService";
import type { CronogramaContribuyente } from "../../../types/fraccionamiento.types";
import type { ConvenioDeudaProps } from "./convenioDeuda.types";
import {
  calculateConvenioTotals,
  getConvenioIdentity,
} from "./convenioDeuda.utils";

export const useConvenioDeuda = (props: ConvenioDeudaProps) => {
  const { open, fraccionamiento } = props;
  const [cronograma, setCronograma] = useState<CronogramaContribuyente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!open || !fraccionamiento?.codContribuyente) {
      setCronograma([]);
      setError(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    void fraccionamientoService
      .listarCronogramaContribuyente(fraccionamiento.codContribuyente)
      .then((data) => {
        if (active)
          setCronograma(
            data
              .filter(
                (item) =>
                  item.numeroCuota !== 0 &&
                  (!fraccionamiento.codResolucion ||
                    item.codResolucion === fraccionamiento.codResolucion) &&
                  (!fraccionamiento.anio || item.anio === fraccionamiento.anio),
              )
              .sort((a, b) => a.numeroCuota - b.numeroCuota),
          );
      })
      .catch((requestError: unknown) => {
        if (active) {
          setCronograma([]);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar el cronograma del convenio",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, fraccionamiento]);
  const cuotaInicial = Number(
    fraccionamiento?.cuotaInicial ?? fraccionamiento?.montoCuotaInicial ?? 0,
  );
  const totals = useMemo(
    () => calculateConvenioTotals(cuotaInicial, cronograma),
    [cronograma, cuotaInicial],
  );
  return {
    loading,
    error,
    data: {
      cronograma,
      cuotaInicial,
      fechaCuotaInicial:
        fraccionamiento?.fechaAprobacion || fraccionamiento?.fechaSolicitud,
      totals,
      ...getConvenioIdentity(props),
    },
  };
};
