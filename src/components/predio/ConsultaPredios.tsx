// src/components/predio/ConsultaPredios.tsx
import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Stack,
  Typography,
  Chip,
  Button,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useConsultaPredios, formatDireccion } from '../../hooks/useConsultaPredios';

const ConsultaPredios: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    predios,
    loading,
    filteredPredios,
    paginatedPredios,
    page,
    rowsPerPage,
    filtros,
    setFiltros,
    setPage,
    setRowsPerPage,
    handleBuscar,
    handleEdit,
    handleView
  } = useConsultaPredios();

  const getEstadoChip = (estado?: string) => {
    const estadoUpper = estado?.toUpperCase();
    if (estadoUpper === 'TERMINADO') return <Chip label="Terminado" color="success" size="small" />;
    if (estadoUpper === 'EN_CONSTRUCCION') return <Chip label="En Construcción" color="warning" size="small" />;
    return <Chip label={estado || 'Sin Estado'} size="small" />;
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        {/* Filtros */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Año */}
          <Box sx={{ flex: '0 0 90px' }}><TextField fullWidth size="small" label="Año" type="number" value={filtros.anio} onChange={(e) => setFiltros({ ...filtros, anio: parseInt(e.target.value) })} /></Box>
          {/* Código Predio */}
          <Box sx={{ flex: '0 0 120px' }}><TextField fullWidth size="small" label="Código Predio" value={filtros.codPredioBase} onChange={(e) => setFiltros({ ...filtros, codPredioBase: e.target.value })} /></Box>
          {/* Botones */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {/* Botón para buscar predios */}
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleBuscar}
              disabled={loading}
              sx={{
                height: 40,
                backgroundColor: '#3b82f6 !important', // Azul premium coherente
                color: 'white !important',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 1.5,
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
                '&:hover': {
                  backgroundColor: '#2563eb !important',
                  boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                },
                '&.Mui-disabled': {
                  backgroundColor: `${alpha('#3b82f6', 0.5)} !important`,
                  color: 'rgba(255, 255, 255, 0.7) !important',
                  boxShadow: 'none'
                }
              }}
            >
              Buscar
            </Button>
            {/* Botón para nuevo predio */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/predio/nuevo')}
              sx={{
                height: 40,
                backgroundColor: '#10b981 !important', // Verde esmeralda premium
                color: 'white !important',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 1.5,
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                '&:hover': {
                  backgroundColor: '#059669 !important',
                  boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                },
                '&.Mui-disabled': {
                  backgroundColor: `${alpha('#10b981', 0.5)} !important`,
                  color: 'rgba(255, 255, 255, 0.7) !important',
                  boxShadow: 'none'
                }
              }}
            >
              Nuevo
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Tabla de predios */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: alpha(theme.palette.primary.main, 0.05), borderBottom: `2px solid ${theme.palette.primary.main}` }}>
          <Typography variant="h6" fontWeight={600} display="flex" alignItems="center" gap={1}><HomeIcon color="primary" /> Lista de Predios</Typography>
          <Chip label={`Total: ${predios.length}`} color="primary" size="small" />
        </Box>

        <TableContainer
          sx={{
            maxHeight: 400,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: alpha(theme.palette.grey[200], 0.5),
              borderRadius: 2,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: alpha(theme.palette.primary.main, 0.3),
              borderRadius: 2,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.5),
              }
            }
          }}
        >
          <Table stickyHeader sx={{ minWidth: 1300 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>AÑO</TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>CÓDIGO</TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>DIRECCIÓN</TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>CONDUCTOR</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>ÁREA m²</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>VAL. CONST. (S/)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>VAL. TERRENO (S/)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>VAL. ARANCEL (S/)</TableCell>
                <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>ESTADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={10} align="center" sx={{ py: 6 }}><CircularProgress /><Typography>Cargando predios...</Typography></TableCell></TableRow>
              ) : paginatedPredios.length > 0 ? (
                paginatedPredios.map((p) => (
                  <TableRow key={p.codPredio || p.codigoPredio} hover>
                    <TableCell>{p.anio}</TableCell>
                    <TableCell><Chip label={p.codPredioBase || p.codigoPredio} size="small" color="primary" variant="outlined" /></TableCell>
                    <TableCell>{formatDireccion(p.direccion)}</TableCell>
                    <TableCell><Chip label={p.conductor} size="small" variant="filled" sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }} /></TableCell>
                    <TableCell align="center">{p.areaTerreno?.toFixed(2)}</TableCell>
                    <TableCell align="right">{p.valorTotalConstruccion ? `S/ ${Number(p.valorTotalConstruccion).toFixed(2)}` : 'S/ 0.00'}</TableCell>
                    <TableCell align="right">{p.valorTerreno ? `S/ ${Number(p.valorTerreno).toFixed(2)}` : 'S/ 0.00'}</TableCell>
                    <TableCell align="right">{p.costoArancel ? `S/ ${Number(p.costoArancel).toFixed(2)}` : 'S/ 0.00'}</TableCell>
                    <TableCell>{getEstadoChip(p.estadoPredio)}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <IconButton size="small" onClick={() => handleView(p)} color="info"><VisibilityIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleEdit(p)} color="primary"><EditIcon fontSize="small" /></IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={10} align="center" sx={{ py: 8 }}><Typography color="text.secondary">No se encontraron predios</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination component="div" count={filteredPredios.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5, 10, 25]} />
      </Paper>
    </Box>
  );
};

export default ConsultaPredios;
