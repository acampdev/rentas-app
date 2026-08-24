import { useEffect, useMemo, useState } from "react";
import { fraccionamientoService } from "../../../../services/fraccionamientoService";
import type { CronogramaContribuyente } from "../../../../types/fraccionamiento.types";
import type {
  EstadoCuentaProps,
  EstadoCuentaViewData,
} from "./estadoCuenta.types";
import { storedUsername } from "./estadoCuenta.utils";

export function useEstadoCuenta({
  open,
  fraccionamiento,
  contribuyente,
}: Omit<EstadoCuentaProps, "onClose">) {
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
        (data) =>
          active &&
          setCronograma(
            data
              .filter(
                (fee) =>
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
              : "No se pudo cargar el estado de cuenta",
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

  const data = useMemo<EstadoCuentaViewData>(
    () => ({
      cronograma,
      codigo:
        fraccionamiento?.codContribuyente ??
        fraccionamiento?.codigoContribuyente ??
        contribuyente?.codigo ??
        "-",
      nombre:
        contribuyente?.contribuyente ||
        fraccionamiento?.nombreContribuyente ||
        fraccionamiento?.solicitante ||
        "-",
      direccion: contribuyente?.direccion || "-",
      usuario: storedUsername(),
      fechaEmision: new Date().toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      fechaCuotaInicial:
        fraccionamiento?.fechaAprobacion || fraccionamiento?.fechaSolicitud,
      periodo: `Fraccionamiento desde el ${fraccionamiento?.periodoInicio ?? "-"} trimestre del ${fraccionamiento?.anioDeudaInicio ?? "-"} hasta el ${fraccionamiento?.periodoFin ?? "-"} trimestre del ${fraccionamiento?.anioDeudaFin ?? "-"}`,
      deudaFraccionada:
        fraccionamiento?.totalFraccionado ??
        fraccionamiento?.montoTotal ??
        fraccionamiento?.deudaInsoluta,
      cuotaInicial:
        fraccionamiento?.cuotaInicial ?? fraccionamiento?.montoCuotaInicial,
      saldoPendiente: cronograma.reduce(
        (total, fee) =>
          fee.pagado
            ? total
            : total + Math.max(fee.montoCuota - (fee.montoPagado || 0), 0),
        0,
      ),
    }),
    [contribuyente, cronograma, fraccionamiento],
  );

  return { data, loading, error };
}
