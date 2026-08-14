// src/components/modal/SelectorContribuyente.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  IconButton,
  Typography,
  Box,
  Stack,
  InputAdornment,
  CircularProgress,
  Chip,
  Tooltip,
  Alert,
  alpha,
  useTheme,
  Avatar,
  Divider,
  TablePagination
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useContribuyentes, ContribuyenteListItem } from '../../hooks/useContribuyentes';
import { NotificationService } from '../utils/Notification';
import { Contribuyente } from '../../models/Contribuyente';

// Props del componente
interface SelectorContribuyenteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContribuyente: (contribuyente: any) => void;
  selectedId?: number;
  title?: string;
}

/**
 * Modal para buscar y seleccionar un contribuyente
 */
const SelectorContribuyente: React.FC<SelectorContribuyenteProps> = ({
  isOpen,
  onClose,
  onSelectContribuyente,
  selectedId,
  title = 'Seleccionar Contribuyente'
}) => {
  const theme = useTheme();
  
  // Estados para búsqueda, paginación y selección temporal
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [seleccionadoTemp, setSeleccionadoTemp] = useState<ContribuyenteListItem | null>(null);
  
  // Hook de contribuyentes
  const { 
    contribuyentes, 
    loading, 
    error,
    cargarContribuyentes
  } = useContribuyentes();

  // Referencias para evitar cargas duplicadas
  const hasLoadedRef = useRef(false);
  const previousIsOpenRef = useRef(false);

  // Cargar datos cuando se abre el modal por primera vez
  useEffect(() => {
    // Si el modal se acaba de abrir (transición de cerrado a abierto)
    if (isOpen && !previousIsOpenRef.current) {
      // Solo cargar si no están cargados o si no se está cargando actualmente
      if (contribuyentes.length === 0 && !loading && !hasLoadedRef.current) {
        console.log('🔓 [SelectorContribuyente] Modal abierto, cargando contribuyentes...');
        cargarContribuyentes();
        hasLoadedRef.current = true;
      }
    }
    // Actualizar referencia del estado anterior
    previousIsOpenRef.current = isOpen;
  }, [isOpen, contribuyentes.length, loading, cargarContribuyentes]);

  // Sincronizar selección temporal cuando el modal se abre o cambian los contribuyentes
  useEffect(() => {
    if (isOpen) {
      if (selectedId && contribuyentes.length > 0) {
        const found = contribuyentes.find(c => c.codigo === selectedId);
        setSeleccionadoTemp(found || null);
      } else {
        setSeleccionadoTemp(null);
      }
    }
  }, [isOpen, selectedId, contribuyentes]);

  // Filtrar contribuyentes según el término de búsqueda
  const contribuyentesFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return contribuyentes;
    
    const term = searchTerm.toLowerCase();
    return contribuyentes.filter(c => 
      c.contribuyente?.toLowerCase().includes(term) ||
      c.documento?.toLowerCase().includes(term) ||
      c.codigo?.toString().includes(term)
    );
  }, [contribuyentes, searchTerm]);

  // Manejar cambio de página
  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejar la confirmación de la selección
  const handleConfirmarSeleccion = () => {
    if (seleccionadoTemp) {
      onSelectContribuyente(seleccionadoTemp);
      onClose();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3, 
          boxShadow: 10,
          height: '600px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: alpha(theme.palette.primary.main, 0.05),
        flexShrink: 0
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <PersonIcon />
          </Avatar>
          <Typography variant="h6" fontWeight={700} color="primary.dark">
            {title}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Barra de Búsqueda */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre, documento o código..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: 2, bgcolor: 'background.paper' }
          }}
          sx={{ mb: 3, flexShrink: 0 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, flexShrink: 0 }}>
            Error al cargar contribuyentes: {error}
          </Alert>
        )}

        {/* Tabla de Resultados */}
        <TableContainer 
          component={Paper} 
          variant="outlined" 
          sx={{ 
            borderRadius: 2, 
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: alpha(theme.palette.divider, 0.05),
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.4),
              },
            },
          }}
        >
          <Table stickyHeader size="small">
            <TableHead
              sx={{
                '& .MuiTableCell-stickyHeader': {
                  top: 0,
                  zIndex: 3,
                  backgroundColor: theme.palette.background.paper,
                  backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})`,
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                  boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.08)}`,
                  fontWeight: 700,
                  py: 1.5
                }
              }}
            >
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Contribuyente</TableCell>
                <TableCell>Documento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && contribuyentes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={40} thickness={4} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Cargando padrón de contribuyentes...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : contribuyentesFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No se encontraron contribuyentes</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                contribuyentesFiltrados
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((c) => {
                    const isSelected = seleccionadoTemp?.codigo === c.codigo;
                    return (
                      <TableRow 
                        key={c.codigo} 
                        hover
                        selected={isSelected}
                        onClick={() => setSeleccionadoTemp(c)}
                        onDoubleClick={() => {
                          onSelectContribuyente(c);
                          onClose();
                        }}
                        sx={{ 
                          cursor: 'pointer', 
                          transition: 'background 0.2s',
                          '&.Mui-selected': {
                            bgcolor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
                            '&:hover': {
                              bgcolor: `${alpha(theme.palette.primary.main, 0.12)} !important`,
                            }
                          }
                        }}
                      >
                        <TableCell sx={{ py: 1 }}>
                          <Chip 
                            label={c.codigo} 
                            size="small" 
                            variant="outlined" 
                            color={isSelected ? 'primary' : 'default'}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" fontWeight={isSelected ? 700 : 500}>
                            {c.contribuyente}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {c.direccion || 'Sin dirección registrada'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <BadgeIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{c.documento}</Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={contribuyentesFiltrados.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas:"
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ flexShrink: 0 }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3, borderTop: 1, borderColor: 'divider', gap: 1.5, flexShrink: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto' }}>
          Total registros: {contribuyentesFiltrados.length}
        </Typography>
        {seleccionadoTemp && (
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', mr: 2 }}>
            Seleccionado: {seleccionadoTemp.contribuyente}
          </Typography>
        )}
        {/* Botón Seleccionar */}
        <Button 
          onClick={handleConfirmarSeleccion} 
          variant="contained" 
          disabled={!seleccionadoTemp}
          startIcon={<CheckCircleIcon />}
          sx={{ 
            borderRadius: 2, 
            bgcolor: '#3b82f6 !important', 
            color: 'white !important',
            fontWeight: 'bold',
            '&.Mui-disabled': {
              bgcolor: `${alpha('#3b82f6', 0.5)} !important`,
              color: 'rgba(255, 255, 255, 0.7) !important'
            }
          }}
        >
          Seleccionar
        </Button>
        {/* Botón para cancelar */}
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectorContribuyente;
