import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePUView } from "./usePUView";
import type { PUContributor } from "./pu.types";

const puHookMock = vi.hoisted(() => ({
  buscarPU: vi.fn(),
  precargarPU: vi.fn(),
  limpiarPU: vi.fn(),
}));

vi.mock("../../../hooks/usePU", () => ({
  usePU: () => ({
    puData: [{ codContribuyente: "27" }],
    loading: false,
    buscarPU: puHookMock.buscarPU,
    precargarPU: puHookMock.precargarPU,
    limpiarPU: puHookMock.limpiarPU,
  }),
}));

describe("usePUView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    puHookMock.buscarPU.mockResolvedValue([{ codContribuyente: "27" }]);
    puHookMock.precargarPU.mockResolvedValue(undefined);
  });

  it("limpia el filtro después de buscar y conserva el contribuyente para imprimir", async () => {
    const selected = {
      codigo: 27,
      contribuyente: "Contribuyente de prueba",
    } as PUContributor;
    const { result } = renderHook(() => usePUView());

    act(() => result.current.selectContributor(selected));
    expect(result.current.contributor?.codigo).toBe(27);

    await act(async () => {
      await result.current.search();
    });

    expect(puHookMock.buscarPU).toHaveBeenCalledWith({
      codContribuyente: "27",
    });
    expect(result.current.contributor).toBeNull();
    expect(result.current.searchedContributor?.codigo).toBe(27);
    expect(result.current.results).toHaveLength(1);
  });
});
