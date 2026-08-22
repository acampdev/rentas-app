// src/components/aranceles/ArancelList.tsx
import React, { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Chip,
  Tooltip,
  useTheme,
  alpha,
  TextField,
  Button,
  Pagination,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { ArancelData } from '../../services/arancelService';

interface ArancelListProps {
  aranceles: ArancelData[];
  onEditArancel: (arancel: ArancelData) => void;
  loading?: boolean;
  onSearch?: (searchParams: { anio: number; parametroBusqueda?: string }) => void;
  onNuevo?: () => void;
  onRefresh?: () => void;
}

export const ArancelList: React.FC<ArancelListProps> = ({
  aranceles,
  onEditArancel,
  loading = false,
  onSearch,
  onNuevo
}) => {
  const theme = useTheme();
  const [anioFiltro, setAnioFiltro] = useState<number>(new Date().getFullYear());
  const [paramBusqueda, setParamBusqueda] = useState<string>('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleBuscar = useCallback(() => {
    if (onSearch) {
      onSearch({ 
        anio: anioFiltro, 
        parametroBusqueda: paramBusqueda 
      });
    }
    setPage(1);
  }, [anioFiltro, onSearch, paramBusqueda]);

  // Efecto para búsqueda automática al cambiar el año
  useEffect(() => {
    handleBuscar();
  }, [handleBuscar]);

  const handlePageChange = (_: any, value: number) => setPage(value);

  const paginatedAranceles = aranceles.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPaginas = Math.ceil(aranceles.length / rowsPerPage);

  const headerStyle = {
    bgcolor: alpha(theme.palette.primary.main, 0.05),
    fontWeight: 700,
    fontSize: '0.75rem',
    color: theme.palette.primary.dark
  };

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid', 
        borderColor: 'divider', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        alignItems: 'center', 
        bgcolor: alpha(theme.palette.grey[50], 0.5) 
      }}>
        <Typography variant="subtitle2" sx={{ mr: 2, fontWeight: 700 }}>LISTADO DE ARANCELES</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minWidth: '300px' }}>
          <TextField 
            size="small" 
            label="Búsqueda de Aranceles" 
            placeholder="Buscar por vía, barrio..."
            value={paramBusqueda} 
            onChange={(e) => setParamBusqueda(e.target.value)} 
            sx={{ flexGrow: 1 }}
            onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
          />
          
          <TextField 
            size="small" 
            label="Año" 
            type="number" 
            value={anioFiltro} 
            onChange={(e) => setAnioFiltro(Number(e.target.value))} 
            sx={{ width: 100 }} 
          />
        </Box>

        <Button 
          variant="contained" 
          startIcon={<SearchIcon />} 
          onClick={handleBuscar} 
          disabled={loading}
          style={{ 
            backgroundColor: '#10b981', // Verde Esmeralda del proyecto
            color: 'white',
            fontWeight: 700,
            minWidth: '120px',
            height: '40px'
          }}
          sx={{ 
            '&:hover': {
              backgroundColor: '#059669 !important',
            }
          }}
        >
          Buscar
        </Button>
        
        {onNuevo && (
          <Button variant="outlined" startIcon={<AddIcon />} onClick={onNuevo}>
            Nuevo
          </Button>
        )}
      </Box>

      <TableContainer
        sx={{
          maxHeight: { xs: 360, sm: 440, md: 'calc(100vh - 430px)' },
          minHeight: { md: 300 },
          overflowY: 'auto',
          overflowX: 'auto',
          scrollbarGutter: 'stable'
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>CÓDIGO</TableCell>
              <TableCell sx={headerStyle}>DIRECCIÓN</TableCell>
              <TableCell align="center" sx={headerStyle}>AÑO</TableCell>
              <TableCell align="right" sx={headerStyle}>COSTO ARANCEL (S/)</TableCell>
              <TableCell align="center" sx={headerStyle}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton height={40} /></TableCell></TableRow>
              ))
            ) : aranceles.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No se encontraron registros</Typography></TableCell></TableRow>
            ) : (
              paginatedAranceles.map((row) => (
                <TableRow key={row.codArancel || Math.random()} hover>
                  <TableCell><Chip label={row.codArancel || '-'} size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{row.direccionCompleta}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.sector} | {row.barrio}</Typography>
                  </TableCell>
                  <TableCell align="center">{row.anio}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700} color="success.main">S/ {(row.costoArancel || row.costo || 0).toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => onEditArancel(row)}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.16) }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPaginas > 1 && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
          <Pagination count={totalPaginas} page={page} onChange={handlePageChange} color="primary" size="small" />
        </Box>
      )}
    </Paper>
  );
};

export default ArancelList;
