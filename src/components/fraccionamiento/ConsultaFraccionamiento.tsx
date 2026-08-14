// src/components/fraccionamiento/ConsultaFraccionamiento.tsx
import React, { useState, useCallback } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  InputAdornment,
  TablePagination,
  Stack,
  MenuItem,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { fraccionamientoService } from "../../services/fraccionamientoService";
import type { Fraccionamiento } from "../../types/fraccionamiento.types";
import SelectorContribuyente from "../modal/SelectorContribuyente";
import { NotificationService } from "../utils/Notification";

const ConsultaFraccionamiento: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalContribuyente, setModalContribuyente] = useState(false);
  const [contribuyente, setContribuyente] = useState<any>(null);
  const [fraccionamientos, setFraccionamientos] = useState<Fraccionamiento[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const handleBuscar = useCallback(async () => {
    if (!contribuyente?.codigo) {
      NotificationService.error("Debe seleccionar un contribuyente");
      return;
    }

    setLoading(true);
    try {
      const data = await fraccionamientoService.getAll({
        codContribuyente: contribuyente.codigo.toString(),
      });

      setFraccionamientos(data || []);
      if (!data || data.length === 0) {
        NotificationService.info(
          "No se encontraron fraccionamientos para este contribuyente",
        );
      } else {
        NotificationService.success(
          `Se encontraron ${data.length} fraccionamientos`,
        );
      }
    } catch (err: any) {
      console.error("Error al buscar fraccionamientos:", err);
      NotificationService.error(
        err.message || "Error al buscar fraccionamientos",
      );
      setFraccionamientos([]);
    } finally {
      setLoading(false);
      setContribuyente(null);
    }
  }, [contribuyente]);

  const handleLimpiar = useCallback(() => {
    setContribuyente(null);
    setFraccionamientos([]);
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "APROBADO":
        return "success";
      case "PENDIENTE":
        return "warning";
      case "RECHAZADO":
        return "error";
      case "CANCELADO":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600, color: "primary.main" }}
            >
              Consulta de Fraccionamientos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Búsqueda y seguimiento de convenios de fraccionamiento
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {}}
          >
            Exportar Excel
          </Button>
        </Box>
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <FilterIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Filtros de Búsqueda
            </Typography>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setModalContribuyente(true)}
                startIcon={<PersonIcon />}
                sx={{
                  height: 40,
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Seleccionar Contribuyente
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                label="Código"
                value={contribuyente?.codigo || ""}
                InputProps={{
                  readOnly: true,
                }}
                placeholder="---"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Contribuyente"
                value={contribuyente?.contribuyente || ""}
                InputProps={{
                  readOnly: true,
                }}
                placeholder="Sin seleccionar"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex", gap: 1 }}>
              {/* Botón Buscar */}
              <Button
                fullWidth
                variant="contained"
                onClick={handleBuscar}
                startIcon={<SearchIcon />}
                sx={{
                  height: 40,
                  borderRadius: 1,
                  fontWeight: 600,
                  bgcolor: "#3b82f6 !important", // Color azul premium siempre visible
                  color: "white !important",
                  "&:hover": {
                    bgcolor: "#2563eb !important",
                  },
                }}
              >
                Buscar
              </Button>
              <Tooltip title="Limpiar filtros">
                <IconButton
                  onClick={handleLimpiar}
                  sx={{
                    height: 40,
                    width: 40,
                    flexShrink: 0,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
        {/* Tabla de fraccionamientos */}{" "}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600, overflowX: "auto" }}>
            <Table stickyHeader sx={{ minWidth: 2000 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                  >
                    CÓD. CONTRIBUYENTE
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                  >
                    TIPO RESOLUCIÓN
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="right"
                  >
                    DEUDA INSOLUTA
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="right"
                  >
                    CUOTA INICIAL
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="center"
                  >
                    N° CUOTAS
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="center"
                  >
                    AÑO INICIO
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="center"
                  >
                    PERIODO INICIO
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="center"
                  >
                    AÑO FIN
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="center"
                  >
                    PERIODO FIN
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                  >
                    SOLICITANTE
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                  >
                    TIPO DOC.
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                  >
                    N° DOCUMENTO
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                  >
                    CARGO
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="center"
                  >
                    AÑO
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="right"
                  >
                    TASA MENSUAL
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="right"
                  >
                    TOTAL INTERÉS
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="right"
                  >
                    TOTAL FRACCIONADO
                  </TableCell>
                  <TableCell
                    sx={{ bgcolor: "grey.50", fontWeight: 600, px: 2 }}
                    align="center"
                  >
                    ACCIONES
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={18} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                      <Typography sx={{ mt: 2 }} color="text.secondary">
                        Buscando fraccionamientos...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : fraccionamientos.length > 0 ? (
                  fraccionamientos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: Fraccionamiento, index: number) => (
                      <TableRow
                        key={row.id ? `fracc-${row.id}` : `row-${index}`}
                        hover
                      >
                        <TableCell align="center" sx={{ px: 2 }}>
                          {row.codContribuyente}
                        </TableCell>
                        <TableCell sx={{ px: 2 }}>
                          {row.tipoResolucion}
                        </TableCell>
                        <TableCell align="right" sx={{ px: 2 }}>
                          S/ {row.deudaInsoluta?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell align="right" sx={{ px: 2 }}>
                          S/ {row.cuotaInicial?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell align="center" sx={{ px: 2 }}>
                          {row.numeroCuotas}
                        </TableCell>
                        <TableCell align="center" sx={{ px: 2 }}>
                          {row.anioDeudaInicio}
                        </TableCell>
                        <TableCell align="center" sx={{ px: 2 }}>
                          {row.periodoInicio}
                        </TableCell>
                        <TableCell align="center" sx={{ px: 2 }}>
                          {row.anioDeudaFin}
                        </TableCell>
                        <TableCell align="center" sx={{ px: 2 }}>
                          {row.periodoFin}
                        </TableCell>
                        <TableCell sx={{ px: 2 }}>{row.solicitante}</TableCell>
                        <TableCell sx={{ px: 2 }}>
                          {row.tipoDocumento}
                        </TableCell>
                        <TableCell sx={{ px: 2 }}>{row.numDocumento}</TableCell>
                        <TableCell sx={{ px: 2 }}>{row.cargo}</TableCell>
                        <TableCell align="center" sx={{ px: 2 }}>
                          {row.anio}
                        </TableCell>
                        <TableCell align="right" sx={{ px: 2 }}>
                          {row.tasaMensual?.toFixed(2) || "0.00"} %
                        </TableCell>
                        <TableCell align="right" sx={{ px: 2 }}>
                          S/ {row.totalInteres?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ px: 2, fontWeight: 600 }}
                        >
                          S/ {row.totalFraccionado?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell align="center" sx={{ px: 2 }}>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="center"
                          >
                            <Tooltip title="Ver detalle">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                  navigate(
                                    `/fraccionamiento/cronograma/${row.id}`,
                                    { state: row },
                                  );
                                }}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Imprimir convenio">
                              <IconButton size="small">
                                <PrintIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={18} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">
                        No se encontraron resultados
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={fraccionamientos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <SelectorContribuyente
          isOpen={modalContribuyente}
          onClose={() => setModalContribuyente(false)}
          onSelectContribuyente={(c) => setContribuyente(c)}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default ConsultaFraccionamiento;
