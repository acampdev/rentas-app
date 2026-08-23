import { useCallback, useState } from "react";
import { useCuentaCorriente } from "../../hooks/useCuentaCorriente";
import type {
  ContribuyenteSeleccionado,
  CuentaListProps,
} from "./cuentaList.types";
import { validarFiltrosCuenta } from "./cuentaList.validators";

export const useCuentaList = ({
  contribuyenteId,
  predioId,
}: Pick<CuentaListProps, "contribuyenteId" | "predioId">) => {
  const cuenta = useCuentaCorriente(contribuyenteId, predioId);
  const { buscarEstadoCuenta, limpiarTodo, verDetalleAnio } = cuenta;
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null);
  const [contribuyenteSeleccionado, setContribuyenteSeleccionado] =
    useState<ContribuyenteSeleccionado | null>(null);
  const [codigoContribuyente, setCodigoContribuyente] = useState(
    contribuyenteId == null ? "" : String(contribuyenteId),
  );
  const [anioFiltro, setAnioFiltro] = useState("");
  const [codigoPredio, setCodigoPredio] = useState(
    predioId == null ? "" : String(predioId),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [tributosExpandidos, setTributosExpandidos] = useState<Set<string>>(
    () => new Set(),
  );

  const seleccionarContribuyente = useCallback(
    (contribuyente: ContribuyenteSeleccionado) => {
      setContribuyenteSeleccionado(contribuyente);
      setCodigoContribuyente(String(contribuyente.codigo));
      setIsModalOpen(false);
      setBusquedaRealizada(false);
      setAnioSeleccionado(null);
      setErrorValidacion(null);
      limpiarTodo();
    },
    [limpiarTodo],
  );

  const buscar = useCallback(() => {
    const resultado = validarFiltrosCuenta({
      codigoContribuyente,
      anio: anioFiltro,
      codigoPredio,
    });
    if (!resultado.ok) {
      setErrorValidacion(resultado.message);
      return;
    }
    setErrorValidacion(null);
    setBusquedaRealizada(true);
    setAnioSeleccionado(null);
    setTributosExpandidos(new Set());
    buscarEstadoCuenta(resultado.filtros);
  }, [anioFiltro, buscarEstadoCuenta, codigoContribuyente, codigoPredio]);

  const seleccionarAnio = useCallback(
    (anio: number) => {
      setAnioSeleccionado(anio);
      setTributosExpandidos(new Set());
      verDetalleAnio(anio);
    },
    [verDetalleAnio],
  );

  const alternarTributo = useCallback((tributo: string) => {
    setTributosExpandidos((actuales) => {
      const siguientes = new Set(actuales);
      if (siguientes.has(tributo)) siguientes.delete(tributo);
      else siguientes.add(tributo);
      return siguientes;
    });
  }, []);

  return {
    ...cuenta,
    anioSeleccionado,
    contribuyenteSeleccionado,
    codigoContribuyente,
    anioFiltro,
    codigoPredio,
    isModalOpen,
    busquedaRealizada,
    errorValidacion,
    tributosExpandidos,
    setAnioFiltro,
    setCodigoPredio,
    setIsModalOpen,
    seleccionarContribuyente,
    seleccionarAnio,
    alternarTributo,
    buscar,
  };
};
