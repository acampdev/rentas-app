import { describe, expect, it } from "vitest";
import { createPrintPUStyles, formatPUNumber, numberOr } from "./printPU.utils";

describe("print PU utils", () => {
  it("formatea importes y valores inválidos", () => {
    expect(formatPUNumber("1234.5")).toBe("1,234.50");
    expect(formatPUNumber(null)).toBe("0.00");
  });

  it("mantiene los valores alternativos usados por el formato PU", () => {
    expect(numberOr("125", 10)).toBe(125);
    expect(numberOr("0", 10)).toBe(10);
  });

  it("genera el tamaño de página correspondiente", () => {
    expect(createPrintPUStyles("A4")).toContain("A4 portrait");
    expect(createPrintPUStyles("OFICIO")).toContain("legal portrait");
  });
});
