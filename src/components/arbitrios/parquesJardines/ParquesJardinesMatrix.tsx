import { Search as SearchIcon } from "@mui/icons-material";
import {
  alpha,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import type { ParquesMatrix } from "./parquesJardines.types";

interface Props {
  visible: boolean;
  year: number;
  loading: boolean;
  matrix: ParquesMatrix;
  onRateClick: (
    routeCode: string | number,
    locationCode: string | number,
    rate: number,
  ) => void;
}

export function ParquesJardinesMatrix({
  visible,
  year,
  loading,
  matrix,
  onRateClick,
}: Props) {
  const theme = useTheme();
  if (!visible) {
    return (
      <Box
        sx={{
          py: 10,
          textAlign: "center",
          bgcolor: alpha("#eee", 0.2),
          borderRadius: 2,
          border: "2px dashed #ccc",
        }}
      >
        <SearchIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
        <Typography color="text.secondary">
          Ingrese un año y presione &quot;Buscar&quot; para visualizar la matriz
          de Parques y Jardines
        </Typography>
      </Box>
    );
  }
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          p: 1.5,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          borderRadius: 1,
          borderLeft: `4px solid ${theme.palette.primary.main}`,
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
          🌳 MATRIZ DE TASAS POR UBICACIÓN Y RUTA - AÑO {year}
        </Typography>
        <Chip
          label="Interactivo"
          color="success"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
      </Box>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 2, overflow: "auto", maxHeight: 600 }}
      >
        <Table stickyHeader size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 800,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRight: "2px solid rgba(0,0,0,0.1)",
                  zIndex: 3,
                }}
                rowSpan={2}
                align="center"
              >
                UBICACIÓN
              </TableCell>
              <TableCell
                colSpan={matrix.routes.length}
                align="center"
                sx={{
                  fontWeight: 800,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  color: theme.palette.primary.main,
                }}
              >
                RUTAS DE RECOLECCIÓN - TASA MENSUAL (S/)
              </TableCell>
            </TableRow>
            <TableRow>
              {matrix.routes.map((route) => (
                <TableCell
                  key={route.value}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    fontSize: "0.75rem",
                  }}
                >
                  {route.label.toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={matrix.routes.length + 1}
                  align="center"
                  sx={{ py: 10 }}
                >
                  <CircularProgress size={40} sx={{ mb: 2 }} />
                  <Typography color="text.secondary">
                    Cargando matriz de tasas...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : !matrix.rows.length ? (
              <TableRow>
                <TableCell
                  colSpan={matrix.routes.length + 1}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron registros para el año {year}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              matrix.rows.map((row) => (
                <TableRow key={String(row.codUbicacion)} hover>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      bgcolor: alpha(theme.palette.grey[50], 0.8),
                      borderRight: "2px solid rgba(0,0,0,0.1)",
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                    }}
                  >
                    {row.ubicacionLabel}
                  </TableCell>
                  {matrix.routes.map((route) => {
                    const rate = row.rates[String(route.value)];
                    return (
                      <TableCell
                        key={route.value}
                        align="center"
                        sx={{ p: 0.5 }}
                      >
                        {rate !== null && rate !== undefined ? (
                          <Tooltip
                            title={`Editar: ${row.ubicacionLabel} - ${route.label}`}
                            arrow
                          >
                            <Box
                              onClick={() =>
                                onRateClick(route.value, row.codUbicacion, rate)
                              }
                              sx={{
                                cursor: "pointer",
                                p: 1,
                                borderRadius: 1,
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                "&:hover": {
                                  bgcolor: theme.palette.success.main,
                                  color: "white",
                                  transform: "scale(1.05)",
                                },
                              }}
                            >
                              <Typography variant="body2" fontWeight={700}>
                                S/ {rate.toFixed(2)}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  opacity: 0.8,
                                  display: "block",
                                  fontSize: "0.65rem",
                                }}
                              >
                                Anual: S/ {(rate * 12).toFixed(2)}
                              </Typography>
                            </Box>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="text.disabled">
                            -
                          </Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          mt: 2,
          p: 2,
          bgcolor: alpha(theme.palette.info.main, 0.05),
          borderRadius: 1,
          border: `1px dashed ${theme.palette.info.main}`,
        }}
      >
        <Typography variant="caption" color="info.dark">
          💡 <strong>Tip:</strong> Haz clic en cualquier monto para editarlo.
        </Typography>
      </Box>
    </Box>
  );
}
