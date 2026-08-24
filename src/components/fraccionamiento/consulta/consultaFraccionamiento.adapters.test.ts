import { describe, expect, it } from "vitest";
import type { Fraccionamiento } from "../../../types/fraccionamiento.types";
import {
  formatMoney,
  formatPercentage,
  isSelectedFraccionamiento,
  paginateFraccionamientos,
} from "./consultaFraccionamiento.adapters";

const createRow = (id?: number): Fraccionamiento => ({ id }) as Fraccionamiento;

describe("consulta fraccionamiento adapters", () => {
  it("pagina los resultados sin alterar su orden", () => {
    const rows = [createRow(1), createRow(2), createRow(3)];
    expect(paginateFraccionamientos(rows, 1, 2)).toEqual([rows[2]]);
  });

  it("formatea montos y porcentajes incluso cuando falta el valor", () => {
    expect(formatMoney(12.5)).toBe("S/ 12.50");
    expect(formatMoney()).toBe("S/ 0.00");
    expect(formatPercentage(1.2)).toBe("1.20 %");
  });

  it("compara por identificador y evita seleccionar filas sin identidad", () => {
    expect(isSelectedFraccionamiento(createRow(2), createRow(2))).toBe(true);
    expect(isSelectedFraccionamiento(createRow(2), createRow(3))).toBe(false);
    expect(isSelectedFraccionamiento(null, createRow(2))).toBe(false);
  });
});
