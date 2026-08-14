// src/components/resolucionInteres/ResolucionInteres.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material';
import type { ResolucionInteresData } from '../../services/resolucionInteresService';

interface ResolucionInteresProps {
  resolucionSeleccionada: ResolucionInteresData | null;
  onGuardar: (data: { anioFiscal: number; descripcion: string; tasa: number }) => Promise<void>;
  onNuevo: () => void;
  modoEdicion: boolean;
  loading: boolean;
}

const ResolucionInteres: React.FC<ResolucionInteresProps> = ({
  resolucionSeleccionada,
  onGuardar,
  onNuevo,
  modoEdicion,
  loading
}) => {
  const [anioFiscal, setAnioFiscal] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [tasa, setTasa] = useState<string>('');

  // Sincronizar estado cuando se selecciona una resolución para editar
  useEffect(() => {
    if (resolucionSeleccionada) {
      setAnioFiscal(resolucionSeleccionada.anioFiscal?.toString() || '');
      setDescripcion(resolucionSeleccionada.descripcion || '');
      setTasa(resolucionSeleccionada.tasa?.toString() || '');
    } else {
      handleLimpiar();
    }
  }, [resolucionSeleccionada]);

  const handleLimpiar = () => {
    setAnioFiscal('');
    setDescripcion('');
    setTasa('');
    onNuevo();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valAnio = parseInt(anioFiscal);
    const valTasa = parseFloat(tasa);

    if (isNaN(valAnio) || isNaN(valTasa) || !descripcion.trim()) {
      return;
    }

    onGuardar({
      anioFiscal: valAnio,
      descripcion: descripcion.trim(),
      tasa: valTasa
    });
  };

  const formValido = anioFiscal.trim() !== '' && descripcion.trim() !== '' && tasa.trim() !== '';

  return (
    <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight={600} color="primary.main">
        {modoEdicion ? 'Editar Resolución de Interés' : 'Nueva Resolución de Interés'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete los campos para registrar o actualizar los valores de tasa de interés anuales.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Año Fiscal"
              type="number"
              value={anioFiscal}
              onChange={(e) => setAnioFiscal(e.target.value)}
              required
              disabled={loading}
              inputProps={{ min: 2000, max: 2100 }}
              helperText="Ej. 2026"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Tasa de Interés (%)"
              type="number"
              value={tasa}
              onChange={(e) => setTasa(e.target.value)}
              required
              disabled={loading}
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              helperText="Tasa porcentual anual"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Descripción de la Resolución"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              disabled={loading}
              multiline
              rows={2}
              placeholder="Ej. O.M. N° 025-2025-MDE ACTUALIZADA"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ResetIcon />}
                onClick={handleLimpiar}
                disabled={loading}
                sx={{
                  borderColor: '#ef4444 !important',
                  color: '#ef4444 !important',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.08) !important',
                    borderColor: '#dc2626 !important'
                  }
                }}
              >
                Limpiar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!formValido || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{
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
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ResolucionInteres;