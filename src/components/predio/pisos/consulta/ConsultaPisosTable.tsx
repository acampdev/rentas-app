import { Delete, Edit } from "@mui/icons-material";
import {
  alpha,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import type { PisoConsulta } from "./consultaPisos.types";
import { formatCurrency } from "./consultaPisos.utils";

interface Props {
  floors: PisoConsulta[];
  loading: boolean;
  editingFloor: number | null;
  onEdit: (floor: PisoConsulta) => void;
  onDelete: (floor: PisoConsulta) => void;
}

export function ConsultaPisosTable({
  floors,
  loading,
  editingFloor,
  onEdit,
  onDelete,
}: Props) {
  const theme = useTheme();
  const headerSx = {
    bgcolor: alpha(theme.palette.primary.main, 0.05),
    color: "primary.main",
    fontWeight: 700,
    fontSize: "0.813rem",
    whiteSpace: "nowrap",
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  };
  const cellSx = { fontSize: "0.813rem", whiteSpace: "nowrap", py: 1 };
  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          borderBottom: 2,
          borderColor: "primary.main",
          bgcolor: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Pisos Registrados
        </Typography>
        <Stack direction="row" spacing={1}>
          {floors.length > 0 && (
            <Chip
              label={`ÁREA TOTAL: ${floors[0].areaTotalConstruccion || 0} m2`}
              color="success"
              size="small"
            />
          )}
          <Chip label={`${floors.length} pisos`} color="primary" size="small" />
        </Stack>
      </Box>
      <TableContainer sx={{ maxHeight: 500, overflow: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {[
                "Item",
                "Descripción",
                "Valor Unitario",
                "Incremento",
                "Depreciación",
                "Valor Único Depreciado",
                "Valor Áreas Comunes",
                "Área Construida",
                "Acciones",
              ].map((label) => (
                <TableCell key={label} align="center" sx={headerSx}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : floors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No se encontraron resultados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              floors.map((floor) => (
                <TableRow key={floor.id} hover>
                  <TableCell align="center" sx={cellSx}>
                    <Chip
                      label={floor.item}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center" sx={cellSx}>
                    {floor.descripcion}
                  </TableCell>
                  <TableCell align="center" sx={cellSx}>
                    {formatCurrency(floor.valorUnitario)}
                  </TableCell>
                  <TableCell align="center" sx={cellSx}>
                    {formatCurrency(floor.incremento)}
                  </TableCell>
                  <TableCell align="center" sx={cellSx}>
                    <Chip
                      label={`${floor.porcentajeDepreciacion}%`}
                      size="small"
                      color={
                        floor.porcentajeDepreciacion > 50
                          ? "error"
                          : floor.porcentajeDepreciacion > 20
                            ? "warning"
                            : "default"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center" sx={cellSx}>
                    {formatCurrency(floor.valorUnicoDepreciado)}
                  </TableCell>
                  <TableCell align="center" sx={cellSx}>
                    {formatCurrency(floor.valorAreasComunes ?? 0)}
                  </TableCell>
                  <TableCell align="center" sx={cellSx}>
                    {floor.areaConstruida == null
                      ? "—"
                      : `${floor.areaConstruida} m²`}
                  </TableCell>
                  <TableCell align="center" sx={cellSx}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(floor)}
                      disabled={editingFloor !== null}
                    >
                      {editingFloor ===
                      Number(floor.codPiso || floor.id || floor.numeroPiso) ? (
                        <CircularProgress size={18} />
                      ) : (
                        <Edit fontSize="small" />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(floor)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
