import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { OptionFormat } from "../../../hooks/useConstantesOptions";
import { usePisos } from "../../../hooks/usePisos";
import type { Predio } from "../../../models/Predio";
import type { PisoData } from "../../../services/pisoService";
import { getApiErrorMessage } from "../../../services/apiClient";
import { NotificationService } from "../../utils/Notification";
import {
  adaptarPisoEdicionAForm,
  buscarValorUnitarioPiso,
  crearPayloadPiso,
  crearPisoFormInicial,
} from "./registrosPisos.adapters";
import { extraerAnioYCodigoBase, validatePisoForm } from "./registrosPisos.validation";
import type {
  CategoriaSeleccionada,
  PisoFormData,
  PisoNavigationState,
} from "./registrosPisos.types";
import { usePisoCatalogos } from "./usePisoCatalogos";

const CATEGORY_FIELDS: Array<{
  parent: string;
  child: string;
  letterField: keyof PisoData;
}> = [
  { parent: "1001", child: "100101", letterField: "codLetraMurosColumnas" },
  { parent: "1001", child: "100102", letterField: "codLetraTechos" },
  { parent: "1002", child: "100201", letterField: "codLetraPisos" },
  { parent: "1002", child: "100202", letterField: "codLetraPuertasVentanas" },
  { parent: "1002", child: "100203", letterField: "codLetraRevestimiento" },
  { parent: "1002", child: "100204", letterField: "codLetraBanios" },
  { parent: "1003", child: "100301", letterField: "codLetraInstalacionesElectricas" },
];

const buildEditPredio = (state: PisoNavigationState | null): Predio | null => {
  const piso = state?.datosEdicion?.piso;
  if (!piso) return null;
  const source = state?.datosEdicion?.predio;
  const { anio, codigoBase } = extraerAnioYCodigoBase(piso.codPredio);
  return {
    codigoPredio: String(source?.codigoPredio || piso.codPredio || codigoBase).trim(),
    codPredio: String(source?.codPredio || piso.codPredio || "").trim(),
    codPredioBase: String(source?.codPredioBase || piso.codPredioBase || codigoBase).trim(),
    anio: source?.anio ?? piso.anio ?? anio,
    condicionPropiedad: source?.condicionPropiedad || "",
    conductor: source?.conductor || "",
    areaTerreno: Number(source?.areaTerreno || 0),
    direccion: source?.direccion || piso.direccion || "",
    estadoPredio: source?.estadoPredio,
  };
};

const makeOption = (value: string, label: string, id?: string): OptionFormat => ({ value, label, id });

