import { describe, expect, it } from "vitest";
import {
  adaptarDetalleEstadoCuenta,
  adaptarEstadoCuentaAnual,
  esEstadoCuentaAnualValido,
  extraerItemsEstadoCuenta,
} from "./cuentaCorriente.adapters";
import type { EstadoCuentaRaw } from "./cuentaCorrienteService";

const raw: EstadoCuentaRaw = {
  codContribuyente: 8,
  codPredio: 202630,
  anio: 2026,
  tributo: "Impuesto predial",
  grupoTributo: "Predial",
  totalCargos: 100,
  totalPagado: 40,
  saldoNeto: 60,
  cargo1: 0,
};

describe("adaptadores de cuenta corriente", () => {
  it("extrae listas directas y respuestas envueltas", () => {
    expect(extraerItemsEstadoCuenta([raw])).toEqual([raw]);
    expect(extraerItemsEstadoCuenta({ success: true, data: [raw] })).toEqual([raw]);
    expect(extraerItemsEstadoCuenta({ data: raw })).toEqual([raw]);
  });

  it("mantiene los ceros válidos y completa campos ausentes", () => {
    const anual = adaptarEstadoCuentaAnual(raw);
    const detalle = adaptarDetalleEstadoCuenta(raw);

    expect(anual.cargo1).toBe(0);
    expect(anual.cargo2).toBeNull();
    expect(detalle.cargo1).toBe(0);
    expect(detalle.cargo2).toBe(0);
  });

  it("valida que el registro tenga un año utilizable", () => {
    expect(esEstadoCuentaAnualValido(adaptarEstadoCuentaAnual(raw))).toBe(true);
    expect(esEstadoCuentaAnualValido(adaptarEstadoCuentaAnual({ ...raw, anio: 0 }))).toBe(false);
  });
});

