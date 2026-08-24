import { Block, Dashboard, Edit, Search } from "@mui/icons-material";
import {
  Alert,
  alpha,
  Box,
  Button,
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
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import type { KeyboardEvent } from "react";
import type { InteresData } from "../../../models/Interes";

interface Props {
  items: InteresData[];
  year: number;
  searchYear: number;
  loading: boolean;
  inactivating: boolean;
  error: string | null;
  onSearchYearChange: (year: number) => void;
  onSearch: () => void;
  onEdit: (item: InteresData) => void;
  onInactivate: (item: InteresData) => void;
}

const statusLabel = (status = "") =>
  status === "0001" ? "ACTIVO" : status || "INACTIVO";
const statusColor = (status = "") =>
  status === "0001" ? "#10b981" : "#6b7280";

export function InteresConsulta({
  items,
  year,
  searchYear,
  loading,
  inactivating,
  error,
  onSearchYearChange,
  onSearch,
  onEdit,
  onInactivate,
}: Props) {
  const theme = useTheme();
  const headerSx = {
    fontWeight: 700,
    bgcolor: alpha(theme.palette.primary.main, 0.05),
  };
  const handleKeyDown = (event: KeyboardEvent) =>
    event.key === "Enter" && onSearch();
  return (
    <Box sx={{ px: 3 }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            bgcolor: alpha(theme.palette.grey[100], 0.5),
            p: 2,
            borderRadius: 2,
          }}
        >
          <TextField
            label="Filtrar por Año"
            type="number"
            value={searchYear}
            onChange={(event) =>
              onSearchYearChange(
                Number.parseInt(event.target.value) || new Date().getFullYear(),
              )
            }
            onKeyDown={handleKeyDown}
            size="small"
            sx={{ width: 150 }}
          />
          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Search />
              )
            }
            onClick={onSearch}
            disabled={loading}
            sx={{ bgcolor: "#3b82f6", minWidth: 120 }}
          >
            Buscar
          </Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              gap: 1,
            }}
          >
            <Dashboard color="primary" fontSize="small" />
            <Typography variant="subtitle2" fontWeight={700}>
              TABLA DE INTERESES POR AÑO Y CLASIFICACIÓN
            </Typography>
          </Box>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {[
                    "CÓD. INTERÉS",
                    "AÑO",
                    "TASA (%)",
                    "CÓD. TIPO",
                    "CÓD. CLASE",
                    "ESTADO",
                    "ACCIONES",
                  ].map((label) => (
                    <TableCell
                      key={label}
                      align={
                        ["TASA (%)", "ESTADO", "ACCIONES"].includes(label)
                          ? "center"
                          : "left"
                      }
                      sx={headerSx}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading || inactivating ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">
                        No se encontraron intereses registrados para el año{" "}
                        {year}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow
                      key={`${item.codInteres}-${item.anio}-${item.codTipo}`}
                      hover
                    >
                      <TableCell sx={{ fontWeight: 600 }}>
                        {item.codInteres}
                      </TableCell>
                      <TableCell>{item.anio}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        {item.tasa}%
                      </TableCell>
                      <TableCell>{item.codTipo}</TableCell>
                      <TableCell>{item.codClase}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={statusLabel(item.codEstado)}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            borderColor: statusColor(item.codEstado),
                            color: statusColor(item.codEstado),
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(item)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Inactivar">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => onInactivate(item)}
                            disabled={inactivating}
                          >
                            <Block fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </Box>
  );
}
