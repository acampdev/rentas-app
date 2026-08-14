// src/components/calles/CalleList.tsx
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Box,
  Typography,
  TextField,
  InputAdornment,
  TableSortLabel,
  Skeleton,
  Stack,
  useTheme,
  alpha,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  Route as RouteIcon,
  Map as MapIcon,
  Clear as ClearIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Calle } from '../../models/Calle';
import { useCalleList } from '../../hooks/useCalleList';

interface CalleListProps {
  calles: Calle[];
  onSelectCalle?: (calle: Calle) => void;
  onSelect?: (calle: Calle) => void;
  loading?: boolean;
  onSearch?: (term: string) => void;
  searchTerm?: string;
  obtenerNombreSector?: (sectorId: number) => string;
  obtenerNombreBarrio?: (barrioId: number) => string;
  onNuevaCalle?: () => void;
  onRefresh?: () => void;
}

const CalleListMUI: React.FC<CalleListProps> = ({
  calles = [],
  onSelectCalle,
  onSelect,
  loading = false,
  onSearch,
  searchTerm = '',
  obtenerNombreSector,
  obtenerNombreBarrio,
  onNuevaCalle
}) => {
  const theme = useTheme();
  
  const handleSelect = (calle: Calle) => {
    if (onSelectCalle) onSelectCalle(calle);
    if (onSelect) onSelect(calle);
  };

  const {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    orderBy,
    handleRequestSort,
    localSearchTerm,
    setLocalSearchTerm,
    selectedId,
    setSelectedId,
    paginatedCalles,
    sortedAndFilteredCalles,
    getUbicacion
  } = useCalleList({ calles, searchTerm, obtenerNombreBarrio });

  const getNombreCompleto = (calle: Calle) => {
    return `${calle.descTipoVia || calle.nombreTipoVia || ''} ${calle.nombreVia || ''}`.trim();
  };

  const getTipoViaIcon = (tipoVia?: string) => {
    const t = String(tipoVia || '').toUpperCase();
    if (t.includes('AV')) return <RouteIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
    if (t.includes('JR')) return <HomeIcon sx={{ fontSize: 16, color: 'info.main' }} />;
    return <MapIcon sx={{ fontSize: 16, color: 'success.main' }} />;
  };

  return (
    <Paper elevation={3} sx={{ width: '100%', borderRadius: 2, background: 'linear-gradient(to bottom, #ffffff, #fafafa)', border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          alignItems: 'center',
          width: '100%'
        }}>
          {/* Buscador */}
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar calle o barrio..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            sx={{
              maxWidth: { xs: '100%', sm: 400 }
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
              endAdornment: localSearchTerm && (
                <IconButton size="small" onClick={() => setLocalSearchTerm('')}>
                  <ClearIcon />
                </IconButton>
              ),
              sx: { height: 40, borderRadius: 2 }
            }}
          />
          
          <Box sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'flex-end', sm: 'flex-start' }
          }}>
            {/* Boton Buscar */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPage(0)}
              sx={{
                height: 40,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#1976d2 !important',
                color: 'white !important',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#1565c0 !important',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#f3f4f6 !important',
                  color: '#9ca3af !important',
                  border: '1px solid #e5e7eb !important',
                  boxShadow: 'none !important'
                }
              }}
            >
              Buscar
            </Button>

            {/* Boton Nuevo */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onNuevaCalle}
              sx={{
                height: 40,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: 'white !important',
                color: '#1976d2 !important',
                border: '1px solid #1976d2 !important',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04) !important'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#f3f4f6 !important',
                  color: '#9ca3af !important',
                  border: '1px solid #e5e7eb !important',
                  boxShadow: 'none !important'
                }
              }}
            >
              Nuevo
            </Button>
          </Box>
        </Box>

        {/* Tabla */}
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableSortLabel active={orderBy === 'nombreVia'} direction={orderBy === 'nombreVia' ? order : 'asc'} onClick={() => handleRequestSort('nombreVia')}>VÍA</TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableSortLabel active={orderBy === 'ubicacion'} direction={orderBy === 'ubicacion' ? order : 'asc'} onClick={() => handleRequestSort('ubicacion')}>UBICACIÓN</TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell><Skeleton /></TableCell><TableCell><Skeleton /></TableCell><TableCell><Skeleton /></TableCell></TableRow>)
              ) : paginatedCalles.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No se encontraron resultados</Typography></TableCell></TableRow>
              ) : (
                paginatedCalles.map((calle) => (
                  <TableRow key={calle.codVia || calle.id} hover selected={selectedId === (calle.codVia || calle.id)}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ p: 1, bgcolor: alpha(theme.palette.secondary.main, 0.1), borderRadius: 1 }}>{getTipoViaIcon(calle.descTipoVia || calle.nombreTipoVia)}</Box>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{getNombreCompleto(calle)}</Typography>
                          <Typography variant="caption" color="text.secondary">ID: {calle.codVia || calle.id}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', py: 1 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'flex-start',
                        gap: 1,
                        height: '100%',
                        minHeight: 32
                      }}>
                        <Chip 
                          label={calle.nombreSector || (obtenerNombreSector && calle.codSector ? obtenerNombreSector(calle.codSector) : `Sector ${calle.codSector}`)} 
                          size="small" 
                          variant="outlined" 
                          color="info" 
                          sx={{ 
                            height: 24, 
                            fontSize: '0.75rem',
                            '& .MuiChip-label': { px: 1, lineHeight: 1 }
                          }}
                        />
                        <Chip 
                          label={getUbicacion(calle)} 
                          size="small" 
                          variant="outlined" 
                          color="success" 
                          sx={{ 
                            height: 24, 
                            fontSize: '0.75rem',
                            '& .MuiChip-label': { px: 1, lineHeight: 1 }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                      <IconButton size="small" color="primary" onClick={() => { setSelectedId(calle.codVia || calle.id || null); onSelectCalle?.(calle); }}><EditIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination component="div" count={sortedAndFilteredCalles.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5, 10, 25]} />
      </Stack>
    </Paper>
  );
};

export default CalleListMUI;