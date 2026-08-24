import { useEffect, useState } from "react";
import { useTim, useTimComboOptions } from "../../../hooks/useTim";
import { timService, type TimData } from "../../../services/timService";
import { logger } from "../../../utils/logger";
import type {
  TimFormValues,
  TimOption,
  TimSearchState,
  TimSearchValues,
} from "./registroTim.types";

const currentYear = () => new Date().getFullYear();
const defaultTribute = (options: TimOption[]): number => {
  if (options.some(({ value }) => Number(value) === 5)) return 5;
  return Number(options[0]?.value ?? 5);
};
const initialForm = (): TimFormValues => ({
  anio: currentYear(),
  tasa: "",
  periodo: 1,
  tributo: "",
  resolucionInteres: 2,
});
const initialSearch = (): TimSearchValues => ({
  anio: currentYear(),
  periodo: 1,
  tributo: "",
  resolucionInteres: 2,
});

export function useRegistroTim() {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [filters, setFilters] = useState(initialSearch);
  const [search, setSearch] = useState<TimSearchState>({
    results: [],
    loading: false,
    searched: false,
  });
  const [selectedTim, setSelectedTim] = useState<TimData | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { crearTim, eliminarTim, isCreating, isDeleting } = useTim();
  const { options, loading: loadingTributes } = useTimComboOptions();

  useEffect(() => {
    if (!options.length) return;
    const tribute = defaultTribute(options);
    setForm((previous) =>
      previous.tributo ? previous : { ...previous, tributo: tribute },
    );
    setFilters((previous) =>
      previous.tributo ? previous : { ...previous, tributo: tribute },
    );
  }, [options]);

  const reset = () =>
    setForm({ ...initialForm(), tributo: defaultTribute(options) });

  const save = async () => {
    const tasa = Number.parseFloat(form.tasa);
    if (Number.isNaN(tasa) || tasa < 0) {
      window.alert("Por favor ingrese una tasa válida.");
      return;
    }
    try {
      await crearTim({
        anio: form.anio,
        periodo: form.periodo,
        tasa,
        codTributo: Number(form.tributo),
        codResolucionInteres: form.resolucionInteres,
      });
      reset();
    } catch (error) {
      logger.error("Error creating TIM:", error);
    }
  };

  const find = async () => {
    setSearch((previous) => ({ ...previous, loading: true, searched: true }));
    try {
      const results = await timService.obtenerTim({
        anio: filters.anio,
        periodo: filters.periodo,
        codTributo: Number(filters.tributo),
        codResolucionInteres: filters.resolucionInteres,
      });
      setSearch({ results, loading: false, searched: true });
    } catch (error) {
      logger.error("Error loading TIM records:", error);
      setSearch({ results: [], loading: false, searched: true });
    }
  };

  const remove = async (record: TimData) => {
    if (!window.confirm("¿Está seguro de eliminar esta escala TIM?")) return;
    try {
      await eliminarTim({
        codTIM: record.codTIM,
        codResolucionInteres: record.codResolucionInteres,
      });
      await find();
    } catch (error) {
      logger.error("Error deleting TIM:", error);
    }
  };

  const edit = (record: TimData) => {
    setSelectedTim(record);
    setEditOpen(true);
  };

  return {
    tab,
    setTab,
    form,
    setForm,
    filters,
    setFilters,
    search,
    options,
    loadingTributes,
    isCreating,
    isDeleting,
    selectedTim,
    editOpen,
    setEditOpen,
    reset,
    save,
    find,
    remove,
    edit,
  };
}
