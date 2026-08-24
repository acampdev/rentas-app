import { useEffect, useMemo, useState } from "react";
import { fraccionamientoService } from "../../../../services/fraccionamientoService";
import type { CronogramaContribuyente } from "../../../../types/fraccionamiento.types";
import type {
  ResolucionJefaturalData,
  ResolucionJefaturalProps,
} from "./resolucionJefatural.types";
import { storedUsername } from "./resolucionJefatural.utils";

export function useResolucionJefatural({
  open,
  fraccionamiento,
  contribuyente,
}: Omit<ResolucionJefaturalProps, "onClose">) {
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
      .then(
        (items) =>
          active &&
          setCronograma(
            items
              .filter(
                (fee) =>
                  fee.numeroCuota !== 0 &&
                  (!fraccionamiento.codResolucion ||
                    fee.codResolucion === fraccionamiento.codResolucion) &&
                  (!fraccionamiento.anio || fee.anio === fraccionamiento.anio),
              )
              .sort((a, b) => a.numeroCuota - b.numeroCuota),
          ),
      )
      .catch((requestError: unknown) => {
        if (active) {
          setCronograma([]);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar el cronograma de la resolución",
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

  const data = useMemo<ResolucionJefaturalData>(
    () => ({
      cronograma,
      usuario: storedUsername(),
      codigo:
        fraccionamiento?.codContribuyente ??
        contribuyente?.codigo ??
        fraccionamiento?.codigoContribuyente ??
        "-",
      nombre:
        contribuyente?.contribuyente ||
        fraccionamiento?.nombreContribuyente ||
        fraccionamiento?.solicitante ||
        "-",
      documento:
        contribuyente?.documento || fraccionamiento?.numDocumento || "-",
      tipoDocumento: fraccionamiento?.tipoDocumento || "DNI",
      direccion: contribuyente?.direccion || "-",
      fechaResolucion:
        fraccionamiento?.fechaAprobacion || fraccionamiento?.fechaSolicitud,
      cuotaInicial: Number(
        fraccionamiento?.cuotaInicial ??
          fraccionamiento?.montoCuotaInicial ??
          0,
      ),
      deuda:
        fraccionamiento?.totalFraccionado ??
        fraccionamiento?.montoTotal ??
        fraccionamiento?.deudaInsoluta,
    }),
    [contribuyente, cronograma, fraccionamiento],
  );
  return { data, loading, error };
}
