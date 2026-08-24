import { useEffect, useMemo, useState } from "react";
import {
  useListaUsosOptions,
  type OptionFormat,
} from "../../hooks/useConstantesOptions";
import { useLimpiezaPublica } from "../../hooks/useLimpiezaPublica";
import type {
  CreateLimpiezaPublicaDTO,
  LimpiezaPublicaData,
} from "../../services/limpiezaPublicaService";
import { NotificationService } from "../utils/Notification";
import type {
  LimpiezaPublicaController,
  ZonaOption,
} from "./limpiezaPublica.types";

const currentYear = new Date().getFullYear();
const ZONAS: ZonaOption[] = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  label: `Zona ${index + 1}`,
}));
const criterioCode = (option: OptionFormat) =>
  Number(option.label.match(/\d+/)?.[0] ?? Number(option.value) % 100);

export const useLimpiezaPublicaController = (): LimpiezaPublicaController => {
  const [tabValue, setTabValue] = useState(0);
  const [anioRegistro, setAnioRegistro] = useState(currentYear);
  const [anioBusqueda, setAnioBusqueda] = useState(currentYear);
  const [zonaSel, setZonaSel] = useState<ZonaOption | null>(null);
  const [criterioSel, setCriterioSel] = useState<OptionFormat | null>(null);
  const [tasaVal, setTasaVal] = useState("");
  const [registroEditando, setRegistroEditando] =
    useState<LimpiezaPublicaData | null>(null);
  const { options: usosOptions } = useListaUsosOptions();
  const api = useLimpiezaPublica();
  const criterios = useMemo(
    () =>
      [
        ...usosOptions.filter(
          (item) => !item.label?.toUpperCase().includes("CASA"),
        ),
      ].sort((a, b) => {
        const labelA = a.label || "";
        const labelB = b.label || "";
        const ctA = labelA.toUpperCase().startsWith("CT");
        const ctB = labelB.toUpperCase().startsWith("CT");
        if (ctA !== ctB) return ctA ? -1 : 1;
        if (ctA) {
          const difference = criterioCode(a) - criterioCode(b);
          if (difference) return difference;
        }
        return labelA.localeCompare(labelB);
      }),
    [usosOptions],
  );
  const limpiar = () => {
    setZonaSel(null);
    setCriterioSel(null);
    setTasaVal("");
    setRegistroEditando(null);
  };
  useEffect(() => {
    limpiar();
  }, [tabValue]);

  const guardar = async () => {
    if (!tasaVal || (tabValue === 0 ? !zonaSel : !criterioSel)) return;
    const data = {
      anio: anioRegistro,
      tasaMensual: Number(tasaVal),
      codigo: registroEditando?.codigo,
      codZona: zonaSel?.id,
      codCriterio: criterioSel ? criterioCode(criterioSel) : undefined,
    } as unknown as CreateLimpiezaPublicaDTO;
    try {
      if (tabValue === 0) {
        if (registroEditando) await api.actualizarLimpiezaPublica(data);
        else await api.crearLimpiezaPublica(data);
      } else if (registroEditando)
        await api.actualizarLimpiezaPublicaOtros(data);
      else await api.crearLimpiezaPublicaOtros(data);
      limpiar();
      api.recargar();
    } catch (error) {
      NotificationService.error(
        `Error al registrar tasa: ${error instanceof Error ? error.message : "Error desconocido"}`,
      );
    }
  };
  const editar = (row: LimpiezaPublicaData) => {
    setRegistroEditando(row);
    setAnioRegistro(row.anio || anioBusqueda);
    setTasaVal(String(row.tasaMensual));
    if (tabValue === 0) {
      const code = Number(row.codZona ?? row.nombreZona?.match(/\d+/)?.[0]);
      setZonaSel(ZONAS.find((item) => item.id === code) ?? null);
      setCriterioSel(null);
    } else {
      const code = Number(
        row.codCriterio ?? row.criterioUso?.match(/\d+/)?.[0],
      );
      const usage =
        usosOptions.find((item) => criterioCode(item) === code) ??
        usosOptions.find((item) => {
          const a = item.label.toUpperCase().trim();
          const b = row.criterioUso?.toUpperCase().trim() || "";
          return a === b || a.includes(b) || b.includes(a);
        });
      setCriterioSel(usage ?? null);
      setZonaSel(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return {
    tabValue,
    setTabValue,
    anioRegistro,
    setAnioRegistro,
    anioBusqueda,
    setAnioBusqueda,
    zonaSel,
    setZonaSel,
    criterioSel,
    setCriterioSel,
    tasaVal,
    setTasaVal,
    registroEditando,
    zonas: ZONAS,
    criterios,
    currentList:
      tabValue === 0 ? api.limpiezaPublica : api.limpiezaPublicaOtros,
    loading: api.loading,
    isButtonDisabled:
      api.loading || !tasaVal || (tabValue === 0 ? !zonaSel : !criterioSel),
    limpiar,
    buscar: () => api.setAnio(anioBusqueda),
    guardar,
    editar,
  };
};
