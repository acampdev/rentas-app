// src/components/predio/transferencia/ConsultaTransferencia.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
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
  Search as SearchIcon,
  Edit as EditIcon,
  TableChart as TableChartIcon,
  SearchOff as SearchOffIcon
} from '@mui/icons-material';
import { useTransferencia } from '../../../hooks/useTransferencia';
import type { BuscarTransferenciaPredioParams, TransferenciaPredioData } from '../../../services/transferenciaService';
import { NotificationService } from '../../utils/Notification';

// Interfaz para el formulario de filtro
interface FiltroTransferenciaData {
  codigoTransferencia: string;
  codigoPredio: string;
  anio: string;
  codContribuyenteVenta: string;
  codContribuyenteCompra: string;
}

const FILTROS_INICIALES: FiltroTransferenciaData = {
  codigoTransferencia: '',
  codigoPredio: '',
  anio: '',
  codContribuyenteVenta: '',
  codContribuyenteCompra: ''
};

interface ConsultaTransferenciaProps {
  onEditar?: (transferencia: TransferenciaPredioData) => void;
}

export const ConsultaTransferencia: React.FC<ConsultaTransferenciaProps> = ({ onEditar }) => {
  const theme = useTheme();

  // Estado del formulario de filtro
  const [filtroData, setFiltroData] = useState<FiltroTransferenciaData>(FILTROS_INICIALES);

  const { transferencias: resultados, buscarTransferencias, isSearching } = useTransferencia();

  // Handler para cambios en el formulario
  const handleInputChange = <K extends keyof FiltroTransferenciaData>(field: K, value: FiltroTransferenciaData[K]) => {
    setFiltroData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler para buscar
  const handleBuscar = async () => {
    if (!Object.values(filtroData).some((value) => value.trim() !== '')) {
      NotificationService.warning('Ingrese al menos un filtro para realizar la búsqueda');
      return;
    }

    const filtros: BuscarTransferenciaPredioParams = {
      codTransferencia: filtroData.codigoTransferencia ? Number(filtroData.codigoTransferencia) : undefined,
      codPredio: filtroData.codigoPredio || undefined,
      anio: filtroData.anio ? Number(filtroData.anio) : undefined,
      codContribuyenteVenta: filtroData.codContribuyenteVenta ? Number(filtroData.codContribuyenteVenta) : undefined,
      codContribuyenteCompra: filtroData.codContribuyenteCompra ? Number(filtroData.codContribuyenteCompra) : undefined
    };

    try {
      await buscarTransferencias(filtros);
    } finally {
      setFiltroData(FILTROS_INICIALES);
    }
  };

  // Handler para editar una transferencia
  const handleEditar = (transferencia: TransferenciaPredioData) => {
    onEditar?.(transferencia);
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

        {/* Filtros de transferencia */}
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              label="Código Transferencia"
              value={filtroData.codigoTransferencia}
              onChange={(e) => handleInputChange('codigoTransferencia', e.target.value.replace(/\D/g, ''))}
              size="small"
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              label="Código Predio"
              value={filtroData.codigoPredio}
              onChange={(e) => handleInputChange('codigoPredio', e.target.value.replace(/\D/g, ''))}
              size="small"
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3, md: 1 }}>
            <TextField
              label="Año"
              type="number"
              value={filtroData.anio}
              onChange={(e) => handleInputChange('anio', e.target.value)}
              size="small"
              fullWidth
              inputProps={{ min: 2000, max: 2100 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              label="Cod. Contribuyente Venta"
              value={filtroData.codContribuyenteVenta}
              onChange={(e) => handleInputChange('codContribuyenteVenta', e.target.value.replace(/\D/g, ''))}
              size="small"
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label="Cod. Contribuyente Compra"
              value={filtroData.codContribuyenteCompra}
              onChange={(e) => handleInputChange('codContribuyenteCompra', e.target.value.replace(/\D/g, ''))}
              size="small"
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Button
              variant="contained"
              startIcon={isSearching ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
              onClick={handleBuscar}
              fullWidth
              disabled={isSearching}
              sx={{ height: 40, whiteSpace: 'nowrap' }}
            >
              Buscar
            </Button>
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
                  { label: 'Código', minWidth: 80, align: 'left' as const },
                  { label: 'Año', minWidth: 70, align: 'left' as const },
                  { label: 'Código Predio', minWidth: 110, align: 'left' as const },
                  { label: 'Cód. Vendedor', minWidth: 110, align: 'left' as const },
                  { label: 'Vendedor', minWidth: 170, align: 'left' as const },
                  { label: 'Cód. Comprador', minWidth: 110, align: 'left' as const },
                  { label: 'Comprador', minWidth: 170, align: 'left' as const },
                  { label: 'Porcentaje', minWidth: 90, align: 'right' as const },
                  { label: 'Fecha Minuta', minWidth: 110, align: 'left' as const },
                  { label: 'Documento', minWidth: 110, align: 'left' as const },
                  { label: 'Modo Transferencia', minWidth: 150, align: 'left' as const },
                  { label: 'Valor Transferencia', minWidth: 130, align: 'right' as const },
                  { label: 'Constructor', minWidth: 90, align: 'center' as const },
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
                  <TableCell colSpan={14} align="center" sx={{ py: 8, border: 0 }}>
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
                    key={`${row.codTransferencia}-${index}`}
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
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.codTransferencia}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.anio}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.codPredio}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.codContribuyenteVenta}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 500 }}>
                      {row.nombreContribuyenteVenta || '-'}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {row.codContribuyenteCompra}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 500 }}>
                      {row.nombreContribuyenteCompra || '-'}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {row.porcentajeTransferencia.toLocaleString('es-PE', { maximumFractionDigits: 2 })}%
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.fechaMinuta}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{row.documento}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {row.descripcionModoTransferencia || row.codModoTransferencia}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        whiteSpace: 'nowrap',
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        color: theme.palette.success.main
                      }}
                    >
                      {row.valorTransferencia.toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.esConstructor ? 'Sí' : 'No'}
                        size="small"
                        color={row.esConstructor ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar transferencia" arrow>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditar(row)}
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
    </Box>
  );
};

export default ConsultaTransferencia;
