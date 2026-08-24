import { describe, expect, it } from "vitest";
import type { HRData } from "../../../../services/hrService";
import {
  calculateHRTotals,
  formatHRNumber,
  getHRPrintStyles,
} from "./printHR.utils";

const row = (values: Partial<HRData>): HRData => ({
  codPredio: "20261",
  codContribuyente: "1",
  nombreContribuyenteCompleto: "Contribuyente",
  numeroDocumento: "12345678",
  nombreRepresentanteOConyuge: null,
  numeroDocumentoRepresentanteOConyuge: null,
  direccionFiscal: "Dirección",
  tipoContribuyente: "NATURAL",
  codPredioBase: "1",
  tipoPredio: "URBANO",
  porcentajeCondomino: "100",
  autoavaluo: "0",
  baseImponible: "0",
  impuestoPredial: "0",
  impuestoMensual: "0",
  impuestoTrimestral: "0",
  ...values,
});

describe("printHR utils", () => {
  it("calcula los totales del documento sin valores ficticios", () => {
    expect(
      calculateHRTotals([
        row({
          autoavaluo: "100.50",
          impuestoPredial: "10",
          impuestoTrimestral: "2.5",
        }),
        row({
          autoavaluo: "200",
          impuestoPredial: "20",
          impuestoTrimestral: "5",
        }),
      ]),
    ).toEqual({
      autoavaluo: 300.5,
      impuestoAnual: 30,
      impuestoTrimestral: 7.5,
    });
  });

  it("formatea entradas inválidas como cero", () => {
    expect(formatHRNumber(undefined)).toBe("0.00");
  });

  it("configura el tamaño legal para oficio", () => {
    expect(getHRPrintStyles("OFICIO")).toContain("legal portrait");
  });
});
