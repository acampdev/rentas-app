import { useEffect, useState } from "react";
import {
  useCategoriasValoresUnitariosHijosOptions,
  useCategoriasValoresUnitariosOptions,
  useEstadoConservacionOptions,
  useLetraValoresUnitariosOptions,
  useTiposMaterialPredominante,
  type OptionFormat,
} from "../../../hooks/useConstantesOptions";
import { constanteService } from "../../../services/constanteService";
import {
  valorUnitarioService,
  type ValorUnitarioData,
} from "../../../services/valorUnitarioService";
import { DEFAULT_PISO_DICTIONARIES } from "./registrosPisos.adapters";
import type { PisoCategoryDictionaries } from "./registrosPisos.types";

export const usePisoCatalogos = (
  categoriaPadre: OptionFormat | null,
  anio?: number,
) => {
  const material = useTiposMaterialPredominante();
  const padres = useCategoriasValoresUnitariosOptions();
  const hijas = useCategoriasValoresUnitariosHijosOptions(
    categoriaPadre?.value?.toString(),
  );
  const letras = useLetraValoresUnitariosOptions();
  const estados = useEstadoConservacionOptions();
  const [diccionarios, setDiccionarios] = useState<PisoCategoryDictionaries>(
    DEFAULT_PISO_DICTIONARIES,
  );
  const [valoresUnitarios, setValoresUnitarios] = useState<ValorUnitarioData[]>([]);
  const [errorCatalogos, setErrorCatalogos] = useState<string | null>(null);
  const [loadingDictionaries, setLoadingDictionaries] = useState(true);
  const [loadingValores, setLoadingValores] = useState(Boolean(anio));

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const parentItems = await constanteService.obtenerTiposCategoriasValoresUnitarios();
        const categoryCodeToText: Record<string, string> = {};
        const categoryTextToCode: Record<string, string> = {};
        const subcategoryCodeToText: Record<string, string> = {};
        const subcategoryTextToCode: Record<string, string> = {};
        await Promise.all(parentItems.map(async (parent) => {
          const code = String(parent.codConstante).trim();
          const name = String(parent.nombreCategoria).trim().toUpperCase();
          if (!code || !name) return;
          categoryCodeToText[code] = name;
          categoryTextToCode[name] = code;
          const children = await constanteService.listarConstantesPorHijo(code);
          children.forEach((child) => {
            const childCode = String(child.codConstante).trim();
            const childName = String(child.nombreCategoria).trim().toUpperCase();
            if (childCode && childName) {
              subcategoryCodeToText[childCode] = childName;
              subcategoryTextToCode[childName] = childCode;
            }
          });
        }));
        const letterItems = await constanteService.obtenerTiposLetrasValoresUnitarios();
        const letterCodeToLetter = Object.fromEntries(letterItems.map((letter) => [
          String(letter.codConstante).trim(),
          String(letter.nombreCategoria).trim().toUpperCase(),
        ]));
        if (active) {
          setDiccionarios((current) => ({
            categoriaCodigoToTexto: { ...current.categoriaCodigoToTexto, ...categoryCodeToText },
            categoriaTextoToCodigo: { ...current.categoriaTextoToCodigo, ...categoryTextToCode },
            subcategoriaCodigoToTexto: { ...current.subcategoriaCodigoToTexto, ...subcategoryCodeToText },
            subcategoriaTextoToCodigo: { ...current.subcategoriaTextoToCodigo, ...subcategoryTextToCode },
            letraCodigoToLetra: Object.keys(letterCodeToLetter).length ? letterCodeToLetter : current.letraCodigoToLetra,
          }));
        }
      } catch (error) {
        if (active) setErrorCatalogos(error instanceof Error ? error.message : "No se pudieron cargar los catálogos de pisos");
      } finally {
        if (active) setLoadingDictionaries(false);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    if (!anio) {
      setValoresUnitarios([]);
      setLoadingValores(false);
      return () => { active = false; };
    }
    setLoadingValores(true);
    valorUnitarioService.consultarValoresUnitarios({ anio })
      .then((values) => { if (active) setValoresUnitarios(values); })
      .catch((error: unknown) => {
        if (active) setErrorCatalogos(error instanceof Error ? error.message : "No se pudieron cargar los valores unitarios");
      })
      .finally(() => { if (active) setLoadingValores(false); });
    return () => { active = false; };
  }, [anio]);

  return {
    opcionesMaterialPredominante: material.options,
    loadingMaterial: material.loading,
    errorMaterial: material.error,
    opcionesPadre: padres.options,
    loadingPadre: padres.loading,
    errorPadre: padres.error,
    opcionesHijas: hijas.options,
    loadingHijas: hijas.loading,
    errorHijas: hijas.error,
    opcionesLetras: letras.options,
    loadingLetras: letras.loading,
    errorLetras: letras.error,
    opcionesEstadoConservacion: estados.options,
    loadingEstado: estados.loading,
    errorEstado: estados.error,
    diccionarios,
    valoresUnitarios,
    loadingDictionaries,
    loadingValores,
    errorCatalogos,
  };
};
