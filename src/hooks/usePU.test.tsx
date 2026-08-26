import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestQueryWrapper } from "../test/queryClient";
import { usePU } from "./usePU";

const serviceMock = vi.hoisted(() => ({
  buscarPU: vi.fn(),
}));

vi.mock("../services/puService", () => ({
  puService: serviceMock,
}));

describe("usePU", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("precarga y reutiliza el resultado al buscar sin repetir la petición", async () => {
    serviceMock.buscarPU.mockResolvedValue([
      { codPredio: "", codContribuyente: "27", direccion: "Manuel Arevalo" },
    ]);
    const { wrapper } = createTestQueryWrapper();
    const { result } = renderHook(() => usePU(), { wrapper });

    await act(async () => {
      await result.current.precargarPU({ codContribuyente: "27" });
    });

    await act(async () => {
      await result.current.buscarPU({ codContribuyente: "27" });
    });
    expect(result.current.puData).toHaveLength(1);

    await act(async () => {
      await result.current.buscarPU({ codContribuyente: "27" });
    });

    expect(serviceMock.buscarPU).toHaveBeenCalledTimes(1);
    expect(serviceMock.buscarPU).toHaveBeenLastCalledWith({
      codContribuyente: "27",
    });
  });
});
