import { describe, expect, it } from "vitest";
import {
  createValorUnitarioStatistics,
  normalizeValorUnitario,
  unwrapValorUnitarioResponse,
  validateUpdateValorUnitario,
} from "./valorUnitario.adapters";

describe("valorUnitario adapters", () => {
  it("conserva identificadores largos como texto y normaliza códigos del API", () => {
    const value = normalizeValorUnitario(
      {
        codigoValorUnitario: "202411011001100101",
        anio: 2024,
        codCategoria: "ESTRUCTURAS",
        codSubcategoria: "MUROS_Y_COLUMNAS",
        codLetra: "A",
        costo: "120.50",
      },
      0,
    );

    expect(value.id).toBe("202411011001100101");
    expect(value.costo).toBe(120.5);
    expect(value.descripcionCategoria).toBe("Estructuras");
  });

  it("extrae arreglos, respuestas envueltas y elementos individuales", () => {
    const raw = { anio: 2026, codCategoria: "ACABADOS" };
    expect(unwrapValorUnitarioResponse([raw])).toEqual([raw]);
    expect(unwrapValorUnitarioResponse({ success: true, data: raw })).toEqual([
      raw,
    ]);
    expect(unwrapValorUnitarioResponse(raw)).toEqual([raw]);
  });

  it("calcula estadísticas sin inventar registros", () => {
    const values = [
      normalizeValorUnitario(
        {
          anio: 2026,
          codCategoria: "ACABADOS",
          codSubcategoria: "PISOS",
          costo: 10,
        },
        0,
      ),
      normalizeValorUnitario(
        {
          anio: 2025,
          codCategoria: "ACABADOS",
          codSubcategoria: "PISOS",
          costo: 20,
          estado: "INACTIVO",
        },
        1,
      ),
    ];
    expect(createValorUnitarioStatistics(values)).toMatchObject({
      total: 2,
      activos: 1,
      inactivos: 1,
      costoPromedio: 15,
      añosDisponibles: [2026, 2025],
    });
  });

  it("rechaza años y costos inválidos al actualizar", () => {
    expect(() => validateUpdateValorUnitario({ año: 1989 })).toThrow();
    expect(() => validateUpdateValorUnitario({ costo: -1 })).toThrow();
  });
});
