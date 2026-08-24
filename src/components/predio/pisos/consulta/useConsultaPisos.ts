import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePisos } from "../../../../hooks/usePisos";
import type { Predio } from "../../../../models/Predio";
import { NotificationService } from "../../../utils/Notification";
import type { FiltrosPisosUI, PisoConsulta } from "./consultaPisos.types";
import { currentYear, extractBaseCode } from "./consultaPisos.utils";

const emptyFilters = (): FiltrosPisosUI => ({
  anio: currentYear(),
  codPredio: "",
});

export function useConsultaPisos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [predio, setPredio] = useState<Predio | null>(null);
  const [uiFilters, setUiFilters] = useState<FiltrosPisosUI>(emptyFilters);
  const [editingFloor, setEditingFloor] = useState<number | null>(null);
  const pisosApi = usePisos();
  const consultarPisos = pisosApi.consultarPisos;

  useEffect(() => {
    const state = location.state as {
      codigoPredio?: string;
      predio?: Predio;
      codPredioBase?: string;
    } | null;
    if (!state?.codigoPredio && !state?.codPredioBase) return;
    if (state.predio) setPredio(state.predio);
    const year = Number(state.predio?.anio) || currentYear();
    const baseCode =
      state.codPredioBase?.trim() ||
      extractBaseCode(state.codigoPredio || "", year);
    consultarPisos({ anio: year, codPredioBase: baseCode });
    setUiFilters(emptyFilters());
  }, [consultarPisos, location.state]);

  const search = () => {
    if (!uiFilters.codPredio.trim()) {
      NotificationService.warning(
        "Debe ingresar un Código de Predio para realizar la búsqueda",
      );
      return;
    }
    pisosApi.consultarPisos({
      anio: uiFilters.anio,
      codPredioBase: extractBaseCode(uiFilters.codPredio, uiFilters.anio),
    });
    setUiFilters(emptyFilters());
  };

  const clear = () => {
    pisosApi.setFiltros({});
    setUiFilters(emptyFilters());
    setPredio(null);
    NotificationService.info("Resultados y filtros de búsqueda limpiados");
  };

  const edit = async (floor: PisoConsulta) => {
    const year = Number(floor.anio || pisosApi.filtros.anio || currentYear());
    const fullCode = String(floor.codPredio || floor.codigoPredio || "").trim();
    const baseCode = String(
      floor.codPredioBase ||
        pisosApi.filtros.codPredioBase ||
        extractBaseCode(fullCode, year),
    ).trim();
    const floorNumber = Number(floor.numeroPiso);
    if (!baseCode || !floorNumber) {
      NotificationService.error(
        "No se pudo determinar el predio o número de piso para editar",
      );
      return;
    }
    try {
      setEditingFloor(Number(floor.codPiso || floor.id || floorNumber));
      const completeFloor = await pisosApi.obtenerPisoParaEdicion({
        anio: year,
        codPredioBase: baseCode,
        numeroPiso: floorNumber,
      });
      if (!completeFloor)
        return NotificationService.warning(
          "No se encontraron los datos completos del piso seleccionado",
        );
      const selectedProperty = predio || {
        codPredio: completeFloor.codPredio || `${year}${baseCode}`,
        codigoPredio: completeFloor.codPredio || `${year}${baseCode}`,
        codPredioBase: baseCode,
        anio: year,
      };
      navigate("/predio/pisos/registro", {
        state: {
          modoEdicion: "editar",
          datosEdicion: {
            piso: completeFloor,
            predio: selectedProperty,
            modoEdicion: "editar",
          },
        },
      });
    } catch (error) {
      NotificationService.error(
        error instanceof Error
          ? error.message
          : "No se pudo consultar el piso seleccionado",
      );
    } finally {
      setEditingFloor(null);
    }
  };

  const remove = async (floor: PisoConsulta) => {
    if (
      !window.confirm(
        `¿Seguro que desea eliminar el piso ${floor.numeroPiso || floor.item}?`,
      )
    )
      return;
    const year = floor.anio || pisosApi.filtros.anio || currentYear();
    await pisosApi.eliminarPiso({
      anio: year,
      codPredio: String(
        floor.codPredio || `${year}${pisosApi.filtros.codPredioBase || ""}`,
      ),
      numeroPiso: floor.numeroPiso || 0,
      codPiso: floor.codPiso,
    });
  };

  const create = () => {
    const baseCode = (
      pisosApi.filtros.codPredioBase ||
      pisosApi.filtros.codPredio ||
      ""
    ).trim();
    const year = pisosApi.filtros.anio || currentYear();
    const selectedProperty =
      predio ||
      (baseCode
        ? {
            codPredio: `${year}${baseCode}`,
            anio: year,
            codigoPredio: `${year}${baseCode}`,
          }
        : undefined);
    navigate("/predio/pisos/registro", {
      state: {
        modoEdicion: "nuevo",
        datosEdicion: { predio: selectedProperty },
      },
    });
  };

  return {
    ...pisosApi,
    pisos: pisosApi.pisos as PisoConsulta[],
    uiFilters,
    setUiFilters,
    editingFloor,
    search,
    clear,
    edit,
    remove,
    create,
  };
}
