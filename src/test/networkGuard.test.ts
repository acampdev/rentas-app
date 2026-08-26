import { describe, expect, it } from "vitest";
import { UNSIMULATED_HTTP_ERROR } from "./setup";

describe("protección de red en pruebas", () => {
  it("falla inmediatamente cuando fetch no fue simulado por la prueba", () => {
    expect(() => fetch("https://example.invalid/api")).toThrow(
      UNSIMULATED_HTTP_ERROR,
    );
  });
});
