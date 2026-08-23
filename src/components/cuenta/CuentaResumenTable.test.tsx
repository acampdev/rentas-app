import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CuentaResumenTable } from "./CuentaResumenTable";
import type { EstadoCuentaAnual } from "../../services/cuentaCorrienteService";

const row = {
  codContribuyente: 8,
  codPredio: 202630,
  anio: 2026,
  totalPredial: 100,
  totalArbitrial: 80,
  tributo: null,
  grupoTributo: null,
  totalCargos: 180,
  totalPagado: 50,
  saldoNeto: 130,
} as EstadoCuentaAnual;

describe("CuentaResumenTable", () => {
  it("muestra los importes y permite seleccionar el año", () => {
    const onSeleccionarAnio = vi.fn();
    render(
      <CuentaResumenTable
        rows={[row]}
        loading={false}
        busquedaRealizada
        codigoContribuyente="8"
        anioSeleccionado={null}
        onSeleccionarAnio={onSeleccionarAnio}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "Total Pagado" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("2026"));
    expect(onSeleccionarAnio).toHaveBeenCalledWith(2026);
    expect(screen.getByText("S/ 130.00")).toBeInTheDocument();
  });
});

