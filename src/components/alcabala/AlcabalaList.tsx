// src/components/alcabala/AlcabalaList.tsx
import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Chip,
  Pagination,
  useTheme,
  alpha,
  Skeleton,
  IconButton,
  TextField,
  Button,
  Tooltip,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  
  Edit as EditIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { AlcabalaData } from '../../services/alcabalaService';

interface AlcabalaListProps {
  alcabalas: AlcabalaData[];
  paginacion: {
    pagina: number;
    porPagina: number;
    total: number;
  };
  onCambiarPagina: (pagina: number) => void;
  onBuscar: (anio: number | null) => void;
  onNuevo: () => void;
  loading?: boolean;
  onEditar?: (alcabala: AlcabalaData) => void;
}

/**
 * Componente para mostrar la lista de valores de Alcabala con diseño mejorado
 */
const AlcabalaList: React.FC<AlcabalaListProps> = ({
  alcabalas,
  paginacion,
  onCambiarPagina,
  onBuscar,
  onNuevo: _onNuevo,
  loading = false,
  onEditar
}) => {
  const theme = useTheme();
  const [anioFiltro, setAnioFiltro] = useState<number | ''>(new Date().getFullYear());

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onCambiarPagina(value);
  };

  const handleBuscar = () => {
    onBuscar(anioFiltro === '' ? null : anioFiltro);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const handleLimpiar = () => {
    setAnioFiltro('');
    onBuscar(null);
  };

  const totalPaginas = Math.ceil(paginacion.total / paginacion.porPagina);

  return (
    <Box sx={{ width: '100%' }}>
      {/* SECCIÓN DE CONSULTA */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom display="flex" alignItems="center" gap={1}>
          <SearchIcon color="primary" fontSize="small" /> Consultar Tasas Alcabala
        </Typography>
        <Divider sx={{ mb: 2.5 }} />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <TextField
            label="Filtrar por Año"
            type="number"
            size="small"
            value={anioFiltro}
            onChange={(e) => setAnioFiltro(e.target.value === '' ? '' : Number(e.target.value))}
            onKeyPress={handleKeyPress}
            sx={{ width: 150 }}
            placeholder="Ej: 2025"
          />
          
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleBuscar}
            disabled={loading}
            style={{ 
              backgroundColor: '#3b82f6', // Azul para consulta
              color: 'white',
              fontWeight: 700,
              height: '40px',
              minWidth: '100px'
            }}
            sx={{ 
              textTransform: 'none',
              '&:hover': { bgcolor: '#2563eb !important' }
            }}
          >
            Buscar
          </Button>

          {loading && <CircularProgress size={24} />}
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleLimpiar}
            disabled={loading}
            sx={{ 
              height: '40px', 
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Limpiar
          </Button>
        </Box>
      </Box>

      {/* TABLA DE RESULTADOS */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DashboardIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
            HISTORIAL DE TASAS REGISTRADAS
          </Typography>
        </Box>

        <TableContainer sx={{ maxHeight: 500 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  AÑO FISCAL
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  TASA ALCABALA
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  ESTADO
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  ACCIONES
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}><TableCell colSpan={4}><Skeleton height={45} /></TableCell></TableRow>
                ))
              ) : alcabalas.length > 0 ? (
                alcabalas.map((row, index) => (
                  <TableRow key={row.id || index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{row.anio}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={row.tasa.toFixed(2)} 
                        size="small" 
                        color="success" 
                        variant="outlined" 
                        sx={{ fontWeight: 700, minWidth: '80px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {(() => {
                        const rawState = (row.estado || '').toUpperCase();
                        const isActivo = rawState === 'ACTIVO' || rawState === '0201' || rawState === '1';
                        const labelState = isActivo ? 'ACTIVO' : rawState === '0202' || rawState === 'INACTIVO' ? 'INACTIVO' : (row.estado || 'ACTIVO');
                        return (
                          <Chip 
                            label={labelState} 
                            size="small" 
                            color={isActivo ? 'success' : 'default'} 
                            variant="filled"
                            sx={{ fontSize: '0.65rem', height: 20, fontWeight: 'bold' }}
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Editar Tasa">
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => onEditar?.(row)}
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">No se encontraron registros para el criterio seleccionado</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {totalPaginas > 1 && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination count={totalPaginas} page={paginacion.pagina} onChange={handlePageChange} color="primary" size="small" />
        </Box>
      )}
    </Box>
  );
};

export default AlcabalaList;
