import type { ValorUnitarioData } from "../../../services/valorUnitarioService";
import type { SubcategoriaMatriz } from "./valorUnitarioList.types";

export const LETRAS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
export const SUBCATEGORIAS: SubcategoriaMatriz[] = [
  { cod: "100101", nombre: "MUROS Y COLUMNAS", equivalentes: [] },
  { cod: "100102", nombre: "TECHOS", equivalentes: [] },
  { cod: "100201", nombre: "PISOS", equivalentes: [] },
  { cod: "100202", nombre: "PUERTAS Y VENTANAS", equivalentes: [] },
  { cod: "100203", nombre: "REVESTIMIENTOS", equivalentes: [] },
  { cod: "100204", nombre: "BAÑOS", equivalentes: [] },
  {
    cod: "100301",
    nombre: "INSTALACIONES ELÉCTRICAS Y SANITARIAS",
    equivalentes: ["INSTALACIONES ELECTRICAS Y SANITARIAS"],
  },
];

export function findUnitValue(
  values: ValorUnitarioData[],
  letter: string,
  category: SubcategoriaMatriz,
) {
  return values.find((value) => {
    const valueLetter = String(value.letra).trim().toUpperCase();
    const subcategory = String(value.subcategoria).trim().toUpperCase();
    return (
      valueLetter === letter &&
      (subcategory === category.cod ||
        subcategory === category.nombre ||
        category.equivalentes.includes(subcategory))
    );
  });
}

export function costStyle(cost: number, exists: boolean) {
  if (!exists)
    return {
      bgcolor: "transparent",
      color: "#cbd5e1",
      border: "1px dashed #e2e8f0",
    };
  if (cost < 50)
    return {
      bgcolor: "#e6fcf5",
      color: "#0ca678",
      border: "1px solid #c3fae8",
    };
  if (cost <= 100)
    return {
      bgcolor: "#fff4e6",
      color: "#d9480f",
      border: "1px solid #ffe8cc",
    };
  return { bgcolor: "#fff0f6", color: "#c2255c", border: "1px solid #ffdeeb" };
}
