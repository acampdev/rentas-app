// src/components/predio/transferencia/ConsultaTransferencia.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  alpha,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Stack,
  Chip
} from '@mui/material';
import {
  PersonSearch as PersonSearchIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  TableChart as TableChartIcon,
  SearchOff as SearchOffIcon
} from '@mui/icons-material';
import SelectorContribuyente from '../../modal/SelectorContribuyente';

// Interfaz para Contribuyente seleccionado
interface ContribuyenteSeleccionado {
  codigo: number;
  contribuyente: string;
  documento: string;
  direccion: string;
  telefono?: string;
  tipoPersona?: 'natural' | 'juridica';
}

// Interfaz para el formulario de filtro
interface FiltroTransferenciaData {
  anio: number;
  contribuyente: ContribuyenteSeleccionado | null;
  canceladas: boolean;
  porCobrar: boolean;
}

// Interfaz para los datos de la tabla de transferencias
interface TransferenciaRow {
  id: number;
  fOperacion: string;
  codComprador: number;
  comprador: string;
  dniComprador: string;
  codVendedor: number;
  vendedor: string;
  dniVendedor: string;
  codPredio: string;
  direccionPredio: string;
  nPisos: number;
  fMinuta: string;
  autovaluo: number;
  mora: number;
  ajuste: number;
  base: number;
  tasa: number;
  impuesto: number;
  total: number;
  numero: string;
}

