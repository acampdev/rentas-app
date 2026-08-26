import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CuentaDetalleTable } from "./CuentaDetalleTable";
import type { DetalleConcepto } from "./useCuentaDetalle";

vi.mock("@mui/icons-material/ChevronRight", () => ({ default: () => null }));
vi.mock("@mui/icons-material/ExpandMore", () => ({ default: () => null }));
vi.mock("@mui/icons-material/ReceiptLong", () => ({ default: () => null }));

vi.mock("@mui/material", () => {
  const container = (Tag: React.ElementType) => ({
    children,
    sx: _sx,
    alignItems: _alignItems,
    hover: _hover,
    stickyHeader: _stickyHeader,
    ...props
  }: {
    children?: React.ReactNode;
    sx?: unknown;
    alignItems?: unknown;
    hover?: unknown;
    stickyHeader?: unknown;
  }) => <Tag {...props}>{children}</Tag>;
  return {
    Alert: container("div"),
    Box: container("div"),
    Card: container("section"),
    CardContent: container("div"),
    Chip: ({ label }: { label: React.ReactNode }) => <span>{label}</span>,
    CircularProgress: () => null,
    Divider: () => <hr />,
    IconButton: ({ children, sx: _sx, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { sx?: unknown }) => (
      <button {...props}>{children}</button>
    ),
    Table: container("table"),
    TableBody: container("tbody"),
    TableCell: container("th"),
    TableContainer: container("div"),
    TableHead: container("thead"),
    TableRow: container("tr"),
    Typography: container("div"),
    alpha: (color: string) => color,
    useTheme: () => ({
      palette: {
        mode: "light",
        common: { white: "#fff" },
        primary: { main: "#087f5b" },
        success: { light: "#20c997", main: "#12b886" },
        warning: { main: "#fab005" },
      },
    }),
  };
});

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

describe("CuentaDetalleTable", () => {
  it("mantiene las columnas de identidad y solicita expandir el tributo", () => {
    const onToggle = vi.fn();
    render(
      <CuentaDetalleTable
        anio={2026}
        loading={false}
        error={null}
        tributos={new Map([["Arbitrios:Serenazgo", [crearDetalle("Cargo")]]])}
        expandidos={new Set()}
        onToggle={onToggle}
      />,
    );

    expect(screen.getByRole("table", { name: /detalle de conceptos/i })).toBeInTheDocument();
    ["Año", "Grupo", "Tributo", "Concepto"].forEach((header) =>
      expect(screen.getByRole("columnheader", { name: header })).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Expandir tributo" }));
    expect(onToggle).toHaveBeenCalledWith("Arbitrios:Serenazgo");
  });
});
