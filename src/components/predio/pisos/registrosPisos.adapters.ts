import type { CrearPisoFormData } from "../../../hooks/usePisos";
import type { OptionFormat } from "../../../hooks/useConstantesOptions";
import type { Predio } from "../../../models/Predio";
import type { PisoData } from "../../../services/pisoService";
import type { ValorUnitarioData } from "../../../services/valorUnitarioService";
import { determinarNumeroPiso, extraerAnioYCodigoBase, normalizarValorAreasComunes, parseFechaConstruccion } from "./registrosPisos.validation";
import { FormaRegistro, type CategoriaSeleccionada, type PisoCategoryDictionaries, type PisoFormData } from "./registrosPisos.types";

export const DEFAULT_PISO_DICTIONARIES: PisoCategoryDictionaries = {
  categoriaCodigoToTexto: { "1001": "ESTRUCTURAS", "1002": "ACABADOS", "1003": "INSTALACIONES ELECTRICAS Y SANITARIAS" },
  categoriaTextoToCodigo: { ESTRUCTURAS: "1001", ACABADOS: "1002", "INSTALACIONES ELECTRICAS Y SANITARIAS": "1003" },
  subcategoriaCodigoToTexto: { "100101": "MUROS Y COLUMNAS", "100102": "TECHOS", "100201": "PISOS", "100202": "PUERTAS Y VENTANAS", "100203": "REVESTIMIENTOS", "100204": "BAÑOS", "100301": "INSTALACIONES ELECTRICAS Y SANITARIAS" },
  subcategoriaTextoToCodigo: { "MUROS Y COLUMNAS": "100101", TECHOS: "100102", PISOS: "100201", "PUERTAS Y VENTANAS": "100202", REVESTIMIENTOS: "100203", "BAÑOS": "100204", "INSTALACIONES ELECTRICAS Y SANITARIAS": "100301" },
  letraCodigoToLetra: { "1101": "A", "1102": "B", "1103": "C", "1104": "D", "1105": "E", "1106": "F", "1107": "G", "1108": "H", "1109": "I" },
};

export const crearPisoFormInicial = (anio = new Date().getFullYear()): PisoFormData => ({
  descripcion: "", fechaConstruccion: null, antiguedad: "30 años",
  estadoConservacion: "", areaConstruida: "", materialPredominante: "",
  formaRegistro: FormaRegistro.INDIVIDUAL, otrasInstalaciones: "0.00",
  anio, areasComunes: "",
});

export const adaptarPisoEdicionAForm = (piso: PisoData): PisoFormData => ({
  descripcion: piso.numeroPiso?.toString() || "",
  fechaConstruccion: parseFechaConstruccion(piso.fechaConstruccion),
  antiguedad: "30 años",
  estadoConservacion: piso.codEstadoConservacion || "",
  areaConstruida: piso.areaConstruida?.toString() || "",
  materialPredominante: piso.codMaterialEstructural || "",
  formaRegistro: FormaRegistro.INDIVIDUAL,
  otrasInstalaciones: piso.valorOtrasInstalaciones?.toString() || "0.00",
  anio: extraerAnioYCodigoBase(piso.codPredio).anio,
  areasComunes: piso.valorAreasComunes?.toString() || "",
});

const normalizeText = (value: unknown) => String(value ?? "").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").replace(/[_-]+/g, " ")
  .replace(/\s+/g, " ").trim().toUpperCase();

export const buscarValorUnitarioPiso = (
  categoria: OptionFormat,
  subcategoria: OptionFormat,
  letra: OptionFormat,
  anio: number | undefined,
  valores: ValorUnitarioData[],
  dictionaries: PisoCategoryDictionaries,
): number => {
  const categoryCode = String(categoria.value).trim();
  const subcategoryCode = String(subcategoria.value).trim();
  const letterValue = normalizeText(letra.value);
  const letterId = String(letra.id || "").trim();
  const categoryText = normalizeText(dictionaries.categoriaCodigoToTexto[categoryCode] || categoryCode);
  const subcategoryText = normalizeText(dictionaries.subcategoriaCodigoToTexto[subcategoryCode] || subcategoryCode);
  const found = valores.find((value) => {
    const apiCategory = String(value.categoria).trim().toUpperCase();
    const apiSubcategory = String(value.subcategoria).trim().toUpperCase();
    const apiLetter = String(value.letra).trim().toUpperCase();
    return (apiCategory === categoryCode || normalizeText(value.categoria) === categoryText)
      && (apiSubcategory === subcategoryCode || normalizeText(value.subcategoria) === subcategoryText)
      && (normalizeText(value.letra) === letterValue || normalizeText(dictionaries.letraCodigoToLetra[apiLetter]) === letterValue || apiLetter === letterId)
      && Number(value.año) === Number(anio);
  });
  return found?.costo ?? 0;
};

const letterCode = (categories: CategoriaSeleccionada[], child: string) =>
  String(categories.find((item) => String(item.hijo.value) === child)?.letra.id || "1101").trim();

export const crearPayloadPiso = (
  form: PisoFormData,
  predio: Predio,
  categories: CategoriaSeleccionada[],
  codPiso?: number,
): CrearPisoFormData => {
  const baseCode = String(predio.codPredioBase || predio.codigoPredio || predio.codPredio || "").trim();
  const year = Number(predio.anio || form.anio || new Date().getFullYear());
  const codPredio = baseCode.startsWith(String(year)) ? baseCode : `${year}${baseCode}`;
  return {
    ...(codPiso ? { codPiso } : {}),
    anio: Number(form.anio || year), codPredio,
    numeroPiso: determinarNumeroPiso(form.descripcion),
    areaConstruida: Number(form.areaConstruida),
    valorAreasComunes: normalizarValorAreasComunes(form.areasComunes),
    fechaConstruccion: form.fechaConstruccion ? form.fechaConstruccion.toISOString().split("T")[0] : "1990-01-01",
    codLetraMurosColumnas: letterCode(categories, "100101"), murosColumnas: "100101",
    codLetraTechos: letterCode(categories, "100102"), techos: "100102",
    codLetraPisos: letterCode(categories, "100201"), pisos: "100201",
    codLetraPuertasVentanas: letterCode(categories, "100202"), puertasVentanas: "100202",
    codLetraRevestimiento: letterCode(categories, "100203"), revestimiento: "100203",
    codLetraBanios: letterCode(categories, "100204"), banios: "100204",
    codLetraInstalacionesElectricas: letterCode(categories, "100301"), instalacionesElectricas: "100301",
    codEstadoConservacion: String(form.estadoConservacion || "9402").trim(),
    codMaterialEstructural: String(form.materialPredominante || "0701").trim(),
  };
};
