import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { normalizarAsignacion } from "../../../services/asignacion.adapters";
import { ConsultaAsignacionTable } from "./ConsultaAsignacionTable";

describe("ConsultaAsignacionTable", () => {
  it("muestra datos reales y entrega la asignación en las acciones", () => {
    const item = normalizarAsignacion({
      anio: 2026,
      codPredio: "202628",
      codContribuyente: 20,
      nombreContribuyente: "Mantilla Miñano Gustavo",
      direccionCompleta: "Urb. Manuel Arévalo",
    });
    const onEditar = vi.fn();
    const onDesasignar = vi.fn();
    render(
      <ConsultaAsignacionTable
        asignaciones={[item]}
        loading={false}
        hasFilters
        onEditar={onEditar}
        onDesasignar={onDesasignar}
      />,
    );

    expect(screen.getByRole("table", { name: "Predios asignados" })).toBeInTheDocument();
    expect(screen.getByText("Mantilla Miñano Gustavo")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /editar predio/i }));
    fireEvent.click(screen.getByRole("button", { name: /desasignar predio/i }));
    expect(onEditar).toHaveBeenCalledWith(item);
    expect(onDesasignar).toHaveBeenCalledWith(item);
  });
});

