// src/components/modal/SelectorDirecciones.tsx
import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  TablePagination,
  useTheme,
  alpha,
  Fade,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Apartment as ApartmentIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useDirecciones } from "../../hooks/useDirecciones";
import { NotificationService } from "../utils/Notification";

// Interfaces
interface LocalDireccion extends ContribuyenteDireccion {
  codigo: string;
  sector: string;
  barrio: string;
  tipoVia: string;
  nombreVia: string;
  cuadra: string;
}

import { ContribuyenteDireccion } from "../../types/formTypes";

interface SelectorDireccionesProps {
  open: boolean;
  onClose: () => void;
  onSelectDireccion: (direccion: ContribuyenteDireccion) => void;
  direccionSeleccionada?: ContribuyenteDireccion | null;
  titulo?: string;
}

const SelectorDirecciones: React.FC<SelectorDireccionesProps> = ({
  open,
  onClose,
  onSelectDireccion,
  direccionSeleccionada,
  titulo = "Seleccionar Dirección",
}) => {
  const theme = useTheme();
  const [busqueda, setBusqueda] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(
    direccionSeleccionada?.id || null,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const busquedaDiferida = useDeferredValue(busqueda);

  // Usar el hook de direcciones
  const { direcciones, loading, error, cargarDirecciones } = useDirecciones();

  // Cargar direcciones al abrir el modal
  useEffect(() => {
    if (open) {
      console.log(
        "🔄 [SelectorDirecciones] Modal abierto, cargando direcciones...",
      );
      cargarDirecciones();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // La lista filtrada es un valor derivado. No debe copiarse a estado porque
  // una referencia nueva del arreglo puede provocar ciclos de actualización.
  const direccionesFiltradas = useMemo(() => {
    const termino = busquedaDiferida.trim().toLowerCase();
    if (!termino) return direcciones;

    return direcciones.filter(
      (direccion) =>
        direccion.nombreVia?.toLowerCase().includes(termino) ||
        direccion.nombreBarrio?.toLowerCase().includes(termino) ||
        direccion.nombreSector?.toLowerCase().includes(termino) ||
        direccion.descripcion?.toLowerCase().includes(termino) ||
        direccion.cuadra?.toLowerCase().includes(termino) ||
        direccion.nombreTipoVia?.toLowerCase().includes(termino),
    );
  }, [busquedaDiferida, direcciones]);

  // Manejar selección
  const handleSelect = () => {
    const direccionSeleccionada = direccionesFiltradas.find(
      (d) => d.id === selectedId,
    );
    if (direccionSeleccionada) {
      // Construir descripción completa si no existe
      const descripcionCompleta =
        direccionSeleccionada.descripcion ||
        `CALLE ${direccionSeleccionada.nombreVia || ""} ${direccionSeleccionada.cuadra ? `CUADRA ${direccionSeleccionada.cuadra}` : ""}`.trim();

      const direccionFormateada: LocalDireccion = {
        id: direccionSeleccionada.id,
        codigo:
          direccionSeleccionada.codigo?.toString() ||
          direccionSeleccionada.id.toString(),
        sector: direccionSeleccionada.nombreSector || "",
        barrio: direccionSeleccionada.nombreBarrio || "",
        tipoVia: direccionSeleccionada.nombreTipoVia || "CALLE",
        nombreVia:
          direccionSeleccionada.nombreVia ||
          direccionSeleccionada.nombreCalle ||
          "",
        cuadra: direccionSeleccionada.cuadra || "",
        lado: direccionSeleccionada.lado || "D",
        loteInicial: direccionSeleccionada.loteInicial || 1,
        loteFinal: direccionSeleccionada.loteFinal || 1,
        descripcion: descripcionCompleta,
        // Agregar campos adicionales que puedan ser útiles
        codigoSector: direccionSeleccionada.codigoSector,
        codigoBarrio: direccionSeleccionada.codigoBarrio,
        codigoCalle: direccionSeleccionada.codigoCalle,
        codigoTipoVia: direccionSeleccionada.codigoTipoVia,
      };

      console.log("📍 Dirección seleccionada completa:", direccionFormateada);
      onSelectDireccion(direccionFormateada);
      onClose();
    }
  };

  // Manejar recarga de direcciones
  const handleReload = () => {
    cargarDirecciones();
    NotificationService.info("Recargando direcciones...");
  };

  // Paginación
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Direcciones paginadas
  const direccionesPaginadas = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    const paginadas = direccionesFiltradas.slice(start, end);
    console.log(
      "📄 [SelectorDirecciones] Direcciones paginadas:",
      paginadas.length,
    );
    console.log(
      "📄 [SelectorDirecciones] Total filtradas:",
      direccionesFiltradas.length,
    );
    console.log(
      "📄 [SelectorDirecciones] Página:",
      page,
      "Filas por página:",
      rowsPerPage,
    );
    return paginadas;
  }, [direccionesFiltradas, page, rowsPerPage]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      keepMounted={false}
      disableEnforceFocus={true}
      disableAutoFocus={true}
      disableRestoreFocus={true}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationIcon color="primary" />
            <Typography variant="h6" fontWeight={700} color="primary.dark">
              {titulo}
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* Búsqueda */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por nombre de vía, barrio, sector, tipo de vía..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPage(0);
            }}
            size="small"
            sx={{ bgcolor: "background.paper", borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: busqueda && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setBusqueda("");
                      setPage(0);
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Alertas */}
          {error && (
            <Alert severity="warning">
              {typeof error === "string"
                ? error
                : "Error al cargar direcciones"}
            </Alert>
          )}

          {direcciones.length === 0 && !loading && (
            <Alert severity="info" icon={<InfoIcon />}>
              No se encontraron direcciones. Intente recargar los datos.
            </Alert>
          )}

          {/* Tabla de direcciones */}
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              maxHeight: 320,
              borderRadius: 2,
              overflowY: "auto",
              border: `1px solid ${theme.palette.divider}`,
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: alpha(theme.palette.divider, 0.05),
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.4),
                },
              },
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderBottom: `2px solid ${theme.palette.divider}`,
                    }}
                    padding="checkbox"
                    width={70}
                    align="center"
                  >
                    SEL.
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderBottom: `2px solid ${theme.palette.divider}`,
                    }}
                  >
                    DIRECCIÓN COMPLETA
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : direccionesPaginadas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        No se encontraron direcciones
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  direccionesPaginadas.map((direccion, index) => {
                    const isSelected = selectedId === direccion.id;
                    return (
                      <TableRow
                        key={`direccion-${direccion.id || index}-${index}`}
                        hover
                        onClick={() => setSelectedId(direccion.id)}
                        selected={isSelected}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: isSelected
                            ? alpha(theme.palette.primary.main, 0.04)
                            : "inherit",
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.08,
                            ),
                          },
                        }}
                      >
                        <TableCell padding="checkbox" align="center">
                          <Radio
                            checked={isSelected}
                            size="small"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: isSelected ? 600 : 400 }}>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <ApartmentIcon
                              sx={{
                                fontSize: 16,
                                color: isSelected
                                  ? "primary.main"
                                  : "text.secondary",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: isSelected ? 600 : 400 }}
                            >
                              {direccion.descripcion || "-"}
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <TablePagination
            component="div"
            count={direccionesFiltradas.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.grey[100], 0.3),
        }}
      >
        {/* Botón para cancelar selección */}
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            borderColor: "divider",
            color: "text.secondary",
            height: "36px",
            "&:hover": {
              borderColor: "text.primary",
              backgroundColor: alpha(theme.palette.action.hover, 0.05),
            },
          }}
        >
          Cancelar
        </Button>
        {/* Botón para recargar direcciones */}
        <Button
          onClick={handleReload}
          variant="outlined"
          startIcon={<RefreshIcon />}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            borderColor: "divider",
            color: "text.secondary",
            height: "36px",
            "&:hover": {
              borderColor: "text.primary",
              backgroundColor: alpha(theme.palette.action.hover, 0.05),
            },
            "&.Mui-disabled": {
              borderColor: "divider",
              color: "text.disabled",
              bgcolor: alpha(theme.palette.action.disabledBackground, 0.05),
            },
          }}
        >
          Recargar
        </Button>
        {/* Botón para seleccionar dirección */}
        <Button
          variant="contained"
          onClick={handleSelect}
          disabled={!selectedId}
          startIcon={<CheckCircleIcon />}
          sx={{
            backgroundColor: "#3b82f6 !important", // Azul premium coherente
            color: "white !important",
            fontWeight: 700,
            height: "36px",
            textTransform: "none",
            borderRadius: 1.5,
            boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)",
            "&:hover": {
              backgroundColor: "#2563eb !important",
              boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
            },
            "&.Mui-disabled": {
              backgroundColor: `${alpha("#3b82f6", 0.5)} !important`,
              color: "rgba(255, 255, 255, 0.7) !important",
              boxShadow: "none",
            },
          }}
        >
          Seleccionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectorDirecciones;
