import { useCallback, useEffect, useRef, useState } from "react";
import type { AperturaCajaData } from "../../components/caja/AperturaCaja";
import { NotificationService } from "../../components/utils/Notification";
import { getAuthenticatedUserCode } from "../../config/api.unified.config";
import { aperturaCajaService } from "../../services/aperturaCajaService";
import { asignacionCajaService } from "../../services/asignacionCajaService";
import { logger } from "../../utils/logger";
import { createClosedCajaState, type EstadoCaja } from "./cajaPage.types";

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

export const useCajaPage = () => {
  const [estadoCaja, setEstadoCaja] = useState<EstadoCaja>(
    createClosedCajaState,
  );
  const [aperturaModalOpen, setAperturaModalOpen] = useState(false);
  const [movimientosModalOpen, setMovimientosModalOpen] = useState(false);
  const [listarAperturaModalOpen, setListarAperturaModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const syncVersionRef = useRef(0);

  const syncActiveApertura = useCallback(
    async (codUsuarioOverride?: number) => {
      const version = ++syncVersionRef.current;
      try {
        const codUsuario = codUsuarioOverride ?? getAuthenticatedUserCode();
        if (!codUsuario) {
          if (version === syncVersionRef.current)
            setEstadoCaja(createClosedCajaState());
          return;
        }
        const apertura =
          await aperturaCajaService.obtenerPorUsuario(codUsuario);
        if (version !== syncVersionRef.current) return;
        if (!apertura) {
          setEstadoCaja(createClosedCajaState());
          return;
        }

        let numeroCaja = apertura.caja?.trim() ?? "";
        if (!numeroCaja && apertura.codAsignacionCaja) {
          try {
            const asignaciones = await asignacionCajaService.listar({
              codUsuario,
            });
            numeroCaja =
              asignaciones.find(
                (item) => item.codAsignacionCaja === apertura.codAsignacionCaja,
              )?.numCaja ?? "";
          } catch (error) {
            logger.warn(
              "[CajaPage] No se pudo resolver el nombre de la caja:",
              error,
            );
          }
        }
        if (version !== syncVersionRef.current) return;
        setEstadoCaja({
          numeroCaja,
          fechaApertura: apertura.fechaApertura || "",
          montoInicial: apertura.montoApertura,
          montoActual: apertura.montoCierre ?? apertura.montoApertura,
          totalIngresos: 0,
          totalEgresos: 0,
          abierta:
            apertura.estado === "ABIERTO" || apertura.estado === "ABIERTA",
          ultimaTransaccion: new Date().toLocaleTimeString("es-PE"),
          codAperturaCaja: apertura.codAperturaCaja,
          codAsignacionCaja: apertura.codAsignacionCaja,
          codUsuarioOperando: codUsuario,
        });
      } catch (error) {
        if (version !== syncVersionRef.current) return;
        setEstadoCaja(createClosedCajaState());
        NotificationService.error(
          errorMessage(error, "No se pudo verificar la apertura activa."),
        );
      }
    },
    [],
  );

  useEffect(() => {
    void syncActiveApertura();
  }, [syncActiveApertura]);

  const abrirCaja = async (data: AperturaCajaData) => {
    setLoading(true);
    try {
      const codUsuario = data.codUsuario || getAuthenticatedUserCode();
      if (!Number.isInteger(codUsuario) || codUsuario <= 0)
        throw new Error(
          "Debe seleccionar un cajero válido para abrir la caja.",
        );
      const apertura = await aperturaCajaService.apertura({
        observacion: data.observacion || "Aperturar caja",
        montoApertura: data.montoInicial,
        codUsuario,
      });
      syncVersionRef.current += 1;
      const numeroCaja = apertura.caja?.trim() || data.numeroCaja?.trim() || "";
      setEstadoCaja({
        numeroCaja,
        fechaApertura: data.fechaApertura,
        montoInicial: data.montoInicial,
        montoActual: data.montoInicial,
        totalIngresos: 0,
        totalEgresos: 0,
        abierta: true,
        ultimaTransaccion: new Date().toLocaleTimeString("es-PE"),
        codAperturaCaja: apertura.codAperturaCaja,
        codAsignacionCaja: data.codAsignacionCaja,
        codUsuarioOperando: codUsuario,
      });
      setAperturaModalOpen(false);
      NotificationService.success(
        `¡Caja abierta exitosamente!${numeroCaja ? ` ${numeroCaja}` : ""} iniciada con S/. ${data.montoInicial.toFixed(2)}`,
      );
    } catch (error) {
      NotificationService.error(
        `Error al abrir caja: ${errorMessage(error, "No se pudo procesar la apertura. Intente nuevamente.")}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const operarCaja = useCallback(
    async (codAperturaCaja: number, codUsuario: number, caja: string) => {
      setLoading(true);
      try {
        const apertura = await aperturaCajaService.verificarAperturaActiva(
          codUsuario,
          codAperturaCaja,
        );
        const montoActual = apertura.montoCierre ?? apertura.montoApertura;
        if (!Number.isFinite(montoActual) || montoActual < 0)
          throw new Error(
            "El servidor no informó un monto válido para la apertura seleccionada.",
          );
        setEstadoCaja({
          numeroCaja: apertura.caja?.trim() || caja.trim(),
          fechaApertura: apertura.fechaApertura || "",
          montoInicial: apertura.montoApertura,
          montoActual,
          totalIngresos: 0,
          totalEgresos: 0,
          abierta: true,
          ultimaTransaccion: new Date().toLocaleTimeString("es-PE"),
          codAperturaCaja: apertura.codAperturaCaja,
          codAsignacionCaja: apertura.codAsignacionCaja,
          codUsuarioOperando: codUsuario,
        });
        syncVersionRef.current += 1;
        setListarAperturaModalOpen(false);
        NotificationService.success(
          "Operando la apertura activa verificada del cajero seleccionado.",
        );
      } catch (error) {
        NotificationService.error(
          errorMessage(error, "No se pudo verificar la caja seleccionada."),
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const cerrarCaja = async () => {
    if (!window.confirm("¿Está seguro que desea cerrar la caja?")) return;
    setLoading(true);
    try {
      const codUsuario =
        estadoCaja.codUsuarioOperando ?? getAuthenticatedUserCode();
      const apertura = await aperturaCajaService.verificarAperturaActiva(
        codUsuario,
        estadoCaja.codAperturaCaja,
      );
      const montoCierre = apertura.montoCierre ?? apertura.montoApertura;
      if (!apertura.codAperturaCaja)
        throw new Error(
          "El servidor no informó el código de la apertura activa.",
        );
      if (!Number.isFinite(montoCierre) || montoCierre < 0)
        throw new Error(
          "El servidor no informó un monto válido para cerrar la caja.",
        );
      await aperturaCajaService.cierre({
        codAperturaCaja: apertura.codAperturaCaja,
        codAsignacionCaja: apertura.codAsignacionCaja ?? null,
        observacion: "Cerrar caja",
        montoCierre,
        codUsuario,
      });
      syncVersionRef.current += 1;
      const numeroCaja = estadoCaja.numeroCaja;
      setEstadoCaja(createClosedCajaState());
      NotificationService.info(
        `Caja cerrada: Caja N° ${numeroCaja} cerrada exitosamente en la base de datos`,
      );
    } catch (error) {
      NotificationService.error(
        `Error al cerrar caja: ${errorMessage(error, "Intente nuevamente.")}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const puedeOperarCaja =
    estadoCaja.abierta &&
    Number(estadoCaja.codAperturaCaja) > 0 &&
    Number(estadoCaja.codUsuarioOperando) > 0;
  return {
    estadoCaja,
    puedeOperarCaja,
    loading,
    aperturaModalOpen,
    movimientosModalOpen,
    listarAperturaModalOpen,
    setAperturaModalOpen,
    setMovimientosModalOpen,
    setListarAperturaModalOpen,
    abrirCaja,
    operarCaja,
    cerrarCaja,
    syncActiveApertura,
  };
};
