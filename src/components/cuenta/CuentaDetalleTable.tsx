import React from "react";
import {
  Alert, Box, Card, CardContent, Chip, CircularProgress, Divider, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
  alpha, useTheme,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import type { DetalleConcepto } from "./useCuentaDetalle";
import { formatearNumero } from "./useCuentaDetalle";

interface CuentaDetalleTableProps {
  anio: number | null;
  loading: boolean;
  error: string | null;
  tributos: Map<string, DetalleConcepto[]>;
  expandidos: Set<string>;
  onToggle: (key: string) => void;
}

const PERIODOS = Array.from({ length: 12 }, (_, index) => index + 1);
const valorPeriodo = (detalle: DetalleConcepto, periodo: number) => detalle[`col${periodo}` as keyof DetalleConcepto];

const COLUMNAS_FIJAS = {
  anio: { width: 80, left: 0 },
  grupo: { width: 150, left: 80 },
  tributo: { width: 250, left: 230 },
  concepto: { width: 120, left: 480 },
} as const;

const stickyBodyCellSx = (
  backgroundColor: string,
  left: number,
  width: number,
  isLast = false,
) => ({
  position: "sticky" as const,
  left,
  width,
  minWidth: width,
  maxWidth: width,
  zIndex: 2,
  backgroundColor,
  borderRight: isLast ? "2px solid" : "1px solid",
  borderRightColor: "divider",
  boxShadow: isLast ? "6px 0 8px -8px rgba(0,0,0,0.45)" : "none",
});

export const CuentaDetalleTable = ({ anio, loading, error, tributos, expandidos, onToggle }: CuentaDetalleTableProps) => {
  const theme = useTheme();
  const headerBackground = theme.palette.mode === "dark" ? "#0b3d32" : "#087f5b";
  const principalBackground = theme.palette.mode === "dark" ? "#17372f" : "#effaf6";
  const principalHover = theme.palette.mode === "dark" ? "#1d463b" : "#e2f6ee";
  const headerCellSx = {
    bgcolor: headerBackground,
    color: "common.white",
    fontWeight: 800,
    borderBottom: `2px solid ${theme.palette.success.light}`,
  };
  return (
    <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: alpha(theme.palette.primary.main, 0.25), boxShadow: `0 6px 22px ${alpha(theme.palette.primary.main, 0.08)}` }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={800} fontSize="1.05rem" color="primary.dark">
          <ReceiptLongIcon color="primary" sx={{ mr: 1, verticalAlign: "middle" }} />Detalle de conceptos {anio ? `— ${anio}` : ""}
        </Typography>
        <Divider sx={{ my: 2.5 }} />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
          : anio === null ? <Alert severity="info">Seleccione un año del resumen para consultar su detalle.</Alert>
          : tributos.size === 0 ? <Alert severity="warning">No existen conceptos para el año seleccionado.</Alert>
          : (
            <TableContainer
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: { xs: 360, sm: 420, md: 480 },
                overflowX: "auto",
                overflowY: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Table
                size="small"
                stickyHeader
                aria-label="Detalle de conceptos de cuenta corriente"
                sx={{ minWidth: 1750, borderCollapse: "separate" }}
              >
                <TableHead><TableRow>
                  {Object.entries(COLUMNAS_FIJAS).map(([key, column], index) => (
                    <TableCell
                      key={key}
                      sx={{
                        position: "sticky",
                        top: 0,
                        left: column.left,
                        width: column.width,
                        minWidth: column.width,
                        maxWidth: column.width,
                        zIndex: 5,
                        ...headerCellSx,
                        borderRight: index === 3 ? "2px solid" : "1px solid",
                        borderRightColor: alpha(theme.palette.common.white, 0.25),
                        boxShadow: index === 3 ? "6px 0 8px -8px rgba(0,0,0,0.45)" : "none",
                      }}
                    >
                      {key === "anio" ? "Año" : key === "grupo" ? "Grupo" : key === "tributo" ? "Tributo" : "Concepto"}
                    </TableCell>
                  ))}
                  {PERIODOS.map((periodo) => <TableCell key={periodo} align="center" sx={{ minWidth: 68, ...headerCellSx }}>{periodo}</TableCell>)}
                  <TableCell align="right" sx={{ minWidth: 110, ...headerCellSx, color: "warning.light" }}>Cargos</TableCell>
                  <TableCell align="right" sx={{ minWidth: 110, ...headerCellSx, color: "success.light" }}>Pagado</TableCell>
                  <TableCell align="right" sx={{ minWidth: 110, ...headerCellSx }}>Saldo</TableCell>
                </TableRow></TableHead>
                <TableBody>{Array.from(tributos.entries()).map(([key, conceptos]) => {
                  const expanded = expandidos.has(key);
                  const principal = conceptos[0];
                  return <React.Fragment key={key}>
                    <TableRow hover sx={{ bgcolor: principalBackground, "&:hover": { bgcolor: principalHover } }}>
                      <TableCell sx={{ ...stickyBodyCellSx(principalBackground, COLUMNAS_FIJAS.anio.left, COLUMNAS_FIJAS.anio.width), fontWeight: 700, color: "primary.dark" }}>{principal.anio}</TableCell>
                      <TableCell sx={{ ...stickyBodyCellSx(principalBackground, COLUMNAS_FIJAS.grupo.left, COLUMNAS_FIJAS.grupo.width), fontWeight: 600 }}>{principal.grupoTributo}</TableCell>
                      <TableCell sx={stickyBodyCellSx(principalBackground, COLUMNAS_FIJAS.tributo.left, COLUMNAS_FIJAS.tributo.width)}><Box display="flex" alignItems="center">
                        <IconButton size="small" color="primary" onClick={() => onToggle(key)} aria-label={expanded ? "Contraer tributo" : "Expandir tributo"}>
                          {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                        </IconButton><Typography variant="body2" fontWeight={700}>{principal.tributo}</Typography>
                      </Box></TableCell>
                      <TableCell sx={{ ...stickyBodyCellSx(principalBackground, COLUMNAS_FIJAS.concepto.left, COLUMNAS_FIJAS.concepto.width, true), color: "text.secondary", fontWeight: 600 }}>{conceptos.length / 3} tributo(s)</TableCell>
                      {PERIODOS.map((periodo) => {
                        const total = conceptos.reduce((sum, detalle) => {
                          if (detalle.concepto === "F. Venc") return sum;
                          const value = valorPeriodo(detalle, periodo);
                          return sum + (typeof value === "number" ? value : 0);
                        }, 0);
                        return <TableCell key={periodo} align="center" sx={{ fontWeight: total ? 700 : 400, color: total ? "text.primary" : "text.disabled" }}>{total ? formatearNumero(total) : "-"}</TableCell>;
                      })}
                      <TableCell align="right" sx={{ color: "warning.dark", fontWeight: 800, bgcolor: alpha(theme.palette.warning.main, 0.08) }}>{formatearNumero(principal.totalCargos)}</TableCell>
                      <TableCell align="right" sx={{ color: "success.dark", fontWeight: 800, bgcolor: alpha(theme.palette.success.main, 0.08) }}>{formatearNumero(principal.totalPagado)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: principal.saldoNeto > 0 ? "error.main" : "success.main" }}>{formatearNumero(principal.saldoNeto)}</TableCell>
                    </TableRow>
                    {expanded && conceptos.map((detalle, index) => {
                      const detalleBackground = theme.palette.mode === "dark"
                        ? detalle.concepto === "Cargo" ? "#342d1d" : detalle.concepto === "Pagado" ? "#17372f" : "#172f3c"
                        : detalle.concepto === "Cargo" ? "#fff8e6" : detalle.concepto === "Pagado" ? "#eefbf4" : "#eef8ff";
                      return <TableRow key={`${key}-${detalle.concepto}-${index}`} hover sx={{ bgcolor: detalleBackground }}>
                      <TableCell sx={stickyBodyCellSx(detalleBackground, COLUMNAS_FIJAS.anio.left, COLUMNAS_FIJAS.anio.width)} />
                      <TableCell sx={stickyBodyCellSx(detalleBackground, COLUMNAS_FIJAS.grupo.left, COLUMNAS_FIJAS.grupo.width)} />
                      <TableCell sx={stickyBodyCellSx(detalleBackground, COLUMNAS_FIJAS.tributo.left, COLUMNAS_FIJAS.tributo.width)} />
                      <TableCell sx={stickyBodyCellSx(detalleBackground, COLUMNAS_FIJAS.concepto.left, COLUMNAS_FIJAS.concepto.width, true)}><Chip label={detalle.concepto} size="small" variant="filled"
                        color={detalle.concepto === "Cargo" ? "warning" : detalle.concepto === "Pagado" ? "success" : "info"} /></TableCell>
                      {PERIODOS.map((periodo) => {
                        const value = valorPeriodo(detalle, periodo);
                        return <TableCell key={periodo} align="center">{detalle.concepto === "F. Venc"
                          ? typeof value === "string" ? value : "-"
                          : typeof value === "number" && value !== 0 ? formatearNumero(value) : "-"}</TableCell>;
                      })}
                      <TableCell align="right">{detalle.concepto === "Cargo" ? formatearNumero(detalle.totalCargos) : "-"}</TableCell>
                      <TableCell align="right">{detalle.concepto === "Pagado" ? formatearNumero(detalle.totalPagado) : "-"}</TableCell>
                      <TableCell align="right">{detalle.concepto === "F. Venc" ? "-" : formatearNumero(detalle.saldoNeto)}</TableCell>
                    </TableRow>;})}
                  </React.Fragment>;
                })}</TableBody>
              </Table>
            </TableContainer>
          )}
      </CardContent>
    </Card>
  );
};
