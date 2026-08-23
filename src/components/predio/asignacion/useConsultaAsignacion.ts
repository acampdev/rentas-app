import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import { useAsignacion } from "../../../hooks/useAsignacion";
import type { AsignacionPredio } from "../../../services/asignacionService";
import { NotificationService } from "../../utils/Notification";
import type {
  ConsultaAsignacionFiltros,
  ConsultaAsignacionLocationState,
} from "./consultaAsignacion.types";
import {
  prepararAsignacionParaFormulario,
  validarFiltrosAsignacion,
} from "./consultaAsignacion.validators";

const filtrosIniciales = (): ConsultaAsignacionFiltros => ({
  anio: String(new Date().getFullYear()),
  codigoContribuyente: "",
  nombreContribuyente: "",
});

export const useConsultaAsignacion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectProcesado = useRef(false);
  const asignacion = useAsignacion();
  const { buscarAsignaciones } = asignacion;
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [selectorAbierto, setSelectorAbierto] = useState(false);

  useEffect(() => {
    if (redirectProcesado.current) return;
    const state = location.state as ConsultaAsignacionLocationState | null;
    if (!state?.searchParams) return;

    redirectProcesado.current = true;
    const { anio, codContribuyente } = state.searchParams;
    setFiltros({
      anio: String(anio),
      codigoContribuyente: String(codContribuyente),
      nombreContribuyente: state.nombreContribuyente ?? "",
    });
    void buscarAsignaciones({ anio, codContribuyente });
    navigate(location.pathname, { replace: true, state: {} });
  }, [buscarAsignaciones, location.pathname, location.state, navigate]);

  const actualizarFiltro = useCallback(
    (field: keyof ConsultaAsignacionFiltros, value: string) => {
      setFiltros((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const seleccionarContribuyente = useCallback(
    (contribuyente: ContribuyenteListItem) => {
      setFiltros((current) => ({
        ...current,
        codigoContribuyente: contribuyente.codigo ? String(contribuyente.codigo) : "",
        nombreContribuyente: contribuyente.contribuyente ?? "",
      }));
      setSelectorAbierto(false);
    },
    [],
  );

  const buscar = useCallback(async () => {
    const validation = validarFiltrosAsignacion(filtros);
    if (!validation.ok) {
      NotificationService.error(validation.message);
      return;
    }
    try {
      const results = await buscarAsignaciones(validation.value);
      if (results.length) {
        NotificationService.success(`Se encontraron ${results.length} asignaciones`);
      } else {
        NotificationService.info("No se encontraron asignaciones para los criterios indicados");
      }
    } catch (error) {
      NotificationService.error(
        error instanceof Error ? error.message : "Error al buscar asignaciones",
      );
    }
  }, [buscarAsignaciones, filtros]);

  const navegarConAsignacion = useCallback(
    (item: AsignacionPredio, mode: "edit" | "unassign") => {
      const result = prepararAsignacionParaFormulario(item);
      if (!result.ok) {
        NotificationService.error(result.message);
        return;
      }
      navigate("/predio/asignacion/nuevo", {
        state: {
          editMode: mode === "edit",
          isDesasignarMode: mode === "unassign",
          asignacionData: result.value,
          fromConsulta: true,
        },
      });
    },
    [navigate],
  );

  const imprimirPU = useCallback(() => {
    if (!filtros.codigoContribuyente) {
      NotificationService.error("Debe seleccionar un contribuyente");
      return;
    }
    NotificationService.success("Generando PU...");
  }, [filtros.codigoContribuyente]);

  return {
    ...asignacion,
    filtros,
    selectorAbierto,
    setSelectorAbierto,
    actualizarFiltro,
    seleccionarContribuyente,
    buscar,
    editar: (item: AsignacionPredio) => navegarConAsignacion(item, "edit"),
    desasignar: (item: AsignacionPredio) => navegarConAsignacion(item, "unassign"),
    crearNuevo: () => navigate("/predio/asignacion/nuevo"),
    imprimirPU,
  };
};
