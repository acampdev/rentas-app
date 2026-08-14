// src/components/resolucionInteres/ConsultaResolucion.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { resolucionInteresService } from '../../services/resolucionInteresService';
import type { ResolucionInteresData } from '../../services/resolucionInteresService';

interface ConsultaResolucionProps {
  onEditar: (item: ResolucionInteresData) => void;
  onEliminar: (id: number) => Promise<void>;
}

const ConsultaResolucion: React.FC<ConsultaResolucionProps> = ({
  onEditar,
  onEliminar
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [resoluciones, setResoluciones] = useState<ResolucionInteresData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleBuscar = async () => {
    const code = parseInt(searchCode);
    if (isNaN(code)) {
      setError('El código de resolución de interés debe ser un número válido.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      console.log(`🔍 [ConsultaResolucion] Buscando resolución con código: ${code}`);
      const data = await resolucionInteresService.obtenerTodas({ codResolucionInteres: code });
      setResoluciones(data || []);
    } catch (err: any) {
      console.error('Error al buscar resolución:', err);
      setError(err.message || 'Error al conectar con el servidor.');
      setResoluciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedId !== null) {
      try {
        await onEliminar(selectedId);
        // Remover de la vista local después de eliminar lógicamente
        setResoluciones(prev => prev.filter(item => item.codResolucionInteres !== selectedId));
      } catch (err) {
        console.error(err);
      } finally {
        setDeleteConfirmOpen(false);
        setSelectedId(null);
      }
    }
  };

  return (
    <Box>
      {/* Buscador de Código de Resolución */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
          Buscar por Código de Resolución
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              fullWidth
              label="Código Resolución Interés"
              type="number"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              variant="outlined"
              placeholder="Ej. 2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleBuscar();
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleBuscar}
              disabled={!searchCode || loading}
              sx={{
                height: 56,
                bgcolor: '#3b82f6 !important',
                color: 'white !important',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#2563eb !important'
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(0, 0, 0, 0.12) !important',
                  color: 'rgba(0, 0, 0, 0.26) !important'
                }
              }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Alertas */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {hasSearched && resoluciones.length === 0 && !loading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No se encontró ninguna resolución de interés con el código <strong>{searchCode}</strong>.
        </Alert>
      )}

      {!hasSearched && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Ingrese el Código de la Resolución de Interés que desea consultar.
        </Alert>
      )}

      {/* Tabla de Resultados */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        resoluciones.length > 0 && (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Código</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Año Fiscal</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Tasa (%)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Fecha Inicio</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Fecha Fin</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Estado</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resoluciones.map((item) => (
                  <TableRow key={item.codResolucionInteres} hover>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>{item.codResolucionInteres}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell align="center">{item.anioFiscal || '-'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {item.tasa !== null ? `${item.tasa.toFixed(2)}%` : '-'}
                    </TableCell>
                    <TableCell align="center">{item.fechaInicioStr || '-'}</TableCell>
                    <TableCell align="center">{item.fechaFinStr || '-'}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.estado || 'ACTIVO'}
                        size="small"
                        color={item.estado === 'ACTIVO' ? 'success' : 'default'}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEditar(item)}
                          title="Editar resolución"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(item.codResolucionInteres)}
                          title="Eliminar resolución"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white', fontWeight: 600 }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            ¿Está seguro de que desea eliminar lógicamente esta resolución de interés? Esta acción cambiará su estado en el sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            variant="outlined"
            sx={{
              borderColor: 'rgba(0,0,0,0.23) !important',
              color: 'text.primary !important',
              fontWeight: 'bold'
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ fontWeight: 'bold' }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultaResolucion;