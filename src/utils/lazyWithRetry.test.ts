import { describe, expect, it } from "vitest";
import { isRecoverableChunkError } from "./lazyWithRetry";

describe("isRecoverableChunkError", () => {
  it("reconoce el error que Vite genera al perder un módulo diferido", () => {
    expect(isRecoverableChunkError(new TypeError("error loading dynamically imported module"))).toBe(true);
    expect(isRecoverableChunkError(new TypeError("Failed to fetch dynamically imported module"))).toBe(true);
  });

  it("no recarga ante errores funcionales del componente", () => {
    expect(isRecoverableChunkError(new Error("Maximum update depth exceeded"))).toBe(false);
  });
});
