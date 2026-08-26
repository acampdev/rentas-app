import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PrintPUSelector } from "./PrintPUSelector";
import type { PrintablePUData } from "./printPU.types";

const createItem = (
  nivelPiso: string,
  codPredio = "",
): PrintablePUData =>
  ({ nivelPiso, codPredio }) as PrintablePUData;

describe("PrintPUSelector", () => {
  it("mantiene la vista actual sin pestañas cuando existe una sola fila", () => {
    render(
      <PrintPUSelector
        items={[createItem("1")]}
        selectedIndex={0}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("crea una pestaña por fila y permite seleccionar el PU", () => {
    const onSelect = vi.fn();
    render(
      <PrintPUSelector
        items={[createItem("1"), createItem("2"), createItem("3")]}
        selectedIndex={0}
        onSelect={onSelect}
      />,
    );

    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: "PU 1 · Piso 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    fireEvent.click(screen.getByRole("tab", { name: "PU 2 · Piso 2" }));
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
