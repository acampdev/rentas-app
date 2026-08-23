import {
  Alert, Box, Card, CardContent, Chip, CircularProgress, Divider, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
  alpha, useTheme,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import type { EstadoCuentaAnual } from "../../services/cuentaCorrienteService";
import { formatearNumero } from "./useCuentaDetalle";

interface CuentaResumenTableProps {
  rows: EstadoCuentaAnual[];
  loading: boolean;
  busquedaRealizada: boolean;
  codigoContribuyente: string;
  anioSeleccionado: number | null;
  onSeleccionarAnio: (anio: number) => void;
}

const HEADERS = [
  ["Año", "center"], ["Total Predial", "right"], ["Total Arbitrial", "right"],
  ["Total Cargos", "right"], ["Total Pagado", "right"], ["Saldo Neto", "right"],
] as const;

export const CuentaResumenTable = ({ rows, loading, busquedaRealizada,
  codigoContribuyente, anioSeleccionado, onSeleccionarAnio }: CuentaResumenTableProps) => {
  const theme = useTheme();
  const headerBackground = theme.palette.mode === "dark" ? "#0b3d32" : "#087f5b";
  return (
    <Card sx={{ mb: 4, borderRadius: 3, border: "1px solid", borderColor: alpha(theme.palette.primary.main, 0.25), boxShadow: `0 6px 22px ${alpha(theme.palette.primary.main, 0.08)}` }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={800} fontSize="1.05rem" color="primary.dark">
            <AssessmentIcon color="primary" sx={{ mr: 1, verticalAlign: "middle" }} />
            Resumen de Estado de Cuenta Anual
          </Typography>
          {rows.length > 0 && <Chip label={`${rows.length} años registrados`} size="small" color="primary" sx={{ fontWeight: 700 }} />}
        </Box>
        <Divider sx={{ my: 2.5 }} />
        {loading && busquedaRealizada ? (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, py: 4 }}>
            <CircularProgress size={28} /><Typography color="text.secondary">Consultando el estado de cuenta...</Typography>
          </Box>
        ) : rows.length === 0 ? (
          <Alert severity={busquedaRealizada ? "warning" : "info"}>
            {busquedaRealizada
              ? `El contribuyente ${codigoContribuyente} no tiene registros de estado de cuenta.`
              : "Seleccione un contribuyente y haga clic en Buscar para visualizar el estado de cuenta anual."}
          </Alert>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: alpha(theme.palette.primary.main, 0.2), borderRadius: 2, overflow: "hidden" }}>
            <Table size="small" sx={{ minWidth: 750 }}>
              <TableHead><TableRow>{HEADERS.map(([label, align]) => (
                <TableCell
                  key={label}
                  align={align}
                  sx={{
                    fontWeight: 800,
                    bgcolor: headerBackground,
                    color: label === "Total Cargos" ? "warning.light" : label === "Total Pagado" ? "success.light" : "common.white",
                    borderBottom: `2px solid ${theme.palette.success.light}`,
                    borderRight: "1px solid",
                    borderRightColor: alpha(theme.palette.common.white, 0.18),
                    py: 1.4,
                  }}
                >
                  {label}
                </TableCell>
              ))}</TableRow></TableHead>
              <TableBody>{rows.map((row, index) => {
                const selected = anioSeleccionado === row.anio;
                return (
                  <TableRow key={`${row.anio}-${row.codPredio ?? index}`} hover selected={selected}
                    onClick={() => onSeleccionarAnio(row.anio)}
                    sx={{
                      cursor: "pointer",
                      bgcolor: index % 2 === 0 ? "background.paper" : alpha(theme.palette.primary.main, 0.035),
                      transition: "background-color 0.2s ease",
                      "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.09) },
                      "&.Mui-selected, &.Mui-selected:hover": { bgcolor: alpha(theme.palette.primary.main, 0.16) },
                    }}>
                    <TableCell align="center" sx={{ fontWeight: 800, color: "primary.dark", borderLeft: selected ? `4px solid ${theme.palette.primary.main}` : "4px solid transparent" }}>
                      <Chip label={row.anio} size="small" color={selected ? "primary" : "default"} sx={{ fontWeight: 800, minWidth: 62 }} />
                    </TableCell>
                    <TableCell align="right" sx={{ color: "info.dark", fontWeight: 700, bgcolor: alpha(theme.palette.info.main, 0.055) }}>S/ {formatearNumero(row.totalPredial)}</TableCell>
                    <TableCell align="right" sx={{ color: "primary.dark", fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.055) }}>S/ {formatearNumero(row.totalArbitrial)}</TableCell>
                    <TableCell align="right" sx={{ color: "warning.dark", fontWeight: 800, bgcolor: alpha(theme.palette.warning.main, 0.09) }}>S/ {formatearNumero(row.totalCargos)}</TableCell>
                    <TableCell align="right" sx={{ color: "success.dark", fontWeight: 800, bgcolor: alpha(theme.palette.success.main, 0.09) }}>S/ {formatearNumero(row.totalPagado)}</TableCell>
                    <TableCell align="right" sx={{ bgcolor: alpha(row.saldoNeto > 0 ? theme.palette.error.main : theme.palette.success.main, 0.08) }}>
                      <Chip
                        label={row.saldoNeto > 0 ? `S/ ${formatearNumero(row.saldoNeto)}` : "Al día"}
                        size="small"
                        color={row.saldoNeto > 0 ? "error" : "success"}
                        variant={row.saldoNeto > 0 ? "outlined" : "filled"}
                        sx={{ fontWeight: 800, minWidth: 82 }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}</TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};