const ConsultaTransferencia: React.FC = () => {
  const theme = useTheme();

  // Estado para el modal
  const [openModalContribuyente, setOpenModalContribuyente] = useState(false);

  // Estado del formulario de filtro
  const [filtroData, setFiltroData] = useState<FiltroTransferenciaData>({
    anio: new Date().getFullYear(),
    contribuyente: null,
    canceladas: false,
    porCobrar: false
  });

  // Estado para los resultados de la tabla
  const [resultados, setResultados] = useState<TransferenciaRow[]>([]);

  // Handler para seleccionar contribuyente
  const handleSelectContribuyente = (contribuyente: any) => {
    setFiltroData(prev => ({
      ...prev,
      contribuyente: contribuyente
    }));
    setOpenModalContribuyente(false);
  };

  // Handler para cambios en el formulario
  const handleInputChange = (field: keyof FiltroTransferenciaData, value: any) => {
    setFiltroData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler para buscar
  const handleBuscar = () => {
    console.log('Buscando con filtros:', filtroData);
    // Aqui se implementara la logica de busqueda
  };

  // Handler para nuevo registro - limpia el filtro
  const handleNuevo = () => {
    setFiltroData({
      anio: new Date().getFullYear(),
      contribuyente: null,
      canceladas: false,
      porCobrar: false
    });
    console.log('Filtro limpiado');
  };

  // Handler para editar una transferencia
  const handleEditar = (id: number) => {
    console.log('Editando transferencia:', id);
    // Aqui se implementara la logica para editar
  };

  return (
    <Box>
      {/* Formulario de Filtros */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 2 }}>
          Filtros de Busqueda
        </Typography>

        {/* Primera fila: Año, Seleccionar Contribuyente, Codigo, Nombre, Checkboxes */}
        <Grid container spacing={2} alignItems="center">
          {/* Año */}
          <Grid size={{ xs: 12, sm: 4, md: 1 }}>
            <TextField
              label="Año"
              type="number"
              value={filtroData.anio}
              onChange={(e) => handleInputChange('anio', parseInt(e.target.value) || new Date().getFullYear())}
              size="small"
              fullWidth
              inputProps={{
                min: 2000,
                max: 2100
              }}
            />
          </Grid>

          {/* Button Seleccionar Contribuyente */}
          <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
            <Button
              variant="contained"
              startIcon={<PersonSearchIcon />}
              onClick={() => setOpenModalContribuyente(true)}
              fullWidth
              sx={{ height: 40 }}
            >
              Selec. Contribuyente
            </Button>
          </Grid>

          {/* Codigo Contribuyente */}
          <Grid size={{ xs: 12, sm: 4, md: 0.75 }}>
            <TextField
              label="Codigo"
              value={filtroData.contribuyente?.codigo || ''}
              fullWidth
              size="small"
              disabled
              InputProps={{
                readOnly: true,
                sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
              }}
            />
          </Grid>

          {/* Nombre Contribuyente */}
          <Grid size={{ xs: 12, sm: 8, md: 3 }}>
            <TextField
              label="Nombre Contribuyente"
              value={filtroData.contribuyente?.contribuyente || ''}
              fullWidth
              size="small"
              disabled
              InputProps={{
                readOnly: true,
                sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
              }}
            />
          </Grid>

          {/* Checkboxes: Canceladas y Por Cobrar (solo una opcion a la vez) */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                height: 40,
                gap: 1
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filtroData.canceladas}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFiltroData(prev => ({ ...prev, canceladas: true, porCobrar: false }));
                      } else {
                        setFiltroData(prev => ({ ...prev, canceladas: false }));
                      }
                    }}
                    color="primary"
                    size="small"
                  />
                }
                label="Canceladas"
                sx={{ m: 0, whiteSpace: 'nowrap' }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filtroData.porCobrar}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFiltroData(prev => ({ ...prev, porCobrar: true, canceladas: false }));
                      } else {
                        setFiltroData(prev => ({ ...prev, porCobrar: false }));
                      }
                    }}
                    color="primary"
                    size="small"
                  />
                }
                label="Por Cobrar"
                sx={{ m: 0, whiteSpace: 'nowrap' }}
              />
            </Box>
          </Grid>

          {/* Buttons Nuevo y Buscar */}
          <Grid size={{ xs: 12, sm: 6, md: 2.25 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                height: 40,
                gap: 1,
                flexWrap: 'nowrap'
              }}
            >
              {/* Button Nuevo */}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleNuevo}
                size="small"
                sx={{ height: 40, whiteSpace: 'nowrap' }}
              >
                Nuevo
              </Button>
              {/* Button Buscar */}
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleBuscar}
                size="small"
                sx={{ height: 40, whiteSpace: 'nowrap' }}
              >
                Buscar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de Resultados */}
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: 'hidden'
        }}
      >
        {/* Header de la tabla */}
        <Box
          sx={{
            p: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.25)}`
                }}
              >
                <TableChartIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  Resultados de Busqueda
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Lista de transferencias encontradas
                </Typography>
              </Box>
            </Stack>
            <Chip
              label={`${resultados.length} registro${resultados.length !== 1 ? 's' : ''}`}
              size="small"
              color={resultados.length > 0 ? 'primary' : 'default'}
              variant={resultados.length > 0 ? 'filled' : 'outlined'}
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Box>

        <TableContainer sx={{ maxHeight: 420, overflowX: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {[
                  { label: 'F. Operacion', minWidth: 100, align: 'left' as const },
                  { label: 'Cod Comprador', minWidth: 100, align: 'left' as const },
                  { label: 'Comprador', minWidth: 180, align: 'left' as const },
                  { label: 'DNI Comprador', minWidth: 100, align: 'left' as const },
                  { label: 'Cod Vendedor', minWidth: 100, align: 'left' as const },
                  { label: 'Vendedor', minWidth: 180, align: 'left' as const },
                  { label: 'DNI Vendedor', minWidth: 100, align: 'left' as const },
                  { label: 'Cod Predio', minWidth: 100, align: 'left' as const },
                  { label: 'Direccion Predio', minWidth: 200, align: 'left' as const },
                  { label: 'N° Pisos', minWidth: 80, align: 'center' as const },
                  { label: 'F. Minuta', minWidth: 100, align: 'left' as const },
                  { label: 'Autovaluo', minWidth: 100, align: 'right' as const },
                  { label: 'Mora', minWidth: 80, align: 'right' as const },
                  { label: 'Ajuste', minWidth: 80, align: 'right' as const },
                  { label: 'Base', minWidth: 80, align: 'right' as const },
                  { label: 'Tasa', minWidth: 80, align: 'right' as const },
                  { label: 'Impuesto', minWidth: 100, align: 'right' as const },
                  { label: 'Total', minWidth: 100, align: 'right' as const },
                  { label: 'N°', minWidth: 80, align: 'left' as const },
                  { label: 'Acciones', minWidth: 80, align: 'center' as const }
                ].map((column) => (
                  <TableCell
                    key={column.label}
                    align={column.align}
                    sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      minWidth: column.minWidth,
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.dark,
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      fontSize: '0.8rem',
                      py: 1.5
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {resultados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={20} align="center" sx={{ py: 8, border: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          backgroundColor: alpha(theme.palette.grey[500], 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <SearchOffIcon sx={{ fontSize: 32, color: theme.palette.grey[400] }} />
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                          No hay resultados para mostrar
                        </Typography>
                        <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                          Utilice los filtros de busqueda para encontrar transferencias
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                resultados.map((row, index) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.grey[500], 0.04),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08)
                      },
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.fOperacion}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.codComprador}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 500 }}>{row.comprador}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.dniComprador}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.codVendedor}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 500 }}>{row.vendedor}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.dniVendedor}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.codPredio}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.direccionPredio}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.nPisos}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.fMinuta}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {row.autovaluo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {row.mora.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {row.ajuste.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {row.base.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {row.tasa.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {row.impuesto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 600, color: theme.palette.success.main }}>
                      {row.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.numero}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar transferencia" arrow>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditar(row.id)}
                          sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.2)
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer de la tabla */}
        {resultados.length > 0 && (
          <Box
            sx={{
              p: 1.5,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.grey[500], 0.04),
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Mostrando {resultados.length} transferencia{resultados.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Modal para seleccionar Contribuyente */}
      <SelectorContribuyente
        isOpen={openModalContribuyente}
        onClose={() => setOpenModalContribuyente(false)}
        onSelectContribuyente={handleSelectContribuyente}
        title="Seleccionar Contribuyente"
        selectedId={filtroData.contribuyente?.codigo}
      />
    </Box>
  );
};

export default ConsultaTransferencia;