export const useRegistroPisoForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationState = location.state as PisoNavigationState | null;
  const pisoEdicion = navigationState?.datosEdicion?.piso;
  const isEditMode = navigationState?.modoEdicion === "editar" && Boolean(pisoEdicion);
  const initialYear = pisoEdicion ? extraerAnioYCodigoBase(pisoEdicion.codPredio).anio : new Date().getFullYear();

  const [predio, setPredio] = useState<Predio | null>(() => buildEditPredio(navigationState));
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [formData, setFormData] = useState<PisoFormData>(() => crearPisoFormInicial(initialYear));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categoriaPadre, setCategoriaPadre] = useState<OptionFormat | null>(null);
  const [categoriaHija, setCategoriaHija] = useState<OptionFormat | null>(null);
  const [letra, setLetra] = useState<OptionFormat | null>(null);
  const [categorias, setCategorias] = useState<CategoriaSeleccionada[]>([]);
  const [editLoaded, setEditLoaded] = useState(false);
  const [feedback, setFeedback] = useState<{
    severity: "info" | "error";
    message: string;
  } | null>(null);
  const { crearPiso, guardarPiso, isSaving } = usePisos();
  const catalogos = usePisoCatalogos(categoriaPadre, formData.anio);

  const updateField = useCallback(<K extends keyof PisoFormData>(field: K, value: PisoFormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const selectPredio = useCallback((selected: Predio) => {
    setPredio(selected);
    setSelectorOpen(false);
    if (selected.anio) updateField("anio", Number(selected.anio));
    setErrors((current) => {
      const next = { ...current };
      delete next.predio;
      return next;
    });
  }, [updateField]);

  useEffect(() => {
    if (!isEditMode || !pisoEdicion || editLoaded) return;
    setFormData(adaptarPisoEdicionAForm(pisoEdicion));
    setEditLoaded(true);
  }, [editLoaded, isEditMode, pisoEdicion]);

  useEffect(() => {
    if (!isEditMode || !pisoEdicion || categorias.length || catalogos.loadingDictionaries || catalogos.loadingValores) return;
    const loaded = CATEGORY_FIELDS.map(({ parent, child, letterField }) => {
      const letterCode = String(pisoEdicion[letterField] || "1101").trim();
      const parentOption = makeOption(parent, catalogos.diccionarios.categoriaCodigoToTexto[parent] || parent);
      const childOption = makeOption(child, catalogos.diccionarios.subcategoriaCodigoToTexto[child] || child);
      const letterOption = makeOption(
        catalogos.diccionarios.letraCodigoToLetra[letterCode] || letterCode,
        catalogos.diccionarios.letraCodigoToLetra[letterCode] || letterCode,
        letterCode,
      );
      return {
        id: `${child}-${letterCode}`,
        padre: parentOption,
        hijo: childOption,
        letra: letterOption,
        fechaCreacion: new Date(),
        valor: buscarValorUnitarioPiso(parentOption, childOption, letterOption, formData.anio, catalogos.valoresUnitarios, catalogos.diccionarios),
      };
    });
    setCategorias(loaded);
  }, [catalogos.diccionarios, catalogos.loadingDictionaries, catalogos.loadingValores, catalogos.valoresUnitarios, categorias.length, formData.anio, isEditMode, pisoEdicion]);

  useEffect(() => {
    if (!formData.fechaConstruccion) return;
    const years = Math.max(0, new Date().getFullYear() - formData.fechaConstruccion.getFullYear());
    setFormData((current) => ({ ...current, antiguedad: `${years} años` }));
  }, [formData.fechaConstruccion]);

  const changeParent = useCallback((option: OptionFormat | null) => {
    setCategoriaPadre(option);
    setCategoriaHija(null);
    setLetra(null);
  }, []);

  const changeChild = useCallback((option: OptionFormat | null) => {
    setCategoriaHija(option);
    setLetra(null);
  }, []);

  const addCategory = useCallback(() => {
    if (!categoriaPadre || !categoriaHija || !letra) {
      NotificationService.warning("Seleccione categoría, subcategoría y letra");
      return;
    }
    const id = `${categoriaHija.value}-${letra.id || letra.value}`;
    if (categorias.some((item) => item.id === id || String(item.hijo.value) === String(categoriaHija.value))) {
      NotificationService.warning("La subcategoría ya fue agregada");
      return;
    }
    const valor = buscarValorUnitarioPiso(categoriaPadre, categoriaHija, letra, formData.anio, catalogos.valoresUnitarios, catalogos.diccionarios);
    setCategorias((current) => [...current, { id, padre: categoriaPadre, hijo: categoriaHija, letra, fechaCreacion: new Date(), valor }]);
    setCategoriaHija(null);
    setLetra(null);
  }, [categoriaHija, categoriaPadre, categorias, catalogos.diccionarios, catalogos.valoresUnitarios, formData.anio, letra]);

  const removeCategory = useCallback((id: string) => {
    setCategorias((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    setPredio(null);
    setFormData(crearPisoFormInicial());
    setErrors({});
    setCategoriaPadre(null);
    setCategoriaHija(null);
    setLetra(null);
    setCategorias([]);
    setFeedback(null);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, navigate]);

  const submit = useCallback(async () => {
    setFeedback(null);
    const nextErrors = validatePisoForm(formData, Boolean(predio));
    if (!categorias.length) nextErrors.categorias = "Agregue por lo menos una categoría";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !predio) return;
    try {
      const payload = crearPayloadPiso(formData, predio, categorias, pisoEdicion?.codPiso);
      const result = await (isEditMode ? guardarPiso(payload) : crearPiso(payload));
      const message = result?.operationMessage ||
        (isEditMode
          ? "Piso actualizado correctamente."
          : "Piso registrado correctamente.");
      setFeedback({ severity: "info", message });
      window.setTimeout(() => {
        navigate("/predio/pisos/consulta", {
          state: { anio: payload.anio, codPredio: payload.codPredio, codigoPredio: payload.codPredio, predio },
        });
      }, 1500);
    } catch (error) {
      const message = getApiErrorMessage(error, "No se pudo guardar el piso");
      setFeedback({ severity: "error", message });
      NotificationService.error(message);
    }
  }, [categorias, crearPiso, formData, guardarPiso, isEditMode, navigate, pisoEdicion?.codPiso, predio]);

  const totalCategorias = useMemo(() => categorias.reduce((sum, item) => sum + item.valor, 0), [categorias]);

  return {
    isEditMode, predio, selectorOpen, setSelectorOpen, selectPredio,
    formData, errors, updateField, categorias, totalCategorias,
    categoriaPadre, categoriaHija, letra, changeParent, changeChild, setLetra,
    addCategory, removeCategory, clear, submit, isSaving, catalogos, feedback,
  };
};
