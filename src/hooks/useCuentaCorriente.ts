// hooks/useCuentaCorriente.ts
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  cuentaCorrienteService,
  type EstadoCuentaFiltros,
} from "../services/cuentaCorrienteService";

export const useCuentaCorriente = (
  codContribuyenteInicial?: number | string,
  codPredioInicial?: number | string,
) => {
  const [filtros, setFiltros] = useState<EstadoCuentaFiltros | null>(() =>
    codContribuyenteInicial == null
      ? null
      : {
          codContribuyente: codContribuyenteInicial,
          anio: null,
          codPredio: codPredioInicial ?? null,
        },
  );
  const [anioDetalle, setAnioDetalle] = useState<number | null>(null);

  const {
    data: estadoCuentaAnual = [],
    isLoading: loadingEstadoCuenta,
    isFetching: fetchingEstadoCuenta,
    error: errorEstadoCuenta,
    refetch: cargarEstadoCuenta,
  } = useQuery({
    queryKey: ["estado-cuenta-anual", filtros],
    queryFn: () =>
      filtros ? cuentaCorrienteService.listarEstadoCuenta(filtros) : [],
    enabled: filtros !== null,
    placeholderData: (prev) => prev,
  });

  const {
    data: estadoCuentaDetalle = [],
    isLoading: loadingDetalle,
    isFetching: fetchingDetalle,
    error: errorDetalle,
    refetch: cargarDetalleEstadoCuenta,
  } = useQuery({
    queryKey: [
      "estado-cuenta-detalle",
      filtros?.codContribuyente,
      anioDetalle,
      filtros?.codPredio,
    ],
    queryFn: () =>
      filtros && anioDetalle
        ? cuentaCorrienteService.listarDetalleEstadoCuenta(
            filtros.codContribuyente,
            anioDetalle,
            filtros.codPredio,
          )
        : [],
    enabled: filtros !== null && anioDetalle !== null,
    placeholderData: (prev) => prev,
  });

  const buscarEstadoCuenta = useCallback(
    (nuevosFiltros: EstadoCuentaFiltros) => {
      setFiltros({
        codContribuyente: nuevosFiltros.codContribuyente,
        anio: nuevosFiltros.anio || null,
        codPredio: nuevosFiltros.codPredio || null,
      });
      setAnioDetalle(null);
    },
    [],
  );

  const seleccionarContribuyente = useCallback(
    (
      id: number | string,
      anio?: number | string | null,
      codPredio?: number | string | null,
    ) => buscarEstadoCuenta({ codContribuyente: id, anio, codPredio }),
    [buscarEstadoCuenta],
  );

  const verDetalleAnio = useCallback((anio: number) => {
    setAnioDetalle(anio);
  }, []);

  const limpiarTodo = useCallback(() => {
    setFiltros(null);
    setAnioDetalle(null);
  }, []);

  return {
    estadoCuentaAnual,
    loadingEstadoCuenta: loadingEstadoCuenta || fetchingEstadoCuenta,
    errorEstadoCuenta:
      errorEstadoCuenta instanceof Error ? errorEstadoCuenta.message : null,

    estadoCuentaDetalle,
    loadingDetalle: loadingDetalle || fetchingDetalle,
    errorDetalle: errorDetalle instanceof Error ? errorDetalle.message : null,

    filtros,
    codContribuyente: filtros?.codContribuyente,
    codPredio: filtros?.codPredio,
    anioDetalle,

    buscarEstadoCuenta,
    seleccionarContribuyente,
    verDetalleAnio,
    cargarEstadoCuenta,
    cargarDetalleEstadoCuenta,
    limpiarTodo,

    cargarDetalle: verDetalleAnio,
    limpiarDetalle: () => setAnioDetalle(null),
    limpiarEstadoCuenta: () => setFiltros(null),
  };
};
