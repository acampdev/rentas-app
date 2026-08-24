import { useMemo, useState } from "react";
import {
  useRutasOptions,
  useUbicacionAreaVerdeOptions,
} from "../../../hooks/useConstantesOptions";
import { useParquesJardines } from "../../../hooks/useParquesJardines";
import { logger } from "../../../utils/logger";
import { buildParquesMatrix } from "./parquesJardines.adapters";
import type { ParquesJardinesFormState } from "./parquesJardines.types";

const initialForm = (): ParquesJardinesFormState => ({
  anio: new Date().getFullYear(),
  ruta: null,
  ubicacion: null,
  tasaAnual: "",
  editing: false,
});

export function useParquesJardinesView() {
  const [form, setForm] = useState(initialForm);
  const [searchYear, setSearchYear] = useState(new Date().getFullYear());
  const [showTable, setShowTable] = useState(false);
  const { options: routeOptions, loading: loadingRoutes } = useRutasOptions();
  const { options: locationOptions, loading: loadingLocations } =
    useUbicacionAreaVerdeOptions();
  const api = useParquesJardines();
  const matrix = useMemo(
    () =>
      buildParquesMatrix(api.parquesJardines, routeOptions, locationOptions),
    [api.parquesJardines, routeOptions, locationOptions],
  );

  const clear = () =>
    setForm((previous) => ({ ...initialForm(), anio: previous.anio }));

  const save = async () => {
    if (!form.ruta || !form.ubicacion || !form.tasaAnual) return;
    const payload = {
      anio: form.anio,
      codRuta: Number(form.ruta.value),
      codUbicacion: Number(form.ubicacion.value),
      tasaMensual: Number.parseFloat(form.tasaAnual) / 12,
    };
    const exists = api.parquesJardines.some(
      (item) =>
        item.anio === payload.anio &&
        item.codRuta === payload.codRuta &&
        item.codUbicacion === payload.codUbicacion,
    );
    try {
      if (exists || form.editing) await api.actualizarParquesJardines(payload);
      else await api.crearParquesJardines(payload);
      clear();
      await api.recargar();
    } catch (error) {
      logger.error("❌ [ParquesJardines] Error al registrar:", error);
    }
  };

  const search = () => {
    logger.log("🔍 [ParquesJardines] Consultando año:", searchYear);
    api.setAnio(searchYear);
    setShowTable(true);
    window.setTimeout(() => void api.recargar(), 100);
  };

  const editRate = (
    routeCode: string | number,
    locationCode: string | number,
    monthlyRate: number,
  ) => {
    setForm({
      anio: searchYear,
      ruta:
        matrix.routes.find(
          ({ value }) => String(value) === String(routeCode),
        ) ?? null,
      ubicacion:
        matrix.locations.find(
          ({ value }) => String(value) === String(locationCode),
        ) ?? null,
      tasaAnual: String(monthlyRate * 12),
      editing: true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    form,
    setForm,
    searchYear,
    setSearchYear,
    showTable,
    routeOptions,
    locationOptions,
    loadingRoutes,
    loadingLocations,
    loading: api.loading,
    matrix,
    clear,
    save,
    search,
    editRate,
  };
}
