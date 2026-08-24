import {
  CategoriaValorUnitario,
  getCategoriaDescription,
  getSubcategoriaDescription,
  LetraValorUnitario,
  SUBCATEGORIAS_POR_CATEGORIA,
} from "./valorUnitario.catalog";
import type {
  BusquedaValorUnitarioParams,
  CrearValorUnitarioApiDTO,
  UpdateValorUnitarioDTO,
  ValorUnitarioApiResponse,
  ValorUnitarioData,
  ValorUnitarioEstadisticas,
  ValorUnitarioRaw,
  ValoresPorCategoria,
} from "./valorUnitario.types";

export const normalizeValorUnitario = (
  item: ValorUnitarioRaw,
  index: number,
): ValorUnitarioData => {
  const categoria = item.codCategoria ?? item.categoria ?? "";
  const subcategoria = item.codSubcategoria ?? item.subcategoria ?? "";

  return {
    id: String(
      item.codigoValorUnitario ?? item.codValorUnitario ?? item.id ?? index + 1,
    ),
    año: item.anio ?? item.año ?? new Date().getFullYear(),
    categoria,
    subcategoria,
    letra: item.letra ?? item.codLetra ?? "A",
    costo: Number(item.costo ?? 0),
    descripcionCategoria:
      item.descripcionCategoria ?? getCategoriaDescription(categoria),
    descripcionSubcategoria:
      item.descripcionSubcategoria ?? getSubcategoriaDescription(subcategoria),
    estado: item.estado ?? "ACTIVO",
    fechaRegistro: item.fechaRegistro,
    fechaModificacion: item.fechaModificacion,
    codUsuario: item.codUsuario,
  };
};

export const isValidValorUnitario = (item: ValorUnitarioData): boolean =>
  item.año > 1990 &&
  item.año <= 2100 &&
  Boolean(item.categoria && item.subcategoria && item.letra) &&
  item.costo >= 0;

export const unwrapValorUnitarioResponse = (
  response: ValorUnitarioApiResponse,
): ValorUnitarioRaw[] => {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== "object") return [];
  if ("data" in response || "success" in response) {
    const wrapped = response as {
      data?: ValorUnitarioRaw[] | ValorUnitarioRaw | null;
    };
    if (Array.isArray(wrapped.data)) return wrapped.data;
    return wrapped.data ? [wrapped.data] : [];
  }
  return [response as ValorUnitarioRaw];
};

export const filterValoresUnitarios = (
  values: ValorUnitarioData[],
  criteria: BusquedaValorUnitarioParams,
): ValorUnitarioData[] =>
  values.filter(
    (value) =>
      (!criteria.categoria || value.categoria === criteria.categoria) &&
      (!criteria.subcategoria ||
        value.subcategoria === criteria.subcategoria) &&
      (!criteria.letra || value.letra === criteria.letra) &&
      (!criteria.estado || value.estado === criteria.estado),
  );

export const createValoresPorCategoria = (
  values: ValorUnitarioData[],
): ValoresPorCategoria => {
  const result: ValoresPorCategoria = {};

  Object.values(CategoriaValorUnitario).forEach((category) => {
    result[category] = {};
    SUBCATEGORIAS_POR_CATEGORIA[category].forEach((subcategory) => {
      result[category][subcategory] = {};
      Object.values(LetraValorUnitario).forEach((letter) => {
        result[category][subcategory][letter] = 0;
      });
    });
  });

  values.forEach((value) => {
    if (result[value.categoria]?.[value.subcategoria]) {
      result[value.categoria][value.subcategoria][value.letra] = value.costo;
    }
  });
  return result;
};

export const createValorUnitarioPayload = (
  data: Omit<
    CrearValorUnitarioApiDTO,
    "codigoValorUnitario" | "codigoValorUnitarioAnterior"
  >,
): CrearValorUnitarioApiDTO => ({
  codigoValorUnitario: null,
  codigoValorUnitarioAnterior: null,
  anio: Number(data.anio),
  codLetra: String(data.codLetra),
  codCategoria: String(data.codCategoria),
  codSubcategoria: String(data.codSubcategoria),
  costo: Number(data.costo),
});

export const validateCreateValorUnitario = (
  data: CrearValorUnitarioApiDTO,
): void => {
  if (
    !data.anio ||
    !data.codLetra ||
    !data.codCategoria ||
    !data.codSubcategoria ||
    data.costo === undefined
  ) {
    throw new Error("Faltan datos requeridos para crear el valor unitario");
  }
};

export const validateUpdateValorUnitario = (
  data: UpdateValorUnitarioDTO,
): void => {
  if (data.año !== undefined && (data.año < 1990 || data.año > 2100)) {
    throw new Error("El año debe estar entre 1990 y 2100");
  }
  if (data.costo !== undefined && data.costo < 0) {
    throw new Error("El costo no puede ser negativo");
  }
};

export const createValorUnitarioStatistics = (
  values: ValorUnitarioData[],
): ValorUnitarioEstadisticas => {
  const statistics: ValorUnitarioEstadisticas = {
    total: values.length,
    activos: values.filter((value) => value.estado === "ACTIVO").length,
    inactivos: values.filter((value) => value.estado === "INACTIVO").length,
    porCategoria: {},
    porSubcategoria: {},
    costoPromedio: 0,
    añosDisponibles: [...new Set(values.map((value) => value.año))].sort(
      (a, b) => b - a,
    ),
  };

  values.forEach((value) => {
    statistics.porCategoria[value.categoria] =
      (statistics.porCategoria[value.categoria] ?? 0) + 1;
    statistics.porSubcategoria[value.subcategoria] =
      (statistics.porSubcategoria[value.subcategoria] ?? 0) + 1;
  });

  if (values.length) {
    statistics.costoPromedio =
      values.reduce((total, value) => total + value.costo, 0) / values.length;
  }
  return statistics;
};
