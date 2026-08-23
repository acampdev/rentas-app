import { Home as HomeIcon } from "@mui/icons-material";
import { Chip, Tooltip, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { AsignacionPredio } from "../../../services/asignacionService";

export interface AsignacionColumn {
  key: string;
  label: string;
  width: number;
  align?: "left" | "center" | "right";
  render: (row: AsignacionPredio) => ReactNode;
}

export const formatCurrency = (value: number | null | undefined) =>
  `S/ ${(value ?? 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const clippedText = (value: string | null | undefined) => (
  <Tooltip title={value ?? ""} arrow>
    <Typography variant="body2" noWrap fontSize="0.75rem">{value || "N/A"}</Typography>
  </Tooltip>
);

export const ASIGNACION_COLUMNS: AsignacionColumn[] = [
  { key: "anio", label: "AÑO", width: 70, align: "center", render: (row) => <Chip label={row.anio} size="small" variant="outlined" sx={{ fontWeight: 700 }} /> },
  { key: "predio", label: "CÓD. PREDIO", width: 115, render: (row) => <Chip icon={<HomeIcon />} label={row.codPredio.trim()} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700 }} /> },
  { key: "contribuyente", label: "CONTRIBUYENTE", width: 200, render: (row) => clippedText(row.nombreContribuyente) },
  { key: "direccion", label: "DIRECCIÓN", width: 250, render: (row) => clippedText(row.direccionCompleta) },
  { key: "autoavaluo", label: "AUTOAVALÚO", width: 115, align: "right", render: (row) => <Typography fontSize="0.75rem" fontWeight={700} color="success.main">{formatCurrency(row.autoavaluo)}</Typography> },
  { key: "base", label: "BASE IMP.", width: 110, align: "right", render: (row) => formatCurrency(row.baseImponible) },
  { key: "impuesto", label: "IMP. ANUAL", width: 110, align: "right", render: (row) => <Typography fontSize="0.75rem" fontWeight={700} color="error.main">{formatCurrency(row.impuestoAnual)}</Typography> },
  { key: "condominio", label: "% COND.", width: 95, align: "center", render: (row) => <Chip label={row.porcentajeCondominoDesc || `${row.porcentajeCondomino ?? 100}%`} size="small" color="info" variant="outlined" /> },
  { key: "declaracion", label: "F. DECLARACIÓN", width: 115, align: "center", render: (row) => row.fechaDeclaracionStr || "N/A" },
  { key: "venta", label: "F. VENTA", width: 105, align: "center", render: (row) => row.fechaVentaStr || "N/A" },
  { key: "modo", label: "MODO DECL.", width: 135, align: "center", render: (row) => <Chip label={row.modoDeclaracion || row.codModoDeclaracion || "N/A"} size="small" variant="outlined" /> },
  { key: "pensionista", label: "PENSIONISTA", width: 100, align: "center", render: (row) => <Chip label={row.pensionistaDesc || (row.pensionista === 1 ? "Sí" : "No")} size="small" color={row.pensionista === 1 ? "success" : "default"} /> },
  { key: "estado", label: "ESTADO", width: 95, align: "center", render: (row) => <Chip label={row.estado || "ACTIVO"} size="small" color={row.estado === "ACTIVO" || row.codEstado === "0201" ? "success" : "error"} /> },
];

