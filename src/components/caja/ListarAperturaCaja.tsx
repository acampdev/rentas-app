// src/components/caja/ListarAperturaCaja.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Button,
  TextField,
  Autocomplete
} from '@mui/material';
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAperturaCajas } from '../../hooks/useAperturaCajas';
import { useUsuarios } from '../../hooks/useUsuarios';
import { AperturaCaja } from '../../models';
import { getAuthenticatedUserCode } from '../../config/api.unified.config';

// Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    minWidth: '850px',
    maxWidth: '950px',
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: 'white',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

interface ListarAperturaCajaProps {
  open: boolean;
  onClose: () => void;
  onOperarCaja?: (
    codAperturaCaja: number,
    codUsuario: number,
    caja: string,
    montoApertura: number,
    fechaApertura: string
  ) => void;
}

const ListarAperturaCaja: React.FC<ListarAperturaCajaProps> = ({ open, onClose, onOperarCaja }) => {
  const { listarAperturasUsuario, loading } = useAperturaCajas();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  
  // Filtrar los usuarios que tienen rol Cajero
  const cajeros = usuarios.filter(u => u.rol?.trim().toLowerCase() === 'cajero');

  const [selectedUsuario, setSelectedUsuario] = useState<any>(null);
  const [aperturas, setAperturas] = useState<AperturaCaja[]>([]);

  // Inicializar el usuario seleccionado con el usuario logeado al abrir
  useEffect(() => {
    if (open && cajeros.length > 0 && !selectedUsuario) {
      let currentCodUsuario: number | null = null;
      try {
        currentCodUsuario = getAuthenticatedUserCode();
      } catch {
        currentCodUsuario = null;
      }
      
      const matched = currentCodUsuario
        ? cajeros.find(u => u.codUsuario === currentCodUsuario)
        : undefined;
      if (matched) {
        setSelectedUsuario(matched);
      } else {
        setSelectedUsuario(cajeros[0]);
      }
    }
  }, [open, cajeros, selectedUsuario]);

  // Cargar aperturas para el usuario seleccionado
  const cargarAperturas = useCallback(async () => {
    if (!selectedUsuario) return;
    
    const result = await listarAperturasUsuario(selectedUsuario.codUsuario);
    // Ordenar por fecha de apertura descendente
    const sorted = [...result].sort((a, b) => {
      const dateA = a.fechaApertura ? new Date(a.fechaApertura).getTime() : 0;
      const dateB = b.fechaApertura ? new Date(b.fechaApertura).getTime() : 0;
      return dateB - dateA;
    });
    setAperturas(sorted);
  }, [listarAperturasUsuario, selectedUsuario]);

  useEffect(() => {
    if (open && selectedUsuario) {
      cargarAperturas();
    }
  }, [open, selectedUsuario, cargarAperturas]);

  // Limpiar selección de usuario al cerrar el diálogo
  const handleClose = () => {
    setSelectedUsuario(null);
    setAperturas([]);
    onClose();
  };

  // Formatear montos
  const formatMonto = (monto?: number | null) => {
    if (monto === undefined || monto === null) return '---';
    return `S/. ${monto.toFixed(2)}`;
  };

  // Formatear fechas
  const formatFecha = (fechaStr?: string | null) => {
    if (!fechaStr) return '---';
    try {
      const date = new Date(fechaStr);
      if (isNaN(date.getTime())) return fechaStr;
      return date.toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return fechaStr;
    }
  };

  // Renderizar badge de estado
  const renderEstadoBadge = (estado?: string) => {
    const norm = (estado || '').toUpperCase();
    if (norm === 'ABIERTA' || norm === 'APERTURADO' || norm === 'APERTURADA') {
      return (
        <Chip
          label="ABIERTA"
          color="success"
          size="small"
          sx={{
            fontWeight: 'bold',
            borderRadius: '6px',
            backgroundColor: '#2e7d32',
            color: 'white'
          }}
        />
      );
    }
    return (
      <Chip
        label="CERRADA"
        color="default"
        size="small"
        sx={{
          fontWeight: 'bold',
          borderRadius: '6px'
        }}
      />
    );
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableRestoreFocus
    >
      {/* Header */}
      <HeaderBox>
        <Box display="flex" alignItems="center" gap={1}>
          <HistoryIcon />
          <Typography variant="h6" fontWeight="bold">
            Historial de Aperturas y Cierres de Caja
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={cargarAperturas}
            sx={{ color: 'white' }}
            disabled={loading || !selectedUsuario}
            size="small"
          >
            {loading ? <CircularProgress color="inherit" size={20} /> : <RefreshIcon />}
          </IconButton>
          <IconButton
            onClick={handleClose}
            sx={{ color: 'white' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </HeaderBox>

      <DialogContent sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
        {/* Controles de Filtro */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
          <Autocomplete
            size="small"
            options={cajeros}
            loading={loadingUsuarios}
            value={selectedUsuario}
            onChange={(_event, newValue) => {
              setSelectedUsuario(newValue);
            }}
            getOptionLabel={(option) => `${option.nombrePersona} (${option.username?.trim()})`}
            isOptionEqualToValue={(option, value) => option.codUsuario === value.codUsuario}
            sx={{ width: 380 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filtrar por Cajero"
                placeholder="Seleccionar cajero..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingUsuarios ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <Typography variant="body2" color="textSecondary" fontWeight="medium">
            Mostrando {aperturas.length} aperturas
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Table sx={{ minWidth: 700 }} size="small" aria-label="tabla aperturas">
            <TableHead sx={{ backgroundColor: 'rgba(25, 118, 210, 0.08)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>N° Apertura</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Caja</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Turno</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha Apertura</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Monto Inicial</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha Cierre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Monto Cierre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && aperturas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" sx={{ mt: 1 }} color="textSecondary">
                      Cargando aperturas...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : !selectedUsuario ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="textSecondary" fontWeight="medium">
                      Seleccione un cajero para listar sus aperturas.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : aperturas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="textSecondary" fontWeight="medium">
                      No se encontraron registros de aperturas para este usuario.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                aperturas.map((row) => (
                  <TableRow
                    key={row.codAperturaCaja}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#fdfdfd' } }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {row.numeroApertura || (row.codAperturaCaja
                        ? String(row.codAperturaCaja).padStart(10, '0')
                        : 'Sin identificar')}
                    </TableCell>
                    <TableCell>{row.caja?.trim() || 'Sin identificar'}</TableCell>
                    <TableCell>{row.turno || '---'}</TableCell>
                    <TableCell>{formatFecha(row.fechaApertura)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#1b5e20' }}>
                      {formatMonto(row.montoApertura)}
                    </TableCell>
                    <TableCell>{formatFecha(row.fechaCierre)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: row.montoCierre ? '#b71c1c' : 'text.primary' }}>
                      {formatMonto(row.montoCierre)}
                    </TableCell>
                    <TableCell align="center">{renderEstadoBadge(row.estado)}</TableCell>
                    <TableCell align="center">
                      {(row.estado === 'ABIERTA' || row.estado === 'APERTURADO' || row.estado === 'APERTURADA') && onOperarCaja && (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          disabled={!row.codAperturaCaja || !selectedUsuario?.codUsuario}
                          onClick={() => onOperarCaja(
                            row.codAperturaCaja!,
                            selectedUsuario.codUsuario,
                            row.caja?.trim() || '',
                            row.montoApertura,
                            row.fechaApertura || ''
                          )}
                          sx={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            minWidth: 'auto',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: '4px'
                          }}
                        >
                          Operar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ListarAperturaCaja;
