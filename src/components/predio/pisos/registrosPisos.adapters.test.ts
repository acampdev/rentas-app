import { describe, expect, it } from "vitest";
import type { Predio } from "../../../models/Predio";
import type { ValorUnitarioData } from "../../../services/valorUnitarioService";
import {
  buscarValorUnitarioPiso,
  crearPayloadPiso,
  crearPisoFormInicial,
  DEFAULT_PISO_DICTIONARIES,
} from "./registrosPisos.adapters";

describe("adaptadores del registro de pisos", () => {
  it("encuentra el valor unitario por códigos y letra", () => {
    const values: ValorUnitarioData[] = [{ id: "1", año: 2026, categoria: "1001", subcategoria: "100101", letra: "1101", costo: 648.79 }];
    const result = buscarValorUnitarioPiso(
      { value: "1001", label: "ESTRUCTURAS" },
      { value: "100101", label: "MUROS Y COLUMNAS" },
      { value: "A", label: "A", id: "1101" },
      2026,
      values,
      DEFAULT_PISO_DICTIONARIES,
    );
    expect(result).toBe(648.79);
  });

  it("construye el payload sin perder el valor de áreas comunes", () => {
    const form = { ...crearPisoFormInicial(2026), descripcion: "2", fechaConstruccion: new Date(2020, 0, 16), estadoConservacion: "9401", materialPredominante: "0701", areaConstruida: "160", areasComunes: "200.50" };
    const predio: Predio = { codigoPredio: "28", codPredioBase: "28", anio: 2026, condicionPropiedad: "", conductor: "", areaTerreno: 200 };
    const category = (child: string, letter = "1101") => ({ id: child, padre: { value: child.startsWith("1001") ? "1001" : child.startsWith("1002") ? "1002" : "1003", label: "Categoría" }, hijo: { value: child, label: child }, letra: { value: "A", label: "A", id: letter }, fechaCreacion: new Date(), valor: 1 });
    const categories = ["100101", "100102", "100201", "100202", "100203", "100204", "100301"].map((child) => category(child));

    expect(crearPayloadPiso(form, predio, categories)).toMatchObject({
      anio: 2026,
      codPredio: "202628",
      numeroPiso: 2,
      areaConstruida: 160,
      valorAreasComunes: "200.50",
    });
  });
});
