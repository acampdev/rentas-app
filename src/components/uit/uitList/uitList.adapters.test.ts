import { describe, expect, it } from "vitest";
import type { UITData } from "../../../services/uitService";
import {
  filterUits,
  formatUitNumber,
  parseUitSearchYear,
} from "./uitList.adapters";

const uits: UITData[] = [
  { id: 1, anio: 2025, valor: 5350 },
  { id: 2, anio: 2026, valor: 5500, valorUit: 5520 },
];

describe("uitList adapters", () => {
  it("acepta solamente años de cuatro dígitos dentro del rango permitido", () => {
    expect(parseUitSearchYear(" 2026 ")).toBe(2026);
    expect(parseUitSearchYear("89")).toBeNull();
    expect(parseUitSearchYear("2101")).toBeNull();
    expect(parseUitSearchYear("20a6")).toBeNull();
  });

  it("filtra por año y por el valor UIT efectivo", () => {
    expect(filterUits(uits, "2025")).toEqual([uits[0]]);
    expect(filterUits(uits, "5520")).toEqual([uits[1]]);
    expect(filterUits(uits, "")).toBe(uits);
  });

  it("formatea números con dos decimales", () => {
    expect(formatUitNumber(5500)).toMatch(/5[,.]500[,.]00/);
  });
});
