import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { CuentaDetalleTable } from "./CuentaDetalleTable";
import type { DetalleConcepto } from "./useCuentaDetalle";

const crearDetalle = (
  concepto: DetalleConcepto["concepto"],
): DetalleConcepto => ({
  anio: 2026,
  grupoTributo: "Arbitrios",
  tributo: "Serenazgo",
  concepto,
  totalCargos: 120,
  totalPagado: 20,
  saldoNeto: 100,
  col1: concepto === "F. Venc" ? "31/01/2026" : 10,
  col2: 0, col3: 0, col4: 0, col5: 0, col6: 0,
  col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0,
});

const Fixture = () => {
  const [expandidos, setExpandidos] = useState<Set<string>>(() => new Set());
  const key = "Arbitrios:Serenazgo";
  const tributos = new Map([
    [key, [crearDetalle("Cargo"), crearDetalle("Pagado"), crearDetalle("F. Venc")]],
  ]);
  return (
    <CuentaDetalleTable
      anio={2026}
      loading={false}
      error={null}
      tributos={tributos}
      expandidos={expandidos}
      onToggle={(selectedKey) =>
        setExpandidos((current) => {
          const next = new Set(current);
          if (next.has(selectedKey)) next.delete(selectedKey);
          else next.add(selectedKey);
          return next;
        })
      }
    />
  );
};

describe("CuentaDetalleTable", () => {
  it("mantiene las columnas de identidad y permite expandir sus conceptos", () => {
    render(<Fixture />);

    expect(screen.getByRole("table", { name: /detalle de conceptos/i })).toBeInTheDocument();
    ["Año", "Grupo", "Tributo", "Concepto"].forEach((header) =>
      expect(screen.getByRole("columnheader", { name: header })).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Expandir tributo" }));
    expect(screen.getByText("Cargo")).toBeInTheDocument();
    expect(screen.getAllByText("Pagado")).toHaveLength(2);
    expect(screen.getByText("F. Venc")).toBeInTheDocument();
  });
});
