export enum CategoriaValorUnitario {
  ESTRUCTURAS = "ESTRUCTURAS",
  ACABADOS = "ACABADOS",
  INSTALACIONES = "INSTALACIONES",
}

export enum SubcategoriaValorUnitario {
  MUROS_Y_COLUMNAS = "MUROS_Y_COLUMNAS",
  TECHOS = "TECHOS",
  PISOS = "PISOS",
  PUERTAS_Y_VENTANAS = "PUERTAS_Y_VENTANAS",
  REVESTIMIENTOS = "REVESTIMIENTOS",
  BANOS = "BANOS",
  INSTALACIONES_ELECTRICAS_Y_SANITARIAS = "INSTALACIONES_ELECTRICAS_Y_SANITARIAS",
}

export enum LetraValorUnitario {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
}

export const SUBCATEGORIAS_POR_CATEGORIA = {
  [CategoriaValorUnitario.ESTRUCTURAS]: [
    SubcategoriaValorUnitario.MUROS_Y_COLUMNAS,
    SubcategoriaValorUnitario.TECHOS,
  ],
  [CategoriaValorUnitario.ACABADOS]: [
    SubcategoriaValorUnitario.PISOS,
    SubcategoriaValorUnitario.PUERTAS_Y_VENTANAS,
    SubcategoriaValorUnitario.REVESTIMIENTOS,
    SubcategoriaValorUnitario.BANOS,
  ],
  [CategoriaValorUnitario.INSTALACIONES]: [
    SubcategoriaValorUnitario.INSTALACIONES_ELECTRICAS_Y_SANITARIAS,
  ],
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  ESTRUCTURAS: "Estructuras",
  ACABADOS: "Acabados",
  INSTALACIONES: "Instalaciones",
};

const SUBCATEGORY_DESCRIPTIONS: Record<string, string> = {
  "MUROS Y COLUMNAS": "Muros y Columnas",
  MUROS_Y_COLUMNAS: "Muros y Columnas",
  TECHOS: "Techos",
  PISOS: "Pisos",
  "PUERTAS Y VENTANAS": "Puertas y Ventanas",
  PUERTAS_Y_VENTANAS: "Puertas y Ventanas",
  REVESTIMIENTOS: "Revestimientos",
  BANOS: "Baños",
  "INSTALACIONES ELECTRICAS Y SANITARIAS":
    "Instalaciones Eléctricas y Sanitarias",
  INSTALACIONES_ELECTRICAS_Y_SANITARIAS:
    "Instalaciones Eléctricas y Sanitarias",
};

export const getCategoriaDescription = (category: string): string =>
  CATEGORY_DESCRIPTIONS[category] ?? category;

export const getSubcategoriaDescription = (subcategory: string): string =>
  SUBCATEGORY_DESCRIPTIONS[subcategory] ?? subcategory;
